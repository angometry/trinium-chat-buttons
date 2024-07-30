import { TriniumLogger } from '../logger.js';
import { SETTINGS } from '../settings.js';

class MiniCombatTracker {
  static logger;
  static #eventsBound = false;

  static init() {
    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    this.logger.info('Initializing Trinium Chat Buttons Combat Tracker');
    Hooks.on('renderChatLog', this.onRenderChatLog.bind(this));
    this.registerHooks();
  }

  static onRenderChatLog(chatLog, html, data) {
    const chatControls = html.find('#chat-controls');
    if (!chatControls.length) {
      this.logger.debug('No chat controls found.');
      return;
    }

    if (this.shouldShowCombatTrackerButtons()) {
      this.initializeCombatTracker(chatControls);
    }
  }

  static shouldShowCombatTrackerButtons() {
    const combatTrackerVisibility = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.COMBAT_TRACKER_VISIBILITY);
    return (
      combatTrackerVisibility === 'everyone' ||
      (combatTrackerVisibility === 'players' && !game.user.isGM) ||
      (combatTrackerVisibility === 'gm' && game.user.isGM)
    );
  }

  static initializeCombatTracker(chatControls) {
    this.addCombatTrackerButtons(chatControls);
    chatControls.parent().prepend(this.createMiniCombatTracker());

    if (!this.#eventsBound) {
      this.bindEvents();
      this.#eventsBound = true;
    }

    this.initialized = true;
    this.logger.info('Combat tracker initialized');
    this.toggleCombatTracker();
  }

  static bindEvents() {
    $(document)
      .on('click.tcb-combat', '#tcb-combat-tracker-toggle', this.toggleCombatTracker.bind(this))
      .on('click.tcb-combat', '#tcb-mini-combat-tracker .tcb-combat-controls-mini button', this.handleControlButtonClick.bind(this))
      .on('click.tcb-combat', '#tcb-mini-combat-tracker .tcb-combatant-mini', this.handleCombatantClick.bind(this))
      .on('dblclick.tcb-combat', '#tcb-mini-combat-tracker .tcb-combatant-mini', this.handleCombatantDoubleClick.bind(this))
      .on('mouseenter.tcb-combat mouseleave.tcb-combat', '#tcb-mini-combat-tracker .tcb-combatant-mini', this.handleCombatantHover.bind(this));

    if (game.user.isGM) {
      $(document)
        .on('contextmenu.tcb-combat', '#tcb-mini-combat-tracker .tcb-combatant-mini', this.handleCombatantRightClick.bind(this))
        .on('click.tcb-combat', '#tcb-mini-combat-tracker .tcb-combatant-mini-initiative', this.handleInitiativeClick.bind(this))
        .on('click.tcb-combat', '#tcb-create-combat', this.createNewCombat.bind(this))
        .on('click.tcb-combat', '#tcb-start-combat', () => this.startCombat(game.combats.active));
    }
  }

  static async createNewCombat() {
    const combat = await Combat.create({});
    await combat.activate();
    this.updateMiniCombatTracker();
    this.logger.info('Created and activated new combat');
  }

  static async startCombat(combat) {
    await combat.startCombat();
    await combat.activate();
    this.updateMiniCombatTracker();
    this.logger.info('Started and activated combat');
  }

  static addCombatTrackerButtons(chatControls) {
    const buttonGroup = $('<div id="tcb-combat-tracker-button-groups" class="tcb-button-row"></div>');
    buttonGroup.append(this.createCombatTrackerToggleButton());
    chatControls.parent().prepend(buttonGroup);
    this.logger.debug('Combat tracker buttons added');
  }

  static createCombatTrackerToggleButton() {
    return $(`
      <button class="tcb-button" id="tcb-combat-tracker-toggle" title="${game.i18n.localize('TRINIUMCB.ToggleCombatTracker')}">
        <i class="fas fa-fist-raised"></i> ${game.i18n.localize('TRINIUMCB.MiniTracker')}
      </button>
    `);
  }

  static async toggleCombatTracker() {
    let combatTracker = $('#tcb-mini-combat-tracker');
    const combatTrackerButton = $('#tcb-combat-tracker-toggle');

    if (combatTracker.length) {
      combatTracker.slideToggle(350);
    } else {
      combatTracker = this.createMiniCombatTracker();
      $('#chat-controls').parent().prepend(combatTracker);
      combatTracker.slideDown(350);
    }

    combatTrackerButton.toggleClass('tcb-active', combatTracker.is(':visible'));
    this.logger.debug('Combat tracker visibility toggled');
  }

  static createMiniCombatTracker() {
    const combatTracker = $('<div id="tcb-mini-combat-tracker" class="tcb-button-row"></div>');
    this.updateMiniCombatTracker();
    return combatTracker;
  }

  static async updateMiniCombatTracker() {
    const combatTracker = $('#tcb-mini-combat-tracker');
    const isGM = game.user.isGM;
    let combat = game.combats.active || game.combats.viewed;

    if (!combat) {
      this.renderNoCombatState(combatTracker, isGM);
      return;
    }

    if (!combat.turns.length) {
      this.renderNoCombatantsState(combatTracker);
      return;
    }

    if (!combat.active && isGM) {
      await combat.activate();
      combat = game.combats.active;
    }

    this.renderCombatState(combatTracker, combat, isGM);
    this.scrollToActiveCombatant(combatTracker);
    this.logger.debug('Mini combat tracker updated');
  }

  static renderNoCombatState(combatTracker, isGM) {
    combatTracker.html(`
      <div class="tcb-combatants-nocombat">
        ${isGM
        ? `<button class="tcb-button" id="tcb-create-combat"><i class="fas fa-plus"></i> ${game.i18n.localize('TRINIUMCB.CreateCombat')}</button>`
        : game.i18n.localize('TRINIUMCB.NoCombat')
      }
      </div>
    `);
    this.logger.debug('Rendered no combat state');
  }

  static renderNoCombatantsState(combatTracker) {
    combatTracker.html(`
      <div class="tcb-combatants-nocombatants">${game.i18n.localize('TRINIUMCB.AddCombatants')}</div>
    `);
    this.logger.debug('Rendered no combatants state');
  }

  static renderCombatState(combatTracker, combat, isGM) {
    const onlyShowTurnControls = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.ONLY_SHOW_TURN_CONTROLS);

    if (onlyShowTurnControls) {
      combatTracker.html(this.createControls(isGM, combat));
    } else {
      const currentTurn = combat.current || { round: 0, turn: 0 };
      const combatants = this.createCombatantElements(combat, currentTurn, isGM);
      const controls = this.createControls(isGM, combat);
      const startCombatButton = !combat.started && isGM
        ? `<button class="tcb-button" id="tcb-start-combat"><i class="fas fa-play"></i> ${game.i18n.localize('TRINIUMCB.StartCombat')}</button>`
        : '';

      combatTracker.html(`
        ${isGM ? `<div class="tcb-combat-controls">${startCombatButton}</div>` : ''}
        <div class="tcb-combatants-mini">${combatants}</div>
        ${controls}
      `);
    }

    this.logger.debug('Rendered combat state');
  }

  static createCombatantElements(combat, currentTurn, isGM) {
    return combat.setupTurns().map((c, index) => {
      const { classes, displayName } = this.getCombatantDisplayInfo(c, combat, currentTurn, index, isGM);
      const healthBar = this.createHealthBar(c, isGM);

      if (game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.STYLE_FOUNDRY_COMBAT_TRACKER)) {
        this.applyClassesToFoundryTracker(c.id, classes, displayName);
      }

      return `
        <div class="tcb-combatant-mini ${classes}" data-combatant-id="${c.id}" data-token-id="${c.token.id}">
          <div class="tcb-combatant-mini-initiative" data-action="promptInitiative">
            ${c.initiative !== null ? c.initiative : '-'}
          </div>
          <div class="tcb-combatant-mini-name">${displayName}</div>
          <img src="${c.img}" alt="${c.name}" class="tcb-combatant-mini-img">
          <div class="tcb-combatant-mini-health">${healthBar}</div>
        </div>
      `;
    }).join('');
  }

  static applyClassesToFoundryTracker(combatantId, classes, displayName) {
    const combatantElement = document.querySelector(`#combat-tracker li[data-combatant-id="${combatantId}"]`);
    if (combatantElement) {
      combatantElement.className = `combatant actor directory-item flexrow ${classes}`;
      const nameElement = combatantElement.querySelector('.token-name h4');
      if (nameElement) {
        nameElement.textContent = displayName;
      }
    }
  }

  static getCombatantDisplayInfo(combatant, combat, currentTurn, index, isGM) {
    const isDefeated = combatant.defeated;
    const isHidden = combatant.token.hidden;
    const disposition = this.getCombatantDisposition(combatant);
    const isPlayer = combatant.actor?.hasPlayerOwner;
    const hideForPlayers = (!isGM && !isPlayer && !combat.started) || (currentTurn.round === 1 && index > currentTurn.turn);

    let classes = `${combatant.id === combat.combatant?.id ? 'tcb-combatant-active' : ''} ${disposition}`;
    classes += isHidden ? (isGM ? ' tcb-combatant-hiddenGM' : ' tcb-combatant-hidden') : '';
    classes = isDefeated ? `${classes} tcb-combatant-defeated` : classes.replace(' tcb-combatant-defeated', '');

    const displayName = !isGM && (!combatant.actor || !combatant.actor.hasPlayerOwner)
      ? game.i18n.localize('TRINIUMCB.Creature')
      : combatant.name;

    return { classes, displayName };
  }

  static getCombatantDisposition(combatant) {
    switch (combatant.token.disposition) {
      case -1:
        return 'tcb-combatant-enemy';
      case 1:
        return 'tcb-combatant-ally';
      case -2:
        return 'tcb-combatant-secret';
      default:
        return 'tcb-combatant-neutral';
    }
  }

  static createHealthBar(combatant, isGM) {
    if (!combatant.actor.system.attributes.hp.value || !combatant.actor.system.attributes.hp.max) {
      return '';
    }
    const healthPrivacy = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.HEALTH_PRIVACY);
    const hpPercent = combatant.actor.system.attributes.hp.value / combatant.actor.system.attributes.hp.max;
    const displayHP = `${combatant.actor.system.attributes.hp.value} / ${combatant.actor.system.attributes.hp.max}`;
    const hpColor = `rgba(${Math.round(255 - hpPercent * 200)}, ${Math.round(hpPercent * 200)}, 0, 1)`;

    if (!combatant.isNPC && !isGM) {
      return this.createFullHealthBar(hpPercent, hpColor, displayHP);
    } else if (healthPrivacy === 'healthbar' && !isGM && !combatant.token.hidden) {
      return this.createHealthBarOnly(hpPercent, hpColor);
    } else if (healthPrivacy === 'all' && !isGM && !combatant.token.hidden) {
      return this.createFullHealthBar(hpPercent, hpColor, displayHP);
    } else if (isGM) {
      return this.createFullHealthBar(hpPercent, hpColor, displayHP);
    } else {
      return '';
    }
  }

  static createFullHealthBar(hpPercent, hpColor, displayHP) {
    return `
      <div class="tcb-combatant-mini-health-bar" style="width: ${hpPercent * 100}%; background-color: ${hpColor};"></div>
      <div class="tcb-combatant-mini-health-text">${displayHP}</div>
    `;
  }

  static createHealthBarOnly(hpPercent, hpColor) {
    return `<div class="tcb-combatant-mini-health-bar" style="width: ${hpPercent * 100}%; background-color: ${hpColor};"></div>`;
  }

  static createControls(isGM, combat) {
    if (isGM) {
      return `
        <div class="tcb-combat-controls-mini">
          <button data-control="previousRound" title="${game.i18n.localize('TRINIUMCB.PreviousRound')}">
            <i class="fas fa-step-backward"></i>
          </button>
          <button data-control="previousTurn" title="${game.i18n.localize('TRINIUMCB.PreviousTurn')}">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button data-control="nextTurn" title="${game.i18n.localize('TRINIUMCB.NextTurn')}">
            <i class="fas fa-arrow-right"></i>
          </button>
          <button data-control="nextRound" title="${game.i18n.localize('TRINIUMCB.NextRound')}">
            <i class="fas fa-step-forward"></i>
          </button>
          <button data-control="endCombat" title="${game.i18n.localize('TRINIUMCB.EndCombat')}">
            <i class="fas fa-stop"></i>
          </button>
        </div>
      `;
    } else if (combat.combatant?.token?.isOwner) {
      return `
        <div class="tcb-combat-controls-mini">
          <button data-control="endTurn" title="${game.i18n.localize('TRINIUMCB.EndTurn')}" class="end-turn-button">
            <i class="fas fa-hourglass-end"></i> ${game.i18n.localize('TRINIUMCB.EndTurn')}
          </button>
        </div>
      `;
    } else {
      return '';
    }
  }

  static registerHooks() {
    Hooks.on('updateCombat', this.onUpdateCombat.bind(this));
    Hooks.on('updateCombatant', this.onUpdateCombatant.bind(this));
    Hooks.on('deleteCombatant', this.onDeleteCombatant.bind(this));
    Hooks.on('renderCombatTracker', this.onRenderCombatTracker.bind(this));
    Hooks.on('updateToken', this.onRenderCombatTracker.bind(this));
  }

  static onUpdateCombat(combat, updateData, options, userId) {
    this.updateMiniCombatTracker();
    this.logger.debug('Combat updated');
  }

  static onUpdateCombatant(combat, updateData, options, userId) {
    this.updateCombatant(updateData._id);
    this.logger.debug('Combatant updated');
  }

  static onDeleteCombatant(combat, deleteData, options, userId) {
    this.removeCombatant(deleteData._id);
    this.logger.debug('Combatant deleted');
  }

  static onRenderCombatTracker(combatTracker, html, data) {
    this.updateMiniCombatTracker();
    this.logger.debug('Combat tracker rendered');
  }

  static async onUpdateToken(token, updateData, options, userId) {
    const combat = game.combats.active;
    if (!combat) return;

    const combatant = combat.combatants.find(c => c.token.id === token.id);
    if (combatant) {
      this.updateCombatant(combatant.id);
    }
    this.logger.debug(`Token updated: ${token.name}`);
  }

  static async handleControlButtonClick(event) {
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
        case 'endTurn':
          await combat.nextTurn();
          break;
        case 'endCombat':
          await combat.endCombat();
          break;
      }
      this.logger.debug(`Executed combat control: ${control}`);
    }
  }

  static async handleInitiativeClick(event) {
    event.stopPropagation();
    const combatantId = $(event.target).closest('.tcb-combatant-mini').data('combatant-id');
    const combat = game.combat;
    if (!combat) return;

    const combatant = combat.combatants.get(combatantId);
    if (!combatant) return;

    const newInitiative = await this.promptForInitiative();
    if (newInitiative !== null) {
      await combat.updateEmbeddedDocuments('Combatant', [{ _id: combatant.id, initiative: newInitiative }]);
    }
  }

  static handleCombatantClick(event) {
    const tokenId = $(event.currentTarget).data('token-id');
    const token = canvas.tokens.get(tokenId);
    if (token) {
      token.control({ releaseOthers: true });
    }
  }

  static handleCombatantHover(event) {
    const tokenId = $(event.currentTarget).data('token-id');
    const token = canvas.tokens.get(tokenId);
    if (token) {
      event.type === 'mouseenter' ? token._onHoverIn(event) : token._onHoverOut(event);
    }
  }

  static handleCombatantDoubleClick(event) {
    const combatantId = $(event.currentTarget).data('combatant-id');
    const combat = game.combats.active;
    const combatant = combat.turns.find((c) => c.id === combatantId);
    if (combatant && combatant.actor?.sheet) {
      combatant.actor.sheet.render(true);
    }
  }

  static handleCombatantRightClick(event) {
    event.preventDefault();
    const combatantId = $(event.currentTarget).data('combatant-id');
    const combat = game.combats.active;
    const combatant = combat.turns.find((c) => c.id === combatantId);
    if (combatant) {
      this.showRightClickDialog(combatant, event.pageX, event.pageY);
    }
  }

  static showRightClickDialog(combatant, x, y) {
    const existingDialog = $('.tcb-right-click-dialog');
    const combatantElement = $(`.tcb-combatant-mini[data-combatant-id="${combatant.id}"]`);

    if (existingDialog.length) {
      const existingCombatantId = existingDialog.data('combatant-id');
      if (existingCombatantId === combatant.id) {
        existingDialog.slideUp(() => {
          existingDialog.remove();
          combatantElement.removeClass('tcb-combatant-dialogmarker');
        });
        return;
      } else {
        existingDialog.remove();
        $('.tcb-combatant-mini').removeClass('tcb-combatant-dialogmarker');
      }
    }

    const dialogContent = this.createDialogContent(combatant);
    const parentElement = $('#chat-controls-wrapper').length ? $('#chat-controls-wrapper') : $('#chat-controls').parent();
    const dialog = $(dialogContent).hide().prependTo(parentElement);

    combatantElement.addClass('tcb-combatant-dialogmarker');
    this.addDialogEventListeners(dialog, combatant);

    if (!existingDialog.length) {
      dialog.slideDown();
    } else {
      dialog.show();
    }
    this.logger.debug(`Showed right-click dialog for combatant: ${combatant.name}`);
  }

  static addDialogEventListeners(dialog, combatant) {
    dialog.find('.tcb-dialog-button').on('click', (event) => this.handleDialogAction(event, combatant));

    $(document).on('click.tcb-dialog', (event) => {
      if (!$(event.target).closest('.tcb-right-click-dialog').length) {
        dialog.slideUp(() => {
          dialog.remove();
          $(`.tcb-combatant-mini[data-combatant-id="${combatant.id}"]`).removeClass('tcb-combatant-dialogmarker');
        });
        $(document).off('click.tcb-dialog');
      }
    });
  }

  static async handleDialogAction(event, combatant) {
    const action = $(event.currentTarget).data('action');
    const disposition = $(event.currentTarget).data('disposition');
    const combat = game.combats.active;

    switch (action) {
      case 'clear-initiative':
        await combat.updateEmbeddedDocuments('Combatant', [{ _id: combatant.id, initiative: null }]);
        break;
      case 'reroll-initiative':
        await combatant.rollInitiative();
        break;
      case 'set-initiative':
        const newInitiative = await this.promptForInitiative();
        if (newInitiative !== null) {
          await combat.updateEmbeddedDocuments('Combatant', [{ _id: combatant.id, initiative: newInitiative }]);
        }
        break;
      case 'set-turn':
        await combat.update({ turn: combat.turns.indexOf(combatant) });
        break;
      case 'toggle-visibility':
        await combatant.token.update({ hidden: !combatant.token.hidden });
        break;
      case 'toggle-defeated':
        await combatant.update({ defeated: !combatant.defeated });
        break;
      case 'set-disposition':
        await combatant.token.update({ disposition: disposition });
        break;
    }

    this.updateMiniCombatTracker();
    this.refreshRightClickMenu(combatant);
    this.logger.debug(`Executed dialog action: ${action}`);
  }

  static refreshRightClickMenu(combatant) {
    const dialog = $('.tcb-right-click-dialog');
    if (dialog.length && dialog.data('combatant-id') === combatant.id) {
      const newContent = this.createDialogContent(combatant);
      dialog.html($(newContent).html());
      this.addDialogEventListeners(dialog, combatant);
    }
  }

  static async promptForInitiative() {
    return new Promise((resolve) => {
      const inputContainer = document.createElement('div');
      inputContainer.innerHTML = `
        <input type="number" id="initiative-value" class="tcb-initiative-input" placeholder="${game.i18n.localize('TRINIUMCB.EnterInitiative')}">
      `;
      inputContainer.className = 'tcb-initiative-input-container';

      const tracker = document.querySelector('#tcb-mini-combat-tracker');
      if (!tracker) {
        this.logger.debug('Combat tracker not found');
        return resolve(null);
      }
      tracker.prepend(inputContainer);

      const input = inputContainer.querySelector('#initiative-value');
      input.focus();

      const handleSubmit = () => {
        const value = parseInt(input.value);
        cleanup();
        resolve(isNaN(value) ? null : value);
      };

      const handleKeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cleanup();
          resolve(null);
        }
      };

      const cleanup = () => {
        input.removeEventListener('blur', handleSubmit);
        input.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('keydown', handleKeydown);
        inputContainer.remove();
      };

      input.addEventListener('blur', handleSubmit);
      input.addEventListener('keydown', handleKeydown);
      document.addEventListener('keydown', handleKeydown);
    });
  }

  static scrollToActiveCombatant(combatTracker) {
    const activeCombatant = combatTracker.find('.tcb-combatant-mini.tcb-combatant-active');
    if (activeCombatant.length) {
      const container = combatTracker.find('.tcb-combatants-mini');
      const scrollPosition = activeCombatant.position().left + container.scrollLeft() - container.width() / 2 + activeCombatant.width() / 2;
      container.scrollLeft(scrollPosition);
      this.logger.debug('Scrolled to active combatant.');
    }
  }

  static async updateCombatant(combatantId) {
    const combatant = game.combat?.combatants.get(combatantId);
    if (combatant) {
      const combatTracker = $('#tcb-mini-combat-tracker');
      const combatantElement = combatTracker.find(`.tcb-combatant-mini[data-combatant-id="${combatantId}"]`);
      if (combatantElement.length) {
        const { classes, displayName } = this.getCombatantDisplayInfo(combatant, game.combat, game.combat.current, combatant.turn, game.user.isGM);
        combatantElement.attr('class', `tcb-combatant-mini ${classes}`);
        combatantElement.find('.tcb-combatant-mini-name').text(displayName);
        combatantElement.find('.tcb-combatant-mini-health').html(this.createHealthBar(combatant, game.user.isGM));
        this.scrollToActiveCombatant(combatTracker);
      }
    }
  }

  static async removeCombatant(combatantId) {
    const combatTracker = $('#tcb-mini-combat-tracker');
    combatTracker.find(`.tcb-combatant-mini[data-combatant-id="${combatantId}"]`).remove();
    this.scrollToActiveCombatant(combatTracker);
  }

  static createDialogContent(combatant) {
    return `
      <div class="tcb-right-click-dialog" data-combatant-id="${combatant.id}">
        <div class="tcb-dialog-title">${game.i18n.localize('TRINIUMCB.OptionsFor')} ${combatant.name}</div>
        ${this.createDialogSection('InitiativeActions', this.createInitiativeButtons())}
        ${this.createDialogSection('VisibilityActions', this.createVisibilityButtons(combatant))}
        ${this.createDialogSection('Disposition', this.createDispositionButtons(combatant))}
      </div>
    `;
  }

  static createDialogSection(titleKey, content) {
    return `
      <div class="tcb-dialog-section">
        <div class="tcb-dialog-section-title">${game.i18n.localize(`TRINIUMCB.${titleKey}`)}</div>
        <div class="tcb-dialog-flex">${content}</div>
      </div>
    `;
  }

  static createInitiativeButtons() {
    return `
      <button class="tcb-dialog-button" data-action="clear-initiative" title="${game.i18n.localize('TRINIUMCB.ClearInitiative')}">
        <i class="fas fa-eraser"></i>
      </button>
      <button class="tcb-dialog-button" data-action="reroll-initiative" title="${game.i18n.localize('TRINIUMCB.RerollInitiative')}">
        <i class="fas fa-dice-d20"></i>
      </button>
      <button class="tcb-dialog-button" data-action="set-initiative" title="${game.i18n.localize('TRINIUMCB.SetInitiative')}">
        <i class="fas fa-input-numeric"></i>
      </button>
      <button class="tcb-dialog-button" data-action="set-turn" title="${game.i18n.localize('TRINIUMCB.SetCurrent')}">
        <i class="fas fa-arrows-to-line"></i>
      </button>
    `;
  }

  static createVisibilityButtons(combatant) {
    const hiddenClass = combatant.token.hidden ? 'tcb-button-active' : '';
    const defeatedClass = combatant.defeated ? 'tcb-button-active' : '';

    return `
      <button class="tcb-dialog-button tcb-visibility-button ${hiddenClass}" data-action="toggle-visibility" title="${game.i18n.localize('TRINIUMCB.ToggleVisibility')}">
        <i class="fas fa-eye-slash"></i>
      </button>
      <button class="tcb-dialog-button tcb-defeated-button ${defeatedClass}" data-action="toggle-defeated" title="${game.i18n.localize('TRINIUMCB.MarkDefeated')}">
        <i class="fas fa-skull"></i>
      </button>
    `;
  }

  static createDispositionButtons(combatant) {
    const dispositions = [
      { value: 0, icon: 'meh', label: 'Neutral' },
      { value: 1, icon: 'smile', label: 'Friendly' },
      { value: -1, icon: 'frown', label: 'Enemy' },
      { value: -2, icon: 'question-circle', label: 'Secret' },
    ];

    return dispositions.map((d) => {
      const activeClass = combatant.token.disposition === d.value ? 'tcb-button-active' : '';
      return `
        <button class="tcb-dialog-button tcb-disposition-button tcb-disposition-${d.value} ${activeClass}" data-action="set-disposition" data-disposition="${d.value}" title="${game.i18n.localize(`TRINIUMCB.${d.label}`)}">
          <i class="fas fa-${d.icon}"></i>
        </button>
      `;
    }).join('');
  }
}

export function init() {
  MiniCombatTracker.init();
}
