import { TriniumLogger } from './logger.js';
import { SETTINGS } from './settings.js';

class GMScreen {
  static init() {
    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    Hooks.on('renderChatLog', this.initializeGMScreenButton.bind(this));
    Hooks.on('updateSetting', this.refreshGMScreen.bind(this));
    this.logger.info('GM Screen initialized');
  }

  static initializeGMScreenButton(chatLog, html) {
    if (!game.user.isGM) return;

    const chatControls = html.find('#chat-controls');
    if (!chatControls.length) {
      this.logger.error('No chat controls found. Unable to initialize GM Screen button.');
      return;
    }

    const gmScreenBtn = $(`<a class="tcb-gm-screen-button" title="Toggle GM Screen">
      <i class="fas fa-book-open"></i>
    </a>`);

    gmScreenBtn.click(this.toggleGMScreen.bind(this));
    chatControls.prepend(gmScreenBtn);
  }

  static createGMScreen() {
    const numberOfSubscreens = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.NUMBER_OF_SUBSCREENS);
    const mode = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_MODE);
    const subscreenWidth = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.SUBSCREEN_WIDTH);
    const gmScreenHeight = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_HEIGHT);
    const leftMargin = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_LEFT_MARGIN);
    const rightMargin = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_RIGHT_MARGIN);

    let gmScreenHtml = `<div id="tcb-gm-screen" class="tcb-app tcb-${mode}-mode" style="--subscreen-width: ${subscreenWidth}px; --gm-screen-height: ${gmScreenHeight}%; --number-of-subscreens: ${numberOfSubscreens}; --left-margin: ${leftMargin}px; --right-margin: ${rightMargin}px;">`;
    for (let i = 1; i <= numberOfSubscreens; i++) {
      gmScreenHtml += `
      <div class="tcb-subscreen">
        <header class="tcb-window-header">
          <div class="tcb-gm-screen-controls">
            <button class="tcb-tab-button" data-subscreen="${i}" data-tab="1">1</button>
            <button class="tcb-tab-button" data-subscreen="${i}" data-tab="2">2</button>
            <button class="tcb-tab-button" data-subscreen="${i}" data-tab="3">3</button>
            <button class="tcb-tab-button" data-subscreen="${i}" data-tab="4">4</button>
            <button class="tcb-edit-button" data-subscreen="${i}"><i class="fas fa-edit"></i></button>
          </div>
        </header>
        <section class="tcb-window-content"></section>
      </div>
    `;
    }

    gmScreenHtml += '</div>';

    $('#interface').append($(gmScreenHtml));

    $('#tcb-gm-screen .tcb-edit-button').click((event) => {
      const subscreen = $(event.currentTarget).data('subscreen');
      this.openEditor(subscreen);
    });

    $('#tcb-gm-screen .tcb-tab-button').click((event) => {
      const tab = $(event.currentTarget).data('tab');
      const subscreen = $(event.currentTarget).data('subscreen');
      this.switchTab(tab, subscreen);
    });

    for (let i = 1; i <= numberOfSubscreens; i++) {
      this.switchTab(1, i);
    }
  }

  static toggleGMScreen() {
    let gmScreen = $('#tcb-gm-screen');
    if (gmScreen.length) {
      gmScreen.toggleClass('tcb-visible');
    } else {
      this.createGMScreen();
      gmScreen = $('#tcb-gm-screen');
      void gmScreen[0].offsetWidth;
      gmScreen.addClass('tcb-visible');
    }
    this.logger.debug('GM Screen toggled');
  }

  static refreshGMScreen(setting, data) {
    const tabPattern = new RegExp(`${SETTINGS.MODULE_NAME}\.gmScreenContent_tab[1-4]`);
    if (
      tabPattern.test(setting.key) ||
      [
        SETTINGS.NUMBER_OF_SUBSCREENS,
        SETTINGS.GM_SCREEN_MODE,
        SETTINGS.SUBSCREEN_WIDTH,
        SETTINGS.GM_SCREEN_HEIGHT,
      ].includes(setting.key)
    ) {
      $('#tcb-gm-screen').remove();
      if ($('#tcb-gm-screen').hasClass('tcb-visible')) {
        this.createGMScreen();
        $('#tcb-gm-screen').addClass('tcb-visible');
      }
    }
  }

static switchTab(tab, subscreen) {
    const content = game.settings.get(SETTINGS.MODULE_NAME, `gmScreenContent_tab${tab}`);
    const renderedContent = window.marked.parse(content);
    $(`#tcb-gm-screen .tcb-subscreen:nth-child(${subscreen}) .tcb-window-content`).html(renderedContent);
    $(`#tcb-gm-screen .tcb-subscreen:nth-child(${subscreen}) .tcb-tab-button`).removeClass('tcb-active');
    $(`#tcb-gm-screen .tcb-subscreen:nth-child(${subscreen}) .tcb-tab-button[data-tab="${tab}"]`).addClass('tcb-active');
  }

  static openEditor(subscreen) {
    const activeTab = $(`#tcb-gm-screen .tcb-subscreen:nth-child(${subscreen}) .tcb-tab-button.tcb-active`).data('tab');
    const content = game.settings.get(SETTINGS.MODULE_NAME, `gmScreenContent_tab${activeTab}`);
    
    const editorHtml = `
      <div id="tcb-gm-screen-editor" class="tcb-app">
        <div class="tcb-editor-preview"></div>
        <div class="tcb-editor-input">
          <textarea id="tcb-editor-textarea">${content}</textarea>
          <div class="tcb-editor-buttons">
            <button id="tcb-editor-save">Save</button>
            <button id="tcb-editor-save-close">Save & Close</button>
            <button id="tcb-editor-cancel">Cancel</button>
          </div>
        </div>
      </div>
    `;
    
    $('body').append(editorHtml);
    
    this.updateEditorPreview();
    
    $('#tcb-editor-textarea').on('input', this.updateEditorPreview.bind(this));
    $('#tcb-editor-save').click(() => this.saveEditor(subscreen, activeTab, false));
    $('#tcb-editor-save-close').click(() => this.saveEditor(subscreen, activeTab, true));
    $('#tcb-editor-cancel').click(this.closeEditor);
  }
  
  static updateEditorPreview() {
    const content = $('#tcb-editor-textarea').val();
    const renderedContent = window.marked.parse(content);
    $('.tcb-editor-preview').html(renderedContent);
  }
  
  static async saveEditor(subscreen, tab, close) {
    const content = $('#tcb-editor-textarea').val();
    await game.settings.set(SETTINGS.MODULE_NAME, `gmScreenContent_tab${tab}`, content);
    this.switchTab(tab, subscreen);
    if (close) {
      this.closeEditor();
    }
  }
  
  static closeEditor() {
    $('#tcb-gm-screen-editor').remove();
  }
}

export function init() {
  GMScreen.init();
}
