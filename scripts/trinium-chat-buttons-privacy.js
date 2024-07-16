class TriniumChatButtonsPrivacy {
  static init() {
    this.TRINIUMCBs = [
      { type: 'publicroll', icon: 'fa-eye', tooltip: 'TRINIUMCB.PublicRoll' },
      { type: 'gmroll', icon: 'fa-user-secret', tooltip: 'TRINIUMCB.PrivateRoll' },
      { type: 'selfroll', icon: 'fa-user', tooltip: 'TRINIUMCB.SelfRoll' },
      { type: 'blindroll', icon: 'fa-eye-slash', tooltip: 'TRINIUMCB.BlindRoll' }
    ];

    Hooks.on('renderChatLog', this.initializeButtons.bind(this));
  }

  static initializeButtons(chatLog, html, data) {
    const chatControls = html.find('#chat-controls');

    if (!chatControls.length) {
      this.log('No chat controls found.');
      return;
    }

    const TRINIUMCBDropdown = chatControls.find('select');

    if (!TRINIUMCBDropdown.length) {
      this.log('No roll type dropdown found.');
      return;
    }

    const privacyVisibility = game.settings.get('trinium-chat-buttons', 'privacyButtonVisibility');
    const isGM = game.user.isGM;
    const showPrivacyButtons = (privacyVisibility === 'everyone') ||
                               (privacyVisibility === 'players' && !isGM) ||
                               (privacyVisibility === 'gm' && isGM);

    if (showPrivacyButtons) {
      const buttonGroup = this.createButtonGroup();
      TRINIUMCBDropdown.replaceWith(buttonGroup);
      this.updateButtonHighlight();
    }
  }

  static createButtonGroup() {
    const buttonGroup = $('<div id="tcb-button-groups"></div>');
    const TRINIUMCBButtonGroup = $('<section id="tcb-roll-type-buttons" class="tcb-button-row"></section>');

    this.TRINIUMCBs.forEach(TRINIUMCB => {
      const button = $(`<button class="tcb-button" data-id="${TRINIUMCB.type}" title="${game.i18n.localize(TRINIUMCB.tooltip)}">
        <i class="fas ${TRINIUMCB.icon}"></i>
      </button>`);
      TRINIUMCBButtonGroup.append(button);
    });

    buttonGroup.append(TRINIUMCBButtonGroup);

    buttonGroup.on('click', 'button', (event) => {
      const selectedType = $(event.currentTarget).data('id');
      if (selectedType) {
        game.settings.set('core', 'rollMode', selectedType);
        this.updateButtonHighlight();
        this.log(`Roll mode set to ${selectedType}`);
      }
    });

    return buttonGroup;
  }

  static updateButtonHighlight() {
    const selectedType = game.settings.get('core', 'rollMode');
    const buttonGroup = $('#tcb-button-groups');

    if (buttonGroup.length) {
      buttonGroup.find('button').removeClass('tcb-active');
      buttonGroup.find(`button[data-id="${selectedType}"]`).addClass('tcb-active');
      this.log(`Updated button highlight for ${selectedType}`);
    } else {
      this.log('Button group not found.');
    }
  }

  static log(...args) {
    if (game.settings.get('trinium-chat-buttons', 'debug')) {
      console.log('TriniumChatButtonsPrivacy |', ...args);
    }
  }
}

export function init() {
  TriniumChatButtonsPrivacy.init();
}
