export const SETTINGS = {
  MODULE_NAME: 'trinium-chat-buttons',
  PRIVACY_VISIBILITY: 'privacyButtonVisibility',
  MIDI_BUTTON_VISIBILITY: 'midiButtonVisibility',
  ENABLE_POLLING: 'enablePolling',
  POLLING_RATE: 'pollingRate',
  COMBAT_TRACKER_VISIBILITY: 'combatTrackerButtonVisibility',
  HEALTH_PRIVACY: 'healthPrivacy',
  LOG_LEVEL: 'logLevel',
  ENABLE_CSS_TWEAKS: 'enableCSSTweaks',
  ENABLE_PRIVACY_BUTTONS: 'enablePrivacyButtons',
  ENABLE_MIDI_BUTTONS: 'enableMidiButtons',
  ENABLE_COMBAT_TRACKER_BUTTONS: 'enableCombatTrackerButtons',
  STYLE_FOUNDRY_COMBAT_TRACKER: 'styleFoundryCombatTracker',
  OVERRIDE_DND5E_CHECK: 'overrideDnd5eCheck',
};

export function registerSettings() {
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_PRIVACY_BUTTONS, {
    name: game.i18n.localize('TRINIUMCB.EnablePrivacyButtons'),
    hint: game.i18n.localize('TRINIUMCB.EnablePrivacyButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.PRIVACY_VISIBILITY, {
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
    default: 'everyone'
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_MIDI_BUTTONS, {
    name: game.i18n.localize('TRINIUMCB.EnableMidiButtons'),
    hint: game.i18n.localize('TRINIUMCB.EnableMidiButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.MIDI_BUTTON_VISIBILITY, {
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

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_POLLING, {
    name: game.i18n.localize('TRINIUMCB.EnablePolling'),
    hint: game.i18n.localize('TRINIUMCB.EnablePollingHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.POLLING_RATE, {
    name: game.i18n.localize('TRINIUMCB.PollingRate'),
    hint: game.i18n.localize('TRINIUMCB.PollingRateHint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 150
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_COMBAT_TRACKER_BUTTONS, {
    name: game.i18n.localize('TRINIUMCB.EnableCombatTrackerButtons'),
    hint: game.i18n.localize('TRINIUMCB.EnableCombatTrackerButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.COMBAT_TRACKER_VISIBILITY, {
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
    default: 'everyone'
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.HEALTH_PRIVACY, {
    name: game.i18n.localize('TRINIUMCB.HealthPrivacy'),
    hint: game.i18n.localize('TRINIUMCB.HealthPrivacyHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      'all': game.i18n.localize('TRINIUMCB.HealthPrivacyAll'),
      'healthbar': game.i18n.localize('TRINIUMCB.HealthPrivacyHealthbar'),
      'nothing': game.i18n.localize('TRINIUMCB.HealthPrivacyNothing')
    },
    default: 'nothing'
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.STYLE_FOUNDRY_COMBAT_TRACKER, {
    name: game.i18n.localize('TRINIUMCB.StyleFoundryCombatTracker'),
    hint: game.i18n.localize('TRINIUMCB.StyleFoundryCombatTrackerHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.OVERRIDE_DND5E_CHECK, {
    name: game.i18n.localize('TRINIUMCB.OverrideDnD5eCheck'),
    hint: game.i18n.localize('TRINIUMCB.OverrideDnD5eCheckHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_CSS_TWEAKS, {
    name: game.i18n.localize('TRINIUMCB.EnableCSSTweaks'),
    hint: game.i18n.localize('TRINIUMCB.EnableCSSTweaksHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.LOG_LEVEL, {
    name: game.i18n.localize('TRINIUMCB.LogLevel'),
    hint: game.i18n.localize('TRINIUMCB.LogLevelHint'),
    scope: 'client',
    config: true,
    type: String,
    choices: {
      'debug': game.i18n.localize('TRINIUMCB.LogLevelDebug'),
      'info': game.i18n.localize('TRINIUMCB.LogLevelInfo'),
      'warn': game.i18n.localize('TRINIUMCB.LogLevelWarn'),
      'error': game.i18n.localize('TRINIUMCB.LogLevelError')
    },
    default: 'warn'
  });
}
