import { SETTINGS, registerSettings, registerGmScreenSettings } from './settings.js';
import { TriniumLogger } from './logger.js';

class TriniumChatButtonsInit {
  static init() {

    registerSettings();
    registerGmScreenSettings();
    
    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    this.addSettingsHeaders();
    this.wrapChatControls();
  }

  static wrapChatControls() {
    Hooks.on('renderChatLog', (chatLog, html) => {
      const chatControls = html.find('#chat-controls');
      if (chatControls.length && !chatControls.parent().hasClass('chat-controls-wrapper')) {
        chatControls.wrap('<div class="chat-controls-wrapper"></div>');
        chatControls.parent().append('<div id="tcb-midi-controls"></div>');
      }
    });
  }

  static addSettingsHeaders() {
    Hooks.on('renderSettingsConfig', (app, html, data) => {
      $('<div>').addClass('form-group group-header trinium-settings-header').html(game.i18n.localize('TRINIUMCB.GmScreenHeader')).insertBefore($('[name="trinium-chat-buttons.enableGMScreen"]').closest('div.form-group'));
      $('<div>').addClass('form-group group-header trinium-settings-header').html(game.i18n.localize('TRINIUMCB.PrivacyButtonsHeader')).insertBefore($('[name="trinium-chat-buttons.enablePrivacyButtons"]').closest('div.form-group'));
      $('<div>').addClass('form-group group-header trinium-settings-header').html(game.i18n.localize('TRINIUMCB.MidiButtonsPollingHeader')).insertBefore($('[name="trinium-chat-buttons.enableMidiButtons"]').closest('div.form-group'));
      $('<div>').addClass('form-group group-header trinium-settings-header').html(game.i18n.localize('TRINIUMCB.CombatTrackerHeader')).insertBefore($('[name="trinium-chat-buttons.enableCombatTrackerButtons"]').closest('div.form-group'));
      $('<div>').addClass('form-group group-header trinium-settings-header').html(game.i18n.localize('TRINIUMCB.DebugHeader')).insertBefore($('[name="trinium-chat-buttons.enableCSSTweaks"]').closest('div.form-group'));
    });
  }
}

Hooks.once('init', () => {
  TriniumChatButtonsInit.init();

  if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_PRIVACY_BUTTONS)) {
    import('./trinium-chat-buttons-privacy.js').then((module) => module.init());
  }

  if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_MIDI_BUTTONS) && game.modules.get('midi-qol')?.active) {
    import('./trinium-chat-buttons-midi.js').then((module) => module.init());
  }

  if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_GM_SCREEN)) {
    import('./trinium-chat-buttons-gm-screen.js').then((module) => module.init());
  }

  if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_COMBAT_TRACKER_BUTTONS) && (game.system.id === 'dnd5e' || game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.OVERRIDE_DND5E_CHECK))) {
    import('./trinium-chat-buttons-combat-tracker.js').then((module) => module.init());
    import('./trinium-chat-buttons-utility.js').then((module) => module.init());
  }

  if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_CSS_TWEAKS)) {
    const style = document.createElement('style');
    style.id = 'trinium-chat-buttons-css-tweaks';
    style.innerHTML = `
      /* Darker sidebar, no gap to the edge of the screen */
      #sidebar.app {
          background-color: rgba(25,25,25,0.6);
          margin: 0px;
          height: 100%;
          border-radius: 0;
      }

      /* No gap below sidebar tab buttons */
      #sidebar-tabs.tabs {
          margin-bottom: 0px;
      }
    `;
    document.head.appendChild(style);
  }
});
