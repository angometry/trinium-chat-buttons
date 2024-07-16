class TriniumChatButtonsMidi {
  static init() {
    this.midiKeyManager = this.getMidiKeyManager();
    if (!this.midiKeyManager) {
      this.log('MidiKeyManager not found. Exiting.');
      return;
    }

    Hooks.on('renderChatLog', this.initializeButtons.bind(this));
  }

  static initializeButtons(chatLog, html, data) {
    const chatControls = html.find('#chat-controls');
    
    if (!chatControls.length) {
      this.log('No chat controls found.');
      return;
    }
    const buttonGroup = this.createButtonGroup();
    chatControls.parent().prepend(buttonGroup);

    if (game.settings.get('trinium-chat-buttons', 'enablePolling')) {
      this.startPollingMidiStates();
    }
  }

  static createButtonGroup() {
    const buttonGroup = $('<div id="tcb-midi-button-groups"></div>');

    const midiVisibility = game.settings.get('trinium-chat-buttons', 'midiButtonVisibility');
    const isGM = game.user.isGM;

    const showMidiButtons = (midiVisibility === 'everyone') ||
                            (midiVisibility === 'players' && !isGM) ||
                            (midiVisibility === 'gm' && isGM);

    if (showMidiButtons && game.modules.get('midi-qol')?.active) {
      const midiButtonGroup = $('<section id="tcb-midi-buttons" class="tcb-button-row"></section>');
      this.midiFastForwardButton = $(`<button class="tcb-button" id="tcb-midi-fast-forward-toggle" title="${game.i18n.localize('TRINIUMCB.ToggleMidiFastForward')}">
        <i class="fas fa-forward"></i>
      </button>`);
      this.midiRollToggleButton = $(`<button class="tcb-button" id="tcb-midi-roll-toggle" title="${game.i18n.localize('TRINIUMCB.ToggleMidiRoll')}">
        <i class="fas fa-toggle-on"></i>
      </button>`);
      this.midiAdvantageButton = $(`<button class="tcb-button" id="tcb-midi-advantage-toggle" title="${game.i18n.localize('TRINIUMCB.ToggleMidiAdvantage')}">
        <i class="fas fa-plus-circle"></i>
      </button>`);
      this.midiDisadvantageButton = $(`<button class="tcb-button" id="tcb-midi-disadvantage-toggle" title="${game.i18n.localize('TRINIUMCB.ToggleMidiDisadvantage')}">
        <i class="fas fa-minus-circle"></i>
      </button>`);

      midiButtonGroup.append(this.midiFastForwardButton);
      midiButtonGroup.append(this.midiRollToggleButton);
      midiButtonGroup.append(this.midiAdvantageButton);
      midiButtonGroup.append(this.midiDisadvantageButton);
      buttonGroup.append(midiButtonGroup);
    }

    buttonGroup.on('click', 'button', (event) => {
      switch (event.currentTarget.id) {
        case 'tcb-midi-fast-forward-toggle':
          this.toggleMidiFastForward();
          break;
        case 'tcb-midi-roll-toggle':
          this.toggleMidiRollToggle();
          break;
        case 'tcb-midi-advantage-toggle':
          this.toggleMidiAdvantage();
          break;
        case 'tcb-midi-disadvantage-toggle':
          this.toggleMidiDisadvantage();
          break;
      }
    });

    return buttonGroup;
  }

  static updateButtonHighlight() {
    if (this.midiFastForwardButton && this.midiRollToggleButton && this.midiAdvantageButton && this.midiDisadvantageButton) {
      this.updateButtonState(this.midiFastForwardButton, this.midiKeyManager._fastForwardSet);
      this.updateButtonState(this.midiRollToggleButton, this.midiKeyManager._rollToggle);
      this.updateButtonState(this.midiAdvantageButton, this.midiKeyManager._adv);
      this.updateButtonState(this.midiDisadvantageButton, this.midiKeyManager._dis);
    }
  }

  static updateButtonState(button, state) {
    if (state) {
      button.addClass('tcb-active');
    } else {
      button.removeClass('tcb-active');
    }
  }

  static toggleMidiFastForward() {
    if (this.midiKeyManager) {
      this.midiKeyManager._fastForwardSet = !this.midiKeyManager._fastForwardSet;
      this.updateButtonHighlight();
      this.log('Toggled Midi Fast Forward to', this.midiKeyManager._fastForwardSet);
    } else {
      this.log('Unable to access MidiKeyManager');
    }
  }

  static toggleMidiRollToggle() {
    if (this.midiKeyManager) {
      this.midiKeyManager._rollToggle = !this.midiKeyManager._rollToggle;
      this.updateButtonHighlight();
      this.log('Toggled Midi Roll to', this.midiKeyManager._rollToggle);
    } else {
      this.log('Unable to access MidiKeyManager');
    }
  }

  static toggleMidiAdvantage() {
    if (this.midiKeyManager) {
      this.midiKeyManager._adv = !this.midiKeyManager._adv;
      this.updateButtonHighlight();
      this.log('Toggled Midi Advantage to', this.midiKeyManager._adv);
    } else {
      this.log('Unable to access MidiKeyManager');
    }
  }

  static toggleMidiDisadvantage() {
    if (this.midiKeyManager) {
      this.midiKeyManager._dis = !this.midiKeyManager._dis;
      this.updateButtonHighlight();
      this.log('Toggled Midi Disadvantage to', this.midiKeyManager._dis);
    } else {
      this.log('Unable to access MidiKeyManager');
    }
  }

  static getMidiKeyManager() {
    const midiQOL = game.modules.get('midi-qol');
    if (midiQOL && midiQOL.active) {
      return midiQOL.api?.MidiKeyManager ?? window.MidiKeyManager;
    }
    return null;
  }

  static startPollingMidiStates() {
    const pollingRate = game.settings.get('trinium-chat-buttons', 'pollingRate');
    this.pollingInterval = setInterval(() => {
      this.updateButtonHighlight();
    }, pollingRate);
    this.log('Started polling MidiQOL states with a rate of', pollingRate, 'ms');
  }

  static log(...args) {
    if (game.settings.get('trinium-chat-buttons', 'debug')) {
      console.log('TriniumChatButtonsMidi |', ...args);
    }
  }
}

export function init() {
  TriniumChatButtonsMidi.init();
}
