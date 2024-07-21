import { TriniumLogger } from '../logger.js';
import { SETTINGS } from '../settings.js';

class PrivacyButtons {
  static BUTTON_TYPES = [
    { type: 'publicroll', icon: 'fa-eye', tooltip: 'TRINIUMCB.PublicRoll' },
    { type: 'gmroll', icon: 'fa-user-secret', tooltip: 'TRINIUMCB.PrivateRoll' },
    { type: 'selfroll', icon: 'fa-user', tooltip: 'TRINIUMCB.SelfRoll' },
    { type: 'blindroll', icon: 'fa-eye-slash', tooltip: 'TRINIUMCB.BlindRoll' },
  ];

  static init() {
    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    Hooks.on('renderChatLog', this.initializeButtons.bind(this));
    this.logger.info('TriniumChatButtonsPrivacy initialized');
  }

  /**
   * Initialize buttons when chat log is rendered
   * @param {ChatLog} chatLog - The chat log application
   * @param {jQuery} html - The rendered HTML of the chat log
   * @param {Object} data - The data object passed to the chat log template
   */
  static initializeButtons(chatLog, html, data) {
    const chatControls = html.find('#chat-controls');
    if (!chatControls.length) {
      this.logger.error('No chat controls found. Unable to initialize buttons.');
      return;
    }

    const rollTypeDropdown = chatControls.find('select');
    if (!rollTypeDropdown.length) {
      this.logger.error('No roll type dropdown found. Unable to replace with buttons.');
      return;
    }

    if (this.shouldShowPrivacyButtons()) {
      const buttonGroup = this.createButtonGroup();
      rollTypeDropdown.replaceWith(buttonGroup);
      this.updateButtonHighlight();
      this.logger.info('Privacy buttons initialized and added to chat controls.');
    } else {
      this.logger.debug('Privacy buttons not shown due to visibility settings or user role.');
    }
  }

  /**
   * Determine if privacy buttons should be shown based on user settings and GM status
   * @returns {boolean} Whether to show privacy buttons
   */
  static shouldShowPrivacyButtons() {
    const privacyVisibility = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.PRIVACY_VISIBILITY);
    const isGM = game.user.isGM;

    const shouldShow =
      privacyVisibility === 'everyone' ||
      (privacyVisibility === 'players' && !isGM) ||
      (privacyVisibility === 'gm' && isGM);

    this.logger.debug(`Privacy buttons visibility: ${shouldShow}. User is GM: ${isGM}, Setting: ${privacyVisibility}`);
    return shouldShow;
  }

  /**
   * Create the button group for privacy controls
   * @returns {jQuery} The created button group element
   */
  static createButtonGroup() {
    const buttonGroup = $('<div id="tcb-button-groups"></div>');
    const privacyButtonGroup = $('<section id="tcb-roll-type-buttons" class="tcb-button-row"></section>');

    this.BUTTON_TYPES.forEach((button) => {
      const buttonElement = this.createButton(button);
      privacyButtonGroup.append(buttonElement);
    });

    buttonGroup.append(privacyButtonGroup);
    this.attachEventListeners(buttonGroup);

    this.logger.debug('Button group created with all privacy buttons.');
    return buttonGroup;
  }

  static createButton(button) {
    return $(`<button class="tcb-button" data-id="${button.type}" title="${game.i18n.localize(button.tooltip)}">
      <i class="fas ${button.icon}"></i>
    </button>`);
  }

  static attachEventListeners(buttonGroup) {
    buttonGroup.on('click', 'button', (event) => {
      const selectedType = $(event.currentTarget).data('id');
      if (selectedType) {
        game.settings.set('core', 'rollMode', selectedType);
        this.updateButtonHighlight();
        this.logger.info(`Roll mode set to ${selectedType}`);
      }
    });
  }

  /**
   * Update the highlight state of the buttons based on the current roll mode
   */
  static updateButtonHighlight() {
    const selectedType = game.settings.get('core', 'rollMode');
    const buttonGroup = $('#tcb-button-groups');

    if (buttonGroup.length) {
      buttonGroup.find('button').removeClass('tcb-active');
      buttonGroup.find(`button[data-id="${selectedType}"]`).addClass('tcb-active');
      this.logger.debug(`Updated button highlight for ${selectedType}`);
    } else {
      this.logger.warn('Button group not found. Unable to update button highlight.');
    }
  }
}

export function init() {
  PrivacyButtons.init();
}
