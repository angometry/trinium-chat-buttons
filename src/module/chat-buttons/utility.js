import { TriniumLogger } from '../logger.js';
import { SETTINGS } from '../settings.js';

class UtilityButtons {
  static logger;

  static init() {
    this.logger = new TriniumLogger(SETTINGS.MODULE_NAME);
    this.logger.info('Initializing Trinium Chat Buttons Utility Buttons');
  }

  static initialize(container, buttonRow) {
    if (!this.shouldShowUtilityButtons()) {
      this.logger.debug('Utility buttons not enabled for this user');
      return;
    }

    this.addUtilityButtons(buttonRow);
    this.addUtilityButtonsListeners();

    this.logger.info('Utility Buttons initialized');
  }

  static shouldShowUtilityButtons() {
    const combatTrackerVisibility = game.settings.get(SETTINGS.MODULE_NAME, SETTINGS.COMBAT_TRACKER_VISIBILITY);

    return (
      combatTrackerVisibility === 'everyone' ||
      (combatTrackerVisibility === 'players' && !game.user.isGM) ||
      (combatTrackerVisibility === 'gm' && game.user.isGM)
    );
  }

  static addUtilityButtons(buttonRow) {
    buttonRow.append(this.createControlIcons());
    this.logger.debug('Utility buttons added');
  }

  static createControlIcons() {
    if (game.user.isGM) {
      return this.createGMControlIcons();
    } else {
      return this.createPlayerControlIcons();
    }
  }

  static createGMControlIcons() {
    return `
      <button type="button" class="tcb-button" id="tcb-roll-npc-initiative" title="${game.i18n.localize(
        'TRINIUMCB.RollNPCInitiative'
      )}">
        <i class="fas fa-dice"></i>
      </button>
      <button type="button" class="tcb-button" id="tcb-select-all-player-tokens" title="${game.i18n.localize(
        'TRINIUMCB.SelectAllPlayerTokens'
      )}">
        <i class="fas fa-users"></i>
      </button>
      <button type="button" class="tcb-button" id="tcb-select-random-player-token" title="${game.i18n.localize(
        'TRINIUMCB.SelectRandomPlayerToken'
      )}">
        <i class="fas fa-random"></i>
      </button>
    `;
  }

  static createPlayerControlIcons() {
    return `
      <button type="button" class="tcb-button" id="tcb-roll-player-initiative" title="${game.i18n.localize(
        'TRINIUMCB.RollPlayerInitiative'
      )}">
        <i class="fas fa-dice"></i>
      </button>
      <button type="button" class="tcb-button" id="tcb-select-own-token" title="${game.i18n.localize('TRINIUMCB.SelectOwnToken')}">
        <i class="fas fa-user"></i>
      </button>
    `;
  }

  static addUtilityButtonsListeners() {
    $('#tcb-roll-npc-initiative').on('click', this.buttonRollNPCInitiative.bind(this));
    $('#tcb-select-all-player-tokens').on('click', this.buttonSelectAllPlayerTokens.bind(this));
    $('#tcb-select-all-player-tokens').on('dblclick', this.buttonSelectAllNPCTokens.bind(this));
    $('#tcb-select-random-player-token').on('click', this.buttonSelectRandomPlayerToken.bind(this));
    $('#tcb-roll-player-initiative').on('click', this.buttonRollPlayerInitiative.bind(this));
    $('#tcb-select-own-token').on('click', this.buttonSelectOwnToken.bind(this));
    this.logger.debug('Combat tracker button listeners added');
  }

  static async buttonRollNPCInitiative() {
    const combat = game.combats.active;
    if (combat) {
      await combat.rollNPC();
      this.logger.debug('Rolled NPC initiative.');
    }
  }

  static buttonSelectAllPlayerTokens() {
    this.selectTokens((token) => token.actor?.hasPlayerOwner);
    this.logger.debug('Selected all player tokens.');
  }

  static buttonSelectAllNPCTokens() {
    this.selectTokens((token) => !token.actor?.hasPlayerOwner);
    this.logger.debug('Selected all NPC tokens.');
  }

  static selectTokens(filterFn) {
    canvas.tokens.releaseAll();
    const tokens = canvas.tokens.placeables.filter(filterFn);
    tokens.forEach((t) => t.control({ releaseOthers: false }));

    if (tokens.length > 0) {
      const avgX = tokens.reduce((sum, t) => sum + t.x, 0) / tokens.length;
      const avgY = tokens.reduce((sum, t) => sum + t.y, 0) / tokens.length;
      canvas.animatePan({ x: avgX, y: avgY });
    }
  }

  static buttonSelectRandomPlayerToken() {
    const selectedTokens = canvas.tokens.controlled;
    let tokens =
      selectedTokens.length > 1 ? selectedTokens : canvas.tokens.placeables.filter((t) => t.actor?.hasPlayerOwner);

    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
    if (randomToken) {
      randomToken.control({ releaseOthers: true });
      ui.notifications.info(`${game.i18n.localize('TRINIUMCB.TokenSelected')}: ${randomToken.name}`);
      this.logger.debug('Selected a random player token.');
    }
  }

  static async buttonRollPlayerInitiative() {
    const combat = game.combats.active;
    if (!combat) return;
    const combatant = combat.getCombatantsByActor(game.user.character.id)[0];
    if (combatant && combatant.actor && combatant.token.isOwner) {
      await combat.rollInitiative([combatant.id]);
      this.logger.debug('Rolled initiative for player.');
    }
  }

  static buttonSelectOwnToken() {
    canvas.tokens.releaseAll();
    const token = canvas.tokens.placeables.find((t) => t.actor?.id === game.user.character.id);
    if (token) {
      token.control({ releaseOthers: true });
      canvas.animatePan({ x: token.x, y: token.y });
      this.logger.debug('Selected own token and panned to it.');
    }
  }
}

export function initialize(container, buttonRow) {
  UtilityButtons.init();
  UtilityButtons.initialize(container, buttonRow);
}