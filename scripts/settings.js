import { GM_SCREEN_TAB1_CONTENT, GM_SCREEN_TAB2_CONTENT, GM_SCREEN_TAB3_CONTENT, GM_SCREEN_TAB4_CONTENT } from './gmScreenDefaultContent.js';

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
  ONLY_SHOW_TURN_CONTROLS: 'onlyShowTurnControls',
  STYLE_FOUNDRY_COMBAT_TRACKER: 'styleFoundryCombatTracker',
  OVERRIDE_DND5E_CHECK: 'overrideDnd5eCheck',

  ENABLE_GM_SCREEN: 'enableGMScreen',
  GM_SCREEN_CONTENT_TAB1: 'gmScreenContent_tab1',
  GM_SCREEN_CONTENT_TAB2: 'gmScreenContent_tab2',
  GM_SCREEN_CONTENT_TAB3: 'gmScreenContent_tab3',
  GM_SCREEN_CONTENT_TAB4: 'gmScreenContent_tab4',
  GM_SCREEN_CONTENT_MENU: 'gmScreenContentMenu',
  NUMBER_OF_SUBSCREENS: 'numberOfSubscreens',
  GM_SCREEN_MODE: 'gmScreenMode',
  SUBSCREEN_WIDTH: 'subscreenWidth',
  GM_SCREEN_HEIGHT: 'gmScreenHeight',
  GM_SCREEN_LEFT_MARGIN: 'gmScreenLeftMargin',
  GM_SCREEN_RIGHT_MARGIN: 'gmScreenRightMargin',
};

export function registerGmScreenSettings() {
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_GM_SCREEN, {
    name: game.i18n.localize('TRINIUMCB.EnableGMScreen'),
    hint: game.i18n.localize('TRINIUMCB.EnableGMScreenHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.NUMBER_OF_SUBSCREENS, {
    name: game.i18n.localize('TRINIUMCB.NumberOfSubscreens'),
    hint: game.i18n.localize('TRINIUMCB.NumberOfSubscreensHint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 1,
      max: 4,
      step: 1
    },
    default: 1,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.SUBSCREEN_WIDTH, {
    name: game.i18n.localize('TRINIUMCB.SubscreenWidth'),
    hint: game.i18n.localize('TRINIUMCB.SubscreenWidthHint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 300,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_HEIGHT, {
    name: game.i18n.localize('TRINIUMCB.GMScreenHeight'),
    hint: game.i18n.localize('TRINIUMCB.GMScreenHeightHint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 10,
      max: 100,
      step: 5
    },
    default: 50,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_MODE, {
    name: game.i18n.localize('TRINIUMCB.GMScreenMode'),
    hint: game.i18n.localize('TRINIUMCB.GMScreenModeHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      'right-side': game.i18n.localize('TRINIUMCB.RightSideMode'),
      'left-side': game.i18n.localize('TRINIUMCB.LeftSideMode'),
      'bottom': game.i18n.localize('TRINIUMCB.BottomMode')
    },
    default: 'right-side',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_LEFT_MARGIN, {
    name: game.i18n.localize('TRINIUMCB.GMScreenLeftMargin'),
    hint: game.i18n.localize('TRINIUMCB.GMScreenLeftMarginHint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 20,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_RIGHT_MARGIN, {
    name: game.i18n.localize('TRINIUMCB.GMScreenRightMargin'),
    hint: game.i18n.localize('TRINIUMCB.GMScreenRightMarginHint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 20,
  });

  // Hidden

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB1, {
    name: game.i18n.localize('TRINIUMCB.GMScreenContentTab1'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB1_CONTENT,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB2, {
    name: game.i18n.localize('TRINIUMCB.GMScreenContentTab2'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB2_CONTENT,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB3, {
    name: game.i18n.localize('TRINIUMCB.GMScreenContentTab3'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB3_CONTENT,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB4, {
    name: game.i18n.localize('TRINIUMCB.GMScreenContentTab4'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB4_CONTENT,
  });
}

export function registerSettings() {
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_PRIVACY_BUTTONS, {
    name: game.i18n.localize('TRINIUMCB.EnablePrivacyButtons'),
    hint: game.i18n.localize('TRINIUMCB.EnablePrivacyButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.PRIVACY_VISIBILITY, {
    name: game.i18n.localize('TRINIUMCB.PrivacyButtonVisibility'),
    hint: game.i18n.localize('TRINIUMCB.PrivacyButtonVisibilityHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      gm: game.i18n.localize('TRINIUMCB.GMOnly'),
      players: game.i18n.localize('TRINIUMCB.PlayersOnly'),
      everyone: game.i18n.localize('TRINIUMCB.Everyone'),
    },
    default: 'everyone',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_MIDI_BUTTONS, {
    name: game.i18n.localize('TRINIUMCB.EnableMidiButtons'),
    hint: game.i18n.localize('TRINIUMCB.EnableMidiButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.MIDI_BUTTON_VISIBILITY, {
    name: game.i18n.localize('TRINIUMCB.MidiButtonVisibility'),
    hint: game.i18n.localize('TRINIUMCB.MidiButtonVisibilityHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      gm: game.i18n.localize('TRINIUMCB.GMOnly'),
      players: game.i18n.localize('TRINIUMCB.PlayersOnly'),
      everyone: game.i18n.localize('TRINIUMCB.Everyone'),
    },
    default: 'gm',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_POLLING, {
    name: game.i18n.localize('TRINIUMCB.EnablePolling'),
    hint: game.i18n.localize('TRINIUMCB.EnablePollingHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.POLLING_RATE, {
    name: game.i18n.localize('TRINIUMCB.PollingRate'),
    hint: game.i18n.localize('TRINIUMCB.PollingRateHint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 150,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_COMBAT_TRACKER_BUTTONS, {
    name: game.i18n.localize('TRINIUMCB.EnableCombatTrackerButtons'),
    hint: game.i18n.localize('TRINIUMCB.EnableCombatTrackerButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.COMBAT_TRACKER_VISIBILITY, {
    name: game.i18n.localize('TRINIUMCB.CombatTrackerButtonVisibility'),
    hint: game.i18n.localize('TRINIUMCB.CombatTrackerButtonVisibilityHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      gm: game.i18n.localize('TRINIUMCB.GMOnly'),
      players: game.i18n.localize('TRINIUMCB.PlayersOnly'),
      everyone: game.i18n.localize('TRINIUMCB.Everyone'),
    },
    default: 'everyone',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.HEALTH_PRIVACY, {
    name: game.i18n.localize('TRINIUMCB.HealthPrivacy'),
    hint: game.i18n.localize('TRINIUMCB.HealthPrivacyHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      all: game.i18n.localize('TRINIUMCB.HealthPrivacyAll'),
      healthbar: game.i18n.localize('TRINIUMCB.HealthPrivacyHealthbar'),
      nothing: game.i18n.localize('TRINIUMCB.HealthPrivacyNothing'),
    },
    default: 'nothing',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ONLY_SHOW_TURN_CONTROLS, {
    name: game.i18n.localize('TRINIUMCB.OnlyShowTurnControls'),
    hint: game.i18n.localize('TRINIUMCB.OnlyShowTurnControlsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.STYLE_FOUNDRY_COMBAT_TRACKER, {
    name: game.i18n.localize('TRINIUMCB.StyleFoundryCombatTracker'),
    hint: game.i18n.localize('TRINIUMCB.StyleFoundryCombatTrackerHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.OVERRIDE_DND5E_CHECK, {
    name: game.i18n.localize('TRINIUMCB.OverrideDnD5eCheck'),
    hint: game.i18n.localize('TRINIUMCB.OverrideDnD5eCheckHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_CSS_TWEAKS, {
    name: game.i18n.localize('TRINIUMCB.EnableCSSTweaks'),
    hint: game.i18n.localize('TRINIUMCB.EnableCSSTweaksHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.LOG_LEVEL, {
    name: game.i18n.localize('TRINIUMCB.LogLevel'),
    hint: game.i18n.localize('TRINIUMCB.LogLevelHint'),
    scope: 'client',
    config: true,
    type: String,
    choices: {
      debug: game.i18n.localize('TRINIUMCB.LogLevelDebug'),
      info: game.i18n.localize('TRINIUMCB.LogLevelInfo'),
      warn: game.i18n.localize('TRINIUMCB.LogLevelWarn'),
      error: game.i18n.localize('TRINIUMCB.LogLevelError'),
    },
    default: 'warn',
  });
}
