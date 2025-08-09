import { SETTINGS, registerSettings, registerGMScreenSettings, registerKeybindings } from './module/settings.js';
import { TriniumLogger } from './module/logger.js';

class TriniumChatButtonsInit {
  static logger;
  static modules = {
    combatTracker: null,
    utility: null,
    gmScreen: null
  };

  static init() {
    registerSettings();
    registerGMScreenSettings();
    registerKeybindings();

    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    this.addSettingsHeaders();
    
    // Single hook to handle all initialization after chat is rendered
    Hooks.on('renderChatLog', this.onChatLogRendered.bind(this));
  }

  static async onChatLogRendered(chatLog, html, data) {
    // Only initialize once
    if (this.initialized) return;
    
    // Create the button container
    const containerData = this.createButtonContainer(html);
    if (!containerData) return;

    // Load and initialize modules in order
    await this.initializeModules(containerData);
    
    this.initialized = true;
    this.logger.info('All modules initialized successfully');
  }

  static createButtonContainer(html) {
    const chatForm = $(html).find('.chat-form');
    
    if (!chatForm.length) {
      this.logger.error('Chat form not found');
      return null;
    }

    // Remove any existing container first
    chatForm.find('#trinium-chat-buttons-container').remove();
    
    // Create the new container
    const container = $('<div id="trinium-chat-buttons-container" class="trinium-chat-buttons-container"></div>');
    
    // Create the button row that all modules will use
    const buttonRow = $('<div id="tcb-button-row" class="tcb-button-row"></div>');
    container.append(buttonRow);
    
    // Append to the chat form
    chatForm.append(container);
    
    this.logger.debug('Created button container with button row');
    return { container, buttonRow };
  }

  static async initializeModules({ container, buttonRow }) {
    try {
      // Initialize GM Screen first (for GMs only)
      if (game.user.isGM && game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_GM_SCREEN)) {
        const gmScreenModule = await import('./module/chat-buttons/gm-screen.js');
        this.modules.gmScreen = gmScreenModule;
        gmScreenModule.initialize(container, buttonRow);
        this.logger.debug('GM Screen module initialized');
      }

      // Initialize Combat Tracker and Utility modules
      if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_COMBAT_TRACKER_BUTTONS)) {
        const combatTrackerModule = await import('./module/chat-buttons/combat-tracker.js');
        const utilityModule = await import('./module/chat-buttons/utility.js');
        
        this.modules.combatTracker = combatTrackerModule;
        this.modules.utility = utilityModule;
        
        combatTrackerModule.initialize(container, buttonRow);
        utilityModule.initialize(container, buttonRow);
        
        this.logger.debug('Combat Tracker and Utility modules initialized');
      }
    } catch (error) {
      this.logger.error('Error initializing modules:', error);
    }
  }

  static addSettingsHeaders() {
    Hooks.on('renderSettingsConfig', (app, html, data) => {
      $('<div>')
        .addClass('form-group group-header trinium-settings-header')
        .html(game.i18n.localize('TRINIUMCB.GMScreenHeader'))
        .insertBefore($('[name="trinium-chat-buttons.enableGMScreen"]').closest('div.form-group'));
      $('<div>')
        .addClass('form-group group-header trinium-settings-header')
        .html(game.i18n.localize('TRINIUMCB.CombatTrackerHeader'))
        .insertBefore($('[name="trinium-chat-buttons.enableCombatTrackerButtons"]').closest('div.form-group'));
      $('<div>')
        .addClass('form-group group-header trinium-settings-header')
        .html(game.i18n.localize('TRINIUMCB.DebugHeader'))
        .insertBefore($('[name="trinium-chat-buttons.logLevel"]').closest('div.form-group'));
    });
  }
}

Hooks.once('init', () => {
  TriniumChatButtonsInit.init();
});