
class TriniumChatButtonsInit {
  static init() {
    this.registerSettings();
    this.wrapChatControls();
    this.addSettingsHeaders();
  }

  static registerSettings() {
    game.settings.register('trinium-chat-buttons', 'enablePrivacyButtons', {
      name: game.i18n.localize('TRINIUMCB.EnablePrivacyButtons'),
      hint: game.i18n.localize('TRINIUMCB.EnablePrivacyButtonsHint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register('trinium-chat-buttons', 'privacyButtonVisibility', {
      name: game.i18n.localize('TRINIUMCB.PrivacyButtonVisibility'),
      hint: game.i18n.localize('TRINIUMCB.PrivacyButtonVisibilityHint'),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        'gm': game.i18n.localize('TRINIUMCB.GMOnly'),
        'players': game.i18n.localize('TRINIUMCB.PlayersOnly'),
        'everyone': game.i18n.localize('TRINIUMCB.Everyone')
      },
      default: 'gm'
    });

    game.settings.register('trinium-chat-buttons', 'enableMidiButtons', {
      name: game.i18n.localize('TRINIUMCB.EnableMidiButtons'),
      hint: game.i18n.localize('TRINIUMCB.EnableMidiButtonsHint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register('trinium-chat-buttons', 'midiButtonVisibility', {
      name: game.i18n.localize('TRINIUMCB.MidiButtonVisibility'),
      hint: game.i18n.localize('TRINIUMCB.MidiButtonVisibilityHint'),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        'gm': game.i18n.localize('TRINIUMCB.GMOnly'),
        'players': game.i18n.localize('TRINIUMCB.PlayersOnly'),
        'everyone': game.i18n.localize('TRINIUMCB.Everyone')
      },
      default: 'gm'
    });

    game.settings.register('trinium-chat-buttons', 'enablePolling', {
      name: game.i18n.localize('TRINIUMCB.EnablePolling'),
      hint: game.i18n.localize('TRINIUMCB.EnablePollingHint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register('trinium-chat-buttons', 'pollingRate', {
      name: game.i18n.localize('TRINIUMCB.PollingRate'),
      hint: game.i18n.localize('TRINIUMCB.PollingRateHint'),
      scope: 'world',
      config: true,
      type: Number,
      default: 150
    });

    game.settings.register('trinium-chat-buttons', 'enableCombatTrackerButtons', {
      name: game.i18n.localize('TRINIUMCB.EnableCombatTrackerButtons'),
      hint: game.i18n.localize('TRINIUMCB.EnableCombatTrackerButtonsHint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register('trinium-chat-buttons', 'combatTrackerButtonVisibility', {
      name: game.i18n.localize('TRINIUMCB.CombatTrackerButtonVisibility'),
      hint: game.i18n.localize('TRINIUMCB.CombatTrackerButtonVisibilityHint'),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        'gm': game.i18n.localize('TRINIUMCB.GMOnly'),
        'players': game.i18n.localize('TRINIUMCB.PlayersOnly'),
        'everyone': game.i18n.localize('TRINIUMCB.Everyone')
      },
      default: 'gm'
    });

    game.settings.register('trinium-chat-buttons', 'overrideDnd5eCheck', {
      name: game.i18n.localize('TRINIUMCB.OverrideDnD5eCheck'),
      hint: game.i18n.localize('TRINIUMCB.OverrideDnD5eCheckHint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false
    });
    

    game.settings.register('trinium-chat-buttons', 'debug', {
      name: game.i18n.localize('TRINIUMCB.Debug'),
      hint: game.i18n.localize('TRINIUMCB.DebugHint'),
      scope: 'client',
      config: true,
      type: Boolean,
      default: false
    });

    game.settings.register('trinium-chat-buttons', 'enableCSSTweaks', {
      name: game.i18n.localize('TRINIUMCB.EnableCSSTweaks'),
      hint: game.i18n.localize('TRINIUMCB.EnableCSSTweaksHint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false
    });
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

  // Add Headers to the settings page because they're nice
  static addSettingsHeaders() {
    Hooks.on('renderSettingsConfig', (app, html, data) => {
      $('<div>').addClass('form-group group-header').html(game.i18n.localize('TRINIUMCB.PrivacyButtonsHeader')).insertBefore($('[name="trinium-chat-buttons.enablePrivacyButtons"]').closest('div.form-group'));
      $('<div>').addClass('form-group group-header').html(game.i18n.localize('TRINIUMCB.MidiButtonsPollingHeader')).insertBefore($('[name="trinium-chat-buttons.enableMidiButtons"]').closest('div.form-group'));
      $('<div>').addClass('form-group group-header').html(game.i18n.localize('TRINIUMCB.CombatTrackerHeader')).insertBefore($('[name="trinium-chat-buttons.enableCombatTrackerButtons"]').closest('div.form-group'));
      $('<div>').addClass('form-group group-header').html(game.i18n.localize('TRINIUMCB.DebugHeader')).insertBefore($('[name="trinium-chat-buttons.debug"]').closest('div.form-group'));
    });
  }
}

Hooks.once('init', () => {
  TriniumChatButtonsInit.init();
  if (game.settings.get('trinium-chat-buttons', 'enablePrivacyButtons')) {
    import('./trinium-chat-buttons-privacy.js').then((module) => module.init());
  }
  if (game.settings.get('trinium-chat-buttons', 'enableMidiButtons') && game.modules.get('midi-qol')?.active) {
    import('./trinium-chat-buttons-midi.js').then((module) => module.init());
  }
  if (game.settings.get('trinium-chat-buttons', 'enableCombatTrackerButtons') && (game.system.id === 'dnd5e' || game.settings.get('trinium-chat-buttons', 'overrideDnd5eCheck'))) {
    import('./trinium-chat-buttons-combat-tracker.js').then((module) => module.init());
  }

  if (game.settings.get('trinium-chat-buttons', 'enableCSSTweaks')) {
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
