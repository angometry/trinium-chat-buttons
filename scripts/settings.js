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
  GM_SCREEN_CONTENT_TAB5: 'gmScreenContent_tab5',
  GM_SCREEN_CONTENT_TAB6: 'gmScreenContent_tab6',
  GM_SCREEN_CONTENT_TAB7: 'gmScreenContent_tab7',
  GM_SCREEN_CONTENT_TAB8: 'gmScreenContent_tab8',
  GM_SCREEN_CONTENT_TAB9: 'gmScreenContent_tab9',
  GM_SCREEN_CONTENT_TAB10: 'gmScreenContent_tab10',
  GM_SCREEN_CONTENT_TAB11: 'gmScreenContent_tab11',
  GM_SCREEN_CONTENT_TAB12: 'gmScreenContent_tab12',

  GM_SCREEN_CONTENT_MENU: 'gmScreenContentMenu',
  NUMBER_OF_COLUMNS: 'numberOfColumns',
  GM_SCREEN_MODE: 'gmScreenMode',
  DEFAULT_COLUMN_WIDTH: 'defaultColumnWidth',
   GM_SCREEN_HEIGHT: 'gmScreenHeight',
  GM_SCREEN_LEFT_MARGIN: 'gmScreenLeftMargin',
  GM_SCREEN_RIGHT_MARGIN: 'gmScreenRightMargin',
  EXPAND_BOTTOM_MODE: 'expandBottomMode',
  GM_SCREEN_LAYOUT: 'gmScreenLayout',
  GM_SCREEN_DEFAULT_TABS: 'gmScreenDefaultTabs',
};

export const DEFAULT_COLUMN = {
  rows: 1,
  width: 0,
};


export function registerGmScreenSettings() {
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_LAYOUT, {
      name: game.i18n.localize('TCB_SETTINGS.GMScreenLayout'),
      hint: game.i18n.localize('TCB_SETTINGS.GMScreenLayoutHint'),
    scope: 'world',
    config: false,
    type: Object,
    default: {},
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_DEFAULT_TABS, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenDefaultTabs'),
    hint: game.i18n.localize('TCB_SETTINGS.GMScreenDefaultTabs'),
    scope: 'world',
    config: false,
    type: Object,
    default: {},
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_GM_SCREEN, {
    name: game.i18n.localize('TCB_SETTINGS.EnableGMScreen'),
    hint: game.i18n.localize('TCB_SETTINGS.EnableGMScreenHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.NUMBER_OF_COLUMNS, {
    name: game.i18n.localize('TCB_SETTINGS.NumberOfColumns'),
    hint: game.i18n.localize('TCB_SETTINGS.NumberOfColumnsHint'),
    scope: 'world',
    config: false,
    type: Number,
    range: {
      min: 1,
      max: 4,
      step: 1
    },
    default: 1,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.DEFAULT_COLUMN_WIDTH, {
    name: game.i18n.localize('TCB_SETTINGS.DefaultColumnWidth'),
    hint: game.i18n.localize('TCB_SETTINGS.DefaultColumnWidthHint'),
    scope: 'world',
    config: false,
    type: Number,
    default: 300,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_HEIGHT, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenHeight'),
    hint: game.i18n.localize('TCB_SETTINGS.GMScreenHeightHint'),
    scope: 'world',
    config: false,
    type: Number,
    range: {
      min: 10,
      max: 100,
      step: 5
    },
    default: 50,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_MODE, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenMode'),
    hint: game.i18n.localize('TCB_SETTINGS.GMScreenModeHint'),
    scope: 'world',
    config: false,
    type: String,
    choices: {
      'right-side': game.i18n.localize('TCB_SETTINGS.RightSideMode'),
      'left-side': game.i18n.localize('TCB_SETTINGS.LeftSideMode'),
      'bottom': game.i18n.localize('TCB_SETTINGS.BottomMode')
    },
    default: 'right-side',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_LEFT_MARGIN, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenLeftMargin'),
    hint: game.i18n.localize('TCB_SETTINGS.GMScreenLeftMarginHint'),
    scope: 'world',
    config: false,
    type: Number,
    default: 20,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_RIGHT_MARGIN, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenRightMargin'),
    hint: game.i18n.localize('TCB_SETTINGS.GMScreenRightMarginHint'),
    scope: 'world',
    config: false,
    type: Number,
    default: 20,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.EXPAND_BOTTOM_MODE, {
    name: game.i18n.localize('TCB_SETTINGS.ExpandBottomMode'),
    hint: game.i18n.localize('TCB_SETTINGS.ExpandBottomModeHint'),
    scope: 'world',
    config: false,
    type: Boolean,
    default: true,
  });

  // Hidden

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB1, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab1'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB1_CONTENT,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB2, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab2'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB2_CONTENT,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB3, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab3'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB3_CONTENT,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB4, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab4'),
    scope: 'world',
    config: false,
    type: String,
    default: GM_SCREEN_TAB4_CONTENT,
  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB5, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab5'),
    scope: 'world',
    config: false,
    type: String,
    default: '',  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB6, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab6'),
    scope: 'world',
    config: false,
    type: String,
    default: '',  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB7, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab7'),
    scope: 'world',
    config: false,
    type: String,
    default: '',  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB8, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab8'),
    scope: 'world',
    config: false,
    type: String,
    default: '',  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB9, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab9'),
    scope: 'world',
    config: false,
    type: String,
    default: '',  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB10, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab10'),
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB11, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab11'),
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.GM_SCREEN_CONTENT_TAB12, {
    name: game.i18n.localize('TCB_SETTINGS.GMScreenContentTab12'),
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  
}

export function registerSettings() {
  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_PRIVACY_BUTTONS, {
    name: game.i18n.localize('TCB_SETTINGS.EnablePrivacyButtons'),
    hint: game.i18n.localize('TCB_SETTINGS.EnablePrivacyButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.PRIVACY_VISIBILITY, {
    name: game.i18n.localize('TCB_SETTINGS.PrivacyButtonVisibility'),
    hint: game.i18n.localize('TCB_SETTINGS.PrivacyButtonVisibilityHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      gm: game.i18n.localize('TCB_SETTINGS.GMOnly'),
      players: game.i18n.localize('TCB_SETTINGS.PlayersOnly'),
      everyone: game.i18n.localize('TCB_SETTINGS.Everyone'),
    },
    default: 'everyone',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_MIDI_BUTTONS, {
    name: game.i18n.localize('TCB_SETTINGS.EnableMidiButtons'),
    hint: game.i18n.localize('TCB_SETTINGS.EnableMidiButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.MIDI_BUTTON_VISIBILITY, {
    name: game.i18n.localize('TCB_SETTINGS.MidiButtonVisibility'),
    hint: game.i18n.localize('TCB_SETTINGS.MidiButtonVisibilityHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      gm: game.i18n.localize('TCB_SETTINGS.GMOnly'),
      players: game.i18n.localize('TCB_SETTINGS.PlayersOnly'),
      everyone: game.i18n.localize('TCB_SETTINGS.Everyone'),
    },
    default: 'gm',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_POLLING, {
    name: game.i18n.localize('TCB_SETTINGS.EnablePolling'),
    hint: game.i18n.localize('TCB_SETTINGS.EnablePollingHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.POLLING_RATE, {
    name: game.i18n.localize('TCB_SETTINGS.PollingRate'),
    hint: game.i18n.localize('TCB_SETTINGS.PollingRateHint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 150,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_COMBAT_TRACKER_BUTTONS, {
    name: game.i18n.localize('TCB_SETTINGS.EnableCombatTrackerButtons'),
    hint: game.i18n.localize('TCB_SETTINGS.EnableCombatTrackerButtonsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.COMBAT_TRACKER_VISIBILITY, {
    name: game.i18n.localize('TCB_SETTINGS.CombatTrackerButtonVisibility'),
    hint: game.i18n.localize('TCB_SETTINGS.CombatTrackerButtonVisibilityHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      gm: game.i18n.localize('TCB_SETTINGS.GMOnly'),
      players: game.i18n.localize('TCB_SETTINGS.PlayersOnly'),
      everyone: game.i18n.localize('TCB_SETTINGS.Everyone'),
    },
    default: 'everyone',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.HEALTH_PRIVACY, {
    name: game.i18n.localize('TCB_SETTINGS.HealthPrivacy'),
    hint: game.i18n.localize('TCB_SETTINGS.HealthPrivacyHint'),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      all: game.i18n.localize('TCB_SETTINGS.HealthPrivacyAll'),
      healthbar: game.i18n.localize('TCB_SETTINGS.HealthPrivacyHealthbar'),
      nothing: game.i18n.localize('TCB_SETTINGS.HealthPrivacyNothing'),
    },
    default: 'nothing',
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ONLY_SHOW_TURN_CONTROLS, {
    name: game.i18n.localize('TCB_SETTINGS.OnlyShowTurnControls'),
    hint: game.i18n.localize('TCB_SETTINGS.OnlyShowTurnControlsHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.STYLE_FOUNDRY_COMBAT_TRACKER, {
    name: game.i18n.localize('TCB_SETTINGS.StyleFoundryCombatTracker'),
    hint: game.i18n.localize('TCB_SETTINGS.StyleFoundryCombatTrackerHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.OVERRIDE_DND5E_CHECK, {
    name: game.i18n.localize('TCB_SETTINGS.OverrideDnD5eCheck'),
    hint: game.i18n.localize('TCB_SETTINGS.OverrideDnD5eCheckHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_CSS_TWEAKS, {
    name: game.i18n.localize('TCB_SETTINGS.EnableCSSTweaks'),
    hint: game.i18n.localize('TCB_SETTINGS.EnableCSSTweaksHint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SETTINGS.MODULE_NAME, SETTINGS.LOG_LEVEL, {
    name: game.i18n.localize('TCB_SETTINGS.LogLevel'),
    hint: game.i18n.localize('TCB_SETTINGS.LogLevelHint'),
    scope: 'client',
    config: true,
    type: String,
    choices: {
      debug: game.i18n.localize('TCB_SETTINGS.LogLevelDebug'),
      info: game.i18n.localize('TCB_SETTINGS.LogLevelInfo'),
      warn: game.i18n.localize('TCB_SETTINGS.LogLevelWarn'),
      error: game.i18n.localize('TCB_SETTINGS.LogLevelError'),
    },
    default: 'warn',
  });
}
