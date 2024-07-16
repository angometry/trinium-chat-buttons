class TriniumChatButtonsCombatTracker {
  static init() {
    Hooks.on('renderChatLog', this.initializeButtons.bind(this));
    this.initialized = false;
  }

  static initializeButtons(chatLog, html, data) {
    const chatControls = html.find('#chat-controls');

    if (!chatControls.length) {
      this.log('No chat controls found.');
      return;
    }

    if (!this.initialized) {
      this.addCombatTrackerButton();
      const combatTracker = this.createMiniCombatTracker();

      chatControls.parent().prepend(combatTracker);

      this.addEventListeners();
      this.initialized = true;
    }
  }

  static addCombatTrackerButton() {
    const combatTrackerVisibility = game.settings.get('trinium-chat-buttons', 'combatTrackerButtonVisibility');
    const isGM = game.user.isGM;

    const showCombatTrackerButtons = (combatTrackerVisibility === 'everyone') ||
                                     (combatTrackerVisibility === 'players' && !isGM) ||
                                     (combatTrackerVisibility === 'gm' && isGM);

    if (showCombatTrackerButtons) {
      const midiButtonsContainer = $('#tcb-midi-buttons');
      const combatTrackerButton = $(`<button class="tcb-button" id="tcb-combat-tracker-toggle" title="${game.i18n.localize('TRINIUMCB.ToggleCombatTracker')}">
        <i class="fas fa-fist-raised"></i>
      </button>`);

      if (midiButtonsContainer.length) {
        midiButtonsContainer.append(combatTrackerButton);
      } else {
        const buttonGroup = $('<div id="tcb-combat-tracker-button-groups" class="tcb-button-row"></div>');
        buttonGroup.append(combatTrackerButton);
        $('#chat-controls').parent().prepend(buttonGroup);
      }

      combatTrackerButton.on('click', async () => {
        await this.toggleCombatTracker();
      });
    }
  }

  static addEventListeners() {
    Hooks.on('updateCombat', () => {
      this.updateMiniCombatTracker($('#tcb-mini-combat-tracker'));
    });

    Hooks.on('updateCombatant', () => {
      this.updateMiniCombatTracker($('#tcb-mini-combat-tracker'));
    });

    Hooks.on('deleteCombatant', () => {
      this.updateMiniCombatTracker($('#tcb-mini-combat-tracker'));
    });

    Hooks.on('renderCombatTracker', () => {
      this.updateMiniCombatTracker($('#tcb-mini-combat-tracker'));
    });
  }

  static async toggleCombatTracker() {
    let combatTracker = $('#tcb-mini-combat-tracker');
    const combatTrackerButton = $('#tcb-combat-tracker-toggle');
    if (combatTracker.length) {
      combatTracker.toggle();
      combatTrackerButton.toggleClass('tcb-active', combatTracker.is(':visible'));
      this.log('Toggled combat tracker visibility.');
    } else {
      combatTracker = this.createMiniCombatTracker();
      $('#chat-controls').parent().prepend(combatTracker);
      combatTrackerButton.addClass('tcb-active');
      this.log('Created and displayed mini combat tracker.');
    }
  }

  static createMiniCombatTracker() {
    const combatTracker = $('<div id="tcb-mini-combat-tracker" class="tcb-button-row"></div>');
    this.updateMiniCombatTracker(combatTracker);

    return combatTracker;
  }

  static updateMiniCombatTracker(combatTracker) {
    const combat = game.combats.active;
    if (combat) {
      const combatants = combat.setupTurns().map(c => `
        <div class="tcb-combatant-mini ${c.id === combat.combatant?.id ? 'tcb-active' : ''}" data-combatant-id="${c.id}" data-token-id="${c.token.id}">
          <div class="tcb-combatant-mini-initiative">${c.initiative !== null ? c.initiative : '-'}</div>
          <div class="tcb-combatant-mini-name">${c.name}</div>
          <img src="${c.img}" alt="${c.name}" class="tcb-combatant-mini-img">
          <div class="tcb-combatant-mini-health">${c.actor.system.attributes.hp.value} / ${c.actor.system.attributes.hp.max}</div>
        </div>
      `).join('');

      const controls = `
        <div class="tcb-combat-controls-mini">
          <button data-control="previousRound" title="${game.i18n.localize('TRINIUMCB.PreviousRound')}"><i class="fas fa-step-backward"></i></button>
          <button data-control="previousTurn" title="${game.i18n.localize('TRINIUMCB.PreviousTurn')}"><i class="fas fa-arrow-left"></i></button>
          <button data-control="nextTurn" title="${game.i18n.localize('TRINIUMCB.NextTurn')}"><i class="fas fa-arrow-right"></i></button>
          <button data-control="nextRound" title="${game.i18n.localize('TRINIUMCB.NextRound')}"><i class="fas fa-step-forward"></i></button>
        </div>
      `;

      combatTracker.html(`
        <div class="tcb-combatants-mini">${combatants}</div>
        ${controls}
      `);

      this.addCombatTrackerEventListeners();
      this.scrollToActiveCombatant(combatTracker);
    }
  }

  static addCombatTrackerEventListeners() {
    $('#tcb-mini-combat-tracker .tcb-combat-controls-mini button').off('click').on('click', async (event) => {
      const control = $(event.currentTarget).data('control');
      const combat = game.combats.active;
      if (combat) {
        switch (control) {
          case 'previousRound':
            await combat.previousRound();
            break;
          case 'previousTurn':
            await combat.previousTurn();
            break;
          case 'nextTurn':
            await combat.nextTurn();
            break;
          case 'nextRound':
            await combat.nextRound();
            break;
        }
        this.updateMiniCombatTracker($('#tcb-mini-combat-tracker'));
        this.log(`Executed combat control: ${control}`);
      }
    });

    $('#tcb-mini-combat-tracker .tcb-combatant-mini').off('mouseenter mouseleave').on('mouseenter', (event) => {
      const tokenId = $(event.currentTarget).data('token-id');
      const token = canvas.tokens.get(tokenId);
      if (token) {
        token._onHoverIn(event);
      }
    }).on('mouseleave', (event) => {
      const tokenId = $(event.currentTarget).data('token-id');
      const token = canvas.tokens.get(tokenId);
      if (token) {
        token._onHoverOut(event);
      }
    });

    $('#tcb-mini-combat-tracker .tcb-combatant-mini').off('click').on('click', (event) => {
      const tokenId = $(event.currentTarget).data('token-id');
      const token = canvas.tokens.get(tokenId);
      if (token) {
        token.control({ releaseOthers: true });
      }
    });
  }

  static scrollToActiveCombatant(combatTracker) {
    const activeCombatant = combatTracker.find('.tcb-combatant-mini.tcb-active');
    if (activeCombatant.length) {
      const container = combatTracker.find('.tcb-combatants-mini');
      const scrollPosition = activeCombatant.position().left + container.scrollLeft() - (container.width() / 2) + (activeCombatant.width() / 2);
      container.scrollLeft(scrollPosition);
    }
  }

  static log(...args) {
    if (game.settings.get('trinium-chat-buttons', 'debug')) {
      console.log('TriniumChatButtonsCombatTracker |', ...args);
    }
  }
}

export function init() {
  TriniumChatButtonsCombatTracker.init();
}
