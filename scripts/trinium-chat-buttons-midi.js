import { TriniumLogger } from './logger.js';
import { SETTINGS } from './settings.js';

class MidiButtons {
    static BUTTONS = {
    FAST_FORWARD: { id: 'tcb-midi-fast-forward-toggle', icon: 'fa-forward', tooltip: 'TRINIUMCB.ToggleMidiFastForward', key: '_fastForwardSet' },
    ROLL_TOGGLE: { id: 'tcb-midi-roll-toggle', icon: 'fa-toggle-on', tooltip: 'TRINIUMCB.ToggleMidiRoll', key: '_rollToggle' },
    ADVANTAGE: { id: 'tcb-midi-advantage-toggle', icon: 'fa-plus-circle', tooltip: 'TRINIUMCB.ToggleMidiAdvantage', key: '_adv' },
    DISADVANTAGE: { id: 'tcb-midi-disadvantage-toggle', icon: 'fa-minus-circle', tooltip: 'TRINIUMCB.ToggleMidiDisadvantage', key: '_dis' }
  };

  static init() {
    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    this.midiKeyManager = this.getMidiKeyManager();
    if (!this.midiKeyManager) {
      this.logger.warn('MidiKeyManager not found. Exiting.');
      return;
    }

    Hooks.on('renderChatLog', this.initializeButtons.bind(this));
    this.logger.info('TriniumChatButtonsMidi initialized');
  }

  static initializeButtons(chatLog, html, data) {
    const chatControls = this.getChatControls(html);
    if (!chatControls) return;
    
    const buttonGroup = this.createButtonGroup();
    chatControls.parent().prepend(buttonGroup);

    if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ENABLE_POLLING)) {
      this.startPollingMidiStates();
    }

    this.logger.info('Midi buttons initialized and added to chat controls.');
  }

  static getChatControls(html) {
    const chatControls = html.find('#chat-controls');
    if (!chatControls.length) {
      this.logger.error('No chat controls found. Unable to initialize buttons.');
      return null;
    }
    return chatControls;
  }

  static createButtonGroup() {
    const buttonGroup = $('<div id="tcb-midi-button-groups"></div>');

    if (this.shouldShowMidiButtons()) {
      const midiButtonGroup = $('<section id="tcb-midi-buttons" class="tcb-button-row"></section>');
      
      Object.values(this.BUTTONS).forEach(button => {
        const buttonElement = this.createButton(button);
        midiButtonGroup.append(buttonElement);
        this[`midi${button.id}Button`] = buttonElement;
      });

      buttonGroup.append(midiButtonGroup);
      this.attachEventListeners(buttonGroup);
    }

    return buttonGroup;
  }

  static shouldShowMidiButtons() {
    const midiVisibility = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.MIDI_BUTTON_VISIBILITY);
    const isGM = game.user.isGM;
    const isMidiActive = game.modules.get('midi-qol')?.active;

    const shouldShow = isMidiActive && (
      (midiVisibility === 'everyone') ||
      (midiVisibility === 'players' && !isGM) ||
      (midiVisibility === 'gm' && isGM)
    );

    this.logger.debug(`Midi buttons visibility: ${shouldShow}. User is GM: ${isGM}, Setting: ${midiVisibility}, Midi-QOL active: ${isMidiActive}`);
    return shouldShow;
  }

  static createButton({ id, icon, tooltip }) {
    const button = document.createElement('button');
    button.id = id;
    button.className = 'tcb-button';
    button.title = game.i18n.localize(tooltip);

    const iconElement = document.createElement('i');
    iconElement.className = `fas ${icon}`;
    button.appendChild(iconElement);

    return button;
  }

  static attachEventListeners(buttonGroup) {
    buttonGroup.on('click', 'button', this.handleButtonClick.bind(this));
  }

  static handleButtonClick(event) {
      const buttonId = event.currentTarget.id;
      const button = Object.values(this.BUTTONS).find(b => b.id === buttonId);
      if (button) {
        this.toggleMidiState(button.key);
      }
      }

  static updateButtonHighlight() {
    Object.values(this.BUTTONS).forEach(button => {
      const buttonElement = this[`midi${button.id}Button`];
      if (buttonElement) {
        this.updateButtonState(buttonElement, this.midiKeyManager[button.key]);
      }
    });
  }

  static updateButtonState(button, state) {
    button.classList.toggle('tcb-active', state);
  }

  static toggleMidiState(key) {
    if (this.midiKeyManager) {
      this.midiKeyManager[key] = !this.midiKeyManager[key];
      this.updateButtonHighlight();
      this.logger.info(`Toggled Midi ${key} to ${this.midiKeyManager[key]}`);
    } else {
      this.logger.error('Unable to access MidiKeyManager');
    }
  }

  static getMidiKeyManager() {
    const midiQOL = game.modules.get('midi-qol');
    return midiQOL?.active ? (midiQOL.api?.MidiKeyManager ?? window.MidiKeyManager) : null;
  }

  static startPollingMidiStates() {
    const pollingRate = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.POLLING_RATE);
    this.pollingInterval = setInterval(() => {
      this.updateButtonHighlight();
    }, pollingRate);
    this.logger.info(`Started polling MidiQOL states with a rate of ${pollingRate} ms`);
  }
}

export function init() {
  MidiButtons.init();
}