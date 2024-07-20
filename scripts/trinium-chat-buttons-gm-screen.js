import { TriniumLogger } from './logger.js';
import { SETTINGS } from './settings.js';
import {
  GM_SCREEN_TAB1_CONTENT,
  GM_SCREEN_TAB2_CONTENT,
  GM_SCREEN_TAB3_CONTENT,
  GM_SCREEN_TAB4_CONTENT,
} from './gmScreenDefaultContent.js';

// Define constants for CSS selectors
const CSS = {
  GM_SCREEN: '#tcb-gm-screen',
  GM_SCREEN_BUTTON: '#chat-controls .tcb-gm-screen-button',
  TAB_BUTTON: '.tcb-tab-button',
  EDIT_BUTTON: '.tcb-edit-button',
  SETTINGS_BUTTON: '.tcb-settings-button',
  EDITOR: '#tcb-gm-screen-editor',
  EDITOR_TEXTAREA: '#tcb-editor-textarea',
  EDITOR_PREVIEW: '.tcb-editor-preview',
  EDITOR_SAVE: '#tcb-editor-save',
  EDITOR_SAVE_CLOSE: '#tcb-editor-save-close',
  EDITOR_CANCEL: '#tcb-editor-cancel',
  EDITOR_RESTORE: '#tcb-editor-restore',
  SETTINGS_FORM: '#tcb-gm-screen-settings-form',
  SAVE_SETTINGS: '.tcb-close-settings',
  SAVE_CLOSE_SETTINGS: '.tcb-close-settings',
  CLOSE_SETTINGS: '.tcb-close-settings',
};

class GMScreen {
  static logger;

  static init() {
    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    this.logger.info('Initializing GM Screen');
    this.initializeEventListeners();
  }

  static initializeEventListeners() {
    this.logger.info('Initializing event listeners');
    $(document).on('click.tcb-gm-screen', CSS.GM_SCREEN_BUTTON, this.toggleGMScreen.bind(this));
    $(document).on('click.tcb-gm-screen', `${CSS.GM_SCREEN} ${CSS.TAB_BUTTON}`, this.handleTabClick.bind(this));
    $(document).on('click.tcb-gm-screen', `${CSS.GM_SCREEN} ${CSS.EDIT_BUTTON}`, this.openEditor.bind(this));
    $(document).on('click.tcb-gm-screen', `${CSS.GM_SCREEN} ${CSS.SETTINGS_BUTTON}`, this.openSettings.bind(this));
    $(document).on('input', CSS.EDITOR_TEXTAREA, this.debounce(this.updateEditorPreview.bind(this), 300));
    $(document).on('click', CSS.EDITOR_SAVE, () => this.saveEditor(false));
    $(document).on('click', CSS.EDITOR_SAVE_CLOSE, () => this.saveEditor(true));
    $(document).on('click', CSS.EDITOR_CANCEL, this.closeEditor.bind(this));
    $(document).on('click', CSS.EDITOR_RESTORE, this.restoreDefaultContent.bind(this));
    $(document).on('submit', CSS.SETTINGS_FORM, this.saveSettings.bind(this));
    $(document).on('click', '#tcb-save-settings', this.saveSettings.bind(this));
    $(document).on('click', '#tcb-save-close-settings', async () => {
      await this.saveSettings();
      $('#tcb-gm-screen-settings').remove();
    });
    $(document).on('click', '.tcb-close-settings', () => $('#tcb-gm-screen-settings').remove());

    Hooks.on('renderChatLog', this.initializeGMScreenButton.bind(this));
    Hooks.on('updateSetting', this.refreshGMScreen.bind(this));
  }

  static initializeGMScreenButton(chatLog, html) {
    if (!game.user.isGM) return;

    const chatControls = html.find('#chat-controls');
    if (!chatControls.length) {
      this.logger.error('No chat controls found');
      return;
    }

    const gmScreenBtn = $(`<a class="tcb-gm-screen-button" title="${game.i18n.localize('TRINIUMCB.ToggleGMScreen')}">
      <i class="fas fa-book-open"></i>
    </a>`);

    chatControls.prepend(gmScreenBtn);
  }

  static createGMScreen() {
    this.logger.debug('Creating GM Screen');
    const numberOfSubscreens = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.NUMBER_OF_SUBSCREENS);
    const mode = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_MODE);
    const subscreenWidth = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.SUBSCREEN_WIDTH);
    const gmScreenHeight = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_HEIGHT);
    const leftMargin = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_LEFT_MARGIN);
    const rightMargin = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_RIGHT_MARGIN);
    const expandBottomMode = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.EXPAND_BOTTOM_MODE);

    let gmScreenHtml = `<div id="tcb-gm-screen" class="tcb-app tcb-${mode}-mode" style="--subscreen-width: ${subscreenWidth}px; --gm-screen-height: ${gmScreenHeight}%; --number-of-subscreens: ${numberOfSubscreens}; --left-margin: ${leftMargin}px; --right-margin: ${rightMargin}px; --expand-bottom-mode: ${
      expandBottomMode ? 'true' : 'false'
    };">`;

    for (let i = 1; i <= numberOfSubscreens; i++) {
      gmScreenHtml += `
        <div class="tcb-subscreen">
          <header class="tcb-window-header">
            <div class="tcb-gm-screen-controls">
              ${i === 1 ? `<button class="tcb-settings-button"><i class="fas fa-cog"></i></button>` : ''}
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

    // Initialize content for all subscreens
    for (let i = 1; i <= numberOfSubscreens; i++) {
      this.switchTab(1, i);
    }
  }

  static toggleGMScreen() {
    this.logger.debug('Toggling GM Screen');
    let gmScreen = $(CSS.GM_SCREEN);
    if (gmScreen.length) {
      gmScreen.toggleClass('tcb-visible');
    } else {
      this.createGMScreen();
      gmScreen = $(CSS.GM_SCREEN);
      // Force a reflow before adding the visible class
      void gmScreen[0].offsetWidth;
      gmScreen.addClass('tcb-visible');
    }
  }

  static refreshGMScreen(setting, data) {
    this.logger.debug('Refreshing GM Screen');
    const gmScreen = $(CSS.GM_SCREEN);
    const wasVisible = gmScreen.hasClass('tcb-visible');
    gmScreen.remove();
    if (wasVisible) {
      this.createGMScreen();
      $(CSS.GM_SCREEN).addClass('tcb-visible');
    }
  }

  static handleTabClick(event) {
    const tab = $(event.currentTarget).data('tab');
    const subscreen = $(event.currentTarget).data('subscreen');
    this.switchTab(tab, subscreen);
  }

  static switchTab(tab, subscreen) {
    this.logger.debug(`Switching to tab ${tab} in subscreen ${subscreen}`);
    const content = game.settings.get(SETTINGS.MODULE_NAME, `gmScreenContent_tab${tab}`);
    const renderedContent = window.marked.parse(content);
    $(`${CSS.GM_SCREEN} .tcb-subscreen:nth-child(${subscreen}) .tcb-window-content`).html(renderedContent);
    $(`${CSS.GM_SCREEN} .tcb-subscreen:nth-child(${subscreen}) ${CSS.TAB_BUTTON}`).removeClass('tcb-active');
    $(`${CSS.GM_SCREEN} .tcb-subscreen:nth-child(${subscreen}) ${CSS.TAB_BUTTON}[data-tab="${tab}"]`).addClass(
      'tcb-active'
    );
  }

  static openEditor(event) {
    const subscreen = $(event.currentTarget).data('subscreen');
    const activeTab = $(`${CSS.GM_SCREEN} .tcb-subscreen:nth-child(${subscreen}) ${CSS.TAB_BUTTON}.tcb-active`).data(
      'tab'
    );
    const content = game.settings.get(SETTINGS.MODULE_NAME, `gmScreenContent_tab${activeTab}`);

    const mode = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_MODE);
    const subscreenWidth = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.SUBSCREEN_WIDTH);
    const numberOfSubscreens = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.NUMBER_OF_SUBSCREENS);
    const expandBottomMode = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.EXPAND_BOTTOM_MODE);

    
    let previewWidth;
    if (mode === 'bottom' && expandBottomMode) {
      const gmScreenWidth = $(CSS.GM_SCREEN).outerWidth();
      previewWidth = `${gmScreenWidth / numberOfSubscreens}px`;
      this.logger.debug('Set preview width to calculated expanded width:', previewWidth);
    } else {
      previewWidth = `${subscreenWidth}px`;
      this.logger.debug('Set preview width to subscreen width:', previewWidth);
      
    }

    

    const editorHtml = `
    <div id="tcb-gm-screen-editor" class="tcb-app">
      <div class="tcb-editor-preview" style="width: ${previewWidth};"></div>
      <div class="tcb-editor-input">
            <div class="tcb-editor-header">
        You are editing Tab Number ${activeTab}
      </div>
        <textarea id="tcb-editor-textarea">${content}</textarea>
        <div class="tcb-editor-buttons">
          <button id="tcb-editor-save">${game.i18n.localize('TRINIUMCB.Save')}</button>
          <button id="tcb-editor-save-close">${game.i18n.localize('TRINIUMCB.SaveAndClose')}</button>
          <button id="tcb-editor-cancel">${game.i18n.localize('TRINIUMCB.Cancel')}</button>
          <button id="tcb-editor-restore">${game.i18n.localize('TRINIUMCB.RestoreDefault')}</button>
        </div>
      </div>
    </div>
  `;

    $('body').append(editorHtml);

    this.updateEditorPreview();
  }

  static updateEditorPreview() {
    const content = $(CSS.EDITOR_TEXTAREA).val();
    const renderedContent = window.marked.parse(content);
    $(CSS.EDITOR_PREVIEW).html(renderedContent);
  }

  static async saveEditor(close) {
    this.logger.debug('Saving editor content');
    const content = $(CSS.EDITOR_TEXTAREA).val();
    const activeTab = $(`${CSS.GM_SCREEN} ${CSS.TAB_BUTTON}.tcb-active`).data('tab');
    await game.settings.set(SETTINGS.MODULE_NAME, `gmScreenContent_tab${activeTab}`, content);
    this.switchTab(activeTab, 1); // Assuming we're always editing the first subscreen
    if (close) {
      this.closeEditor();
    }
  }

  static closeEditor() {
    $(CSS.EDITOR).remove();
  }

  static restoreDefaultContent() {
    this.logger.debug('Restoring default content');
    const activeTab = $(`${CSS.GM_SCREEN} ${CSS.TAB_BUTTON}.tcb-active`).data('tab');
    const defaultContent = game.settings.settings.get(
      `${SETTINGS.MODULE_NAME}.gmScreenContent_tab${activeTab}`
    ).default;
    $(CSS.EDITOR_TEXTAREA).val(defaultContent);
    this.updateEditorPreview();
  }

  static openSettings() {
    this.logger.debug('Opening GM Screen settings');
    const settingsHtml = `
      <div id="tcb-gm-screen-settings">
        <header class="tcb-window-header">
          <h2>${game.i18n.localize('TRINIUMCB.GMScreenSettings')}</h2>
          <button class="tcb-close-settings">&times;</button>
        </header>
        <div class="tcb-window-content">
          <form id="tcb-gm-screen-settings-form">
            ${this.generateSettingsFields()}
            <div class="form-group buttons">
              <button type="button" id="tcb-save-settings">${game.i18n.localize('TRINIUMCB.Save')}</button>
              <button type="button" id="tcb-save-close-settings">${game.i18n.localize(
                'TRINIUMCB.SaveAndClose'
              )}</button>
              <button type="button" class="tcb-close-settings">${game.i18n.localize('TRINIUMCB.Cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $('body').append(settingsHtml);
  }

  static generateSettingsFields() {
    const settings = [
      {
        key: SETTINGS.NUMBER_OF_SUBSCREENS,
        type: 'number',
        label: 'TRINIUMCB.NumberOfSubscreens',
        hint: 'TRINIUMCB.NumberOfSubscreensHint',
        min: 1,
        max: 4,
        step: 1,
      },
      {
        key: SETTINGS.GM_SCREEN_MODE,
        type: 'select',
        label: 'TRINIUMCB.GMScreenMode',
        hint: 'TRINIUMCB.GMScreenModeHint',
        options: ['right-side', 'left-side', 'bottom'],
      },
      {
        key: SETTINGS.SUBSCREEN_WIDTH,
        type: 'number',
        label: 'TRINIUMCB.SubscreenWidth',
        hint: 'TRINIUMCB.SubscreenWidthHint',
        min: 100,
        max: 1000,
        step: 10,
      },
      {
        key: SETTINGS.GM_SCREEN_HEIGHT,
        type: 'number',
        label: 'TRINIUMCB.GMScreenHeight',
        hint: 'TRINIUMCB.GMScreenHeightHint',
        min: 10,
        max: 100,
        step: 5,
      },
      {
        key: SETTINGS.GM_SCREEN_LEFT_MARGIN,
        type: 'number',
        label: 'TRINIUMCB.GMScreenLeftMargin',
        hint: 'TRINIUMCB.GMScreenLeftMarginHint',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: SETTINGS.GM_SCREEN_RIGHT_MARGIN,
        type: 'number',
        label: 'TRINIUMCB.GMScreenRightMargin',
        hint: 'TRINIUMCB.GMScreenRightMarginHint',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        key: SETTINGS.EXPAND_BOTTOM_MODE,
        type: 'checkbox',
        label: 'TRINIUMCB.ExpandBottomMode',
        hint: 'TRINIUMCB.ExpandBottomModeHint',
      },
    ];

    return settings
      .map((setting) => {
        const value = game.settings.get(SETTINGS.MODULE_NAME, setting.key);
        let inputHtml;

        if (setting.type === 'select') {
          inputHtml = `
          <select id="${setting.key}" name="${setting.key}" required>
            ${setting.options
              .map(
                (option) =>
                  `<option value="${option}" ${value === option ? 'selected' : ''}>${game.i18n.localize(
                    `TRINIUMCB.${option}`
                  )}</option>`
              )
              .join('')}
          </select>
        `;
        } else if (setting.type === 'checkbox') {
          inputHtml = `
          <input type="checkbox" id="${setting.key}" name="${setting.key}" ${value ? 'checked' : ''}>
        `;
        } else {
          inputHtml = `
          <input type="${setting.type}" id="${setting.key}" name="${setting.key}" value="${value}"
                 min="${setting.min}" max="${setting.max}" step="${setting.step}" required>
        `;
        }

        return `
        <div class="form-group">
          <label for="${setting.key}">${game.i18n.localize(setting.label)}</label>
          ${inputHtml}
          <p class="notes">${game.i18n.localize(setting.hint)}</p>
        </div>
      `;
      })
      .join('');
  }

  static validateSetting(settingKey, value) {
    const setting = game.settings.settings.get(`${SETTINGS.MODULE_NAME}.${settingKey}`);
    if (setting.type === Number) {
      const min = setting.range?.min ?? Number.MIN_SAFE_INTEGER;
      const max = setting.range?.max ?? Number.MAX_SAFE_INTEGER;
      return Math.clamped(Number(value), min, max);
    }
    return value;
  }

  static async saveSettings() {
    this.logger.debug('Saving GM Screen settings');
    const form = document.getElementById('tcb-gm-screen-settings-form');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
      if (key === SETTINGS.EXPAND_BOTTOM_MODE) {
        value = formData.get(SETTINGS.EXPAND_BOTTOM_MODE) === 'on';
      } else if (key === SETTINGS.GM_SCREEN_MODE) {
        // No conversion needed for string value
      } else {
        value = Number(value);
      }
      await game.settings.set(SETTINGS.MODULE_NAME, key, value);
    }

    // Handle unchecked checkbox
    if (!formData.has(SETTINGS.EXPAND_BOTTOM_MODE)) {
      await game.settings.set(SETTINGS.MODULE_NAME, SETTINGS.EXPAND_BOTTOM_MODE, false);
    }

    this.refreshGMScreen();
    ui.notifications.info(game.i18n.localize('TRINIUMCB.SettingsSaved'));
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

export function init() {
  GMScreen.init();
}
