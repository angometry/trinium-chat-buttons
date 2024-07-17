class TriniumChatButtonsCombatTracker {
  static init() {
    Hooks.on("renderChatLog", this.initializeButtons.bind(this));
    this.initialized = false;
  }

  static initializeButtons(chatLog, html, data) {
    const chatControls = html.find("#chat-controls");

    if (!chatControls.length) {
      this.log("No chat controls found.");
      return;
    }

    const combatTrackerVisibility = game.settings.get(
      "trinium-chat-buttons",
      "combatTrackerButtonVisibility"
    );

    const showCombatTrackerButtons =
      combatTrackerVisibility === "everyone" ||
      (combatTrackerVisibility === "players" && !game.user.isGM) ||
      (combatTrackerVisibility === "gm" && game.user.isGM);

    if (!showCombatTrackerButtons) {
      return;
    }

    if (!this.initialized) {
      this.addCombatTrackerButtons();
      this.addCombatTrackerButtonsListeners();

      const combatTracker = this.createMiniCombatTracker();
      chatControls.parent().prepend(combatTracker);

      this.addEventListeners();
      this.initialized = true;
    }
  }

  static addCombatTrackerButtons() {
    const combatTrackerButton = $(`<button class="tcb-button" id="tcb-combat-tracker-toggle" title="${game.i18n.localize(
      "TRINIUMCB.ToggleCombatTracker"
    )}">
      <i class="fas fa-fist-raised"></i>
      ${game.i18n.localize("TRINIUMCB.MiniTracker")}
    </button>`);
  
    const controlIcons = $(
      '<div id="tcb-control-icons" class="tcb-button-row"></div>'
    );
  
    if (game.user.isGM) {
      controlIcons.append(`
        <button class="tcb-button" id="tcb-roll-npc-initiative" title="${game.i18n.localize(
          "TRINIUMCB.RollNPCInitiative"
        )}">
          <i class="fas fa-dice"></i>
        </button>
        <button class="tcb-button" id="tcb-select-all-player-tokens" title="${game.i18n.localize(
          "TRINIUMCB.SelectAllPlayerTokens"
        )}">
          <i class="fas fa-users"></i>
        </button>
        <button class="tcb-button" id="tcb-select-random-player-token" title="${game.i18n.localize(
          "TRINIUMCB.SelectRandomPlayerToken"
        )}">
          <i class="fas fa-random"></i>
        </button>
      `);
    } else {
      controlIcons.append(`
        <button class="tcb-button" id="tcb-roll-player-initiative" title="${game.i18n.localize(
          "TRINIUMCB.RollPlayerInitiative"
        )}">
          <i class="fas fa-dice"></i>
        </button>
        <button class="tcb-button" id="tcb-select-own-token" title="${game.i18n.localize(
          "TRINIUMCB.SelectOwnToken"
        )}">
          <i class="fas fa-user"></i>
        </button>
      `);
    }
  
    const buttonGroup = $(
      '<div id="tcb-combat-tracker-button-groups" class="tcb-button-row"></div>'
    );
    buttonGroup.append(combatTrackerButton);
    buttonGroup.append(controlIcons);
  
    $("#chat-controls").parent().prepend(buttonGroup);
  }
  

  static addCombatTrackerButtonsListeners() {
    $("#tcb-combat-tracker-toggle").off("click").on("click", async () => {
      await this.toggleCombatTracker();
    });
  
    $("#tcb-roll-npc-initiative").off("click").on("click", async () => {
      await this.buttonRollNPCInitiative();
    });
  
    $("#tcb-select-all-player-tokens").off("click").on("click", () => {
      this.buttonSelectAllPlayerTokens();
    });
  
    $("#tcb-select-all-player-tokens").off("dblclick").on("dblclick", () => {
      this.buttonSelectAllNPCTokens();
    });
  
    $("#tcb-select-random-player-token").off("click").on("click", () => {
      this.buttonSelectRandomPlayerToken();
    });
  
    $("#tcb-roll-player-initiative").off("click").on("click", async () => {
      await this.buttonRollPlayerInitiative();
    });
  
    $("#tcb-select-own-token").off("click").on("click", () => {
      this.buttonSelectOwnToken();
    });
  }
  

  static async buttonRollNPCInitiative() {
    const combat = game.combats.active;
    if (combat) {
      await combat.rollNPC();
      this.log("Rolled NPC initiative.");
    }
  }
  
  static buttonSelectAllPlayerTokens() {
    canvas.tokens.releaseAll();
    const tokens = canvas.tokens.placeables.filter(
      (t) => t.actor?.hasPlayerOwner
    );
    tokens.forEach((t) => t.control({ releaseOthers: false }));
  
    if (tokens.length > 0) {
      const avgX = tokens.reduce((sum, t) => sum + t.x, 0) / tokens.length;
      const avgY = tokens.reduce((sum, t) => sum + t.y, 0) / tokens.length;
      canvas.animatePan({ x: avgX, y: avgY });
    }
  
    this.log("Selected all player tokens.");
  }
  
  
  static buttonSelectAllNPCTokens() {
    canvas.tokens.releaseAll();
    const tokens = canvas.tokens.placeables.filter(
      (t) => !t.actor?.hasPlayerOwner
    );
    tokens.forEach((t) => t.control({ releaseOthers: false }));
  
    if (tokens.length > 0) {
      const avgX = tokens.reduce((sum, t) => sum + t.x, 0) / tokens.length;
      const avgY = tokens.reduce((sum, t) => sum + t.y, 0) / tokens.length;
      canvas.animatePan({ x: avgX, y: avgY });
    }
  
    this.log("Selected all NPC tokens.");
  }
  
  
  static buttonSelectRandomPlayerToken() {
    const selectedTokens = canvas.tokens.controlled;
    let tokens;
  
    if (selectedTokens.length > 1) {
      tokens = selectedTokens;
    } else {
      tokens = canvas.tokens.placeables.filter(
        (t) => t.actor?.hasPlayerOwner
      );
    }
  
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
    if (randomToken) {
      randomToken.control({ releaseOthers: true });
      ui.notifications.info(`${game.i18n.localize("TRINIUMCB.TokenSelected")}: ${randomToken.name}`);
      this.log("Selected a random player token.");
    }
  }
  
  
  static async buttonRollPlayerInitiative() {
    const combat = game.combats.active;
    if (!combat) return;
    const combatant = combat.getCombatantsByActor(game.user.character.id)[0];
    if (combatant && combatant.actor && combatant.token.isOwner) {
      await combat.rollInitiative([combatant.id]);
      this.log("Rolled initiative for player.");
    }
  }
  
  static buttonSelectOwnToken() {
    canvas.tokens.releaseAll();
    const token = canvas.tokens.placeables.find(
      (t) => t.actor?.id === game.user.character.id
    );
    if (token) {
      token.control({ releaseOthers: true });
      canvas.animatePan({ x: token.x, y: token.y });
      this.log("Selected own token and panned to it.");
    }
  }
  
  static showDialogWithTokenName(token) {
    new Dialog({
      title: game.i18n.localize("TRINIUMCB.RandomTokenSelected"),
      content: `<p>${game.i18n.localize("TRINIUMCB.TokenSelected")}: ${token.name}</p>`,
      buttons: {
        ok: {
          label: "OK"
        }
      }
    }).render(true);
  }
  

  static createMiniCombatTracker() {
    const combatTracker = $(
      '<div id="tcb-mini-combat-tracker" class="tcb-button-row"></div>'
    );

    this.updateMiniCombatTracker(combatTracker);

    return combatTracker;
  }

  static async toggleCombatTracker() {
    let combatTracker = $("#tcb-mini-combat-tracker");
    const combatTrackerButton = $("#tcb-combat-tracker-toggle");
    if (combatTracker.length) {
      combatTracker.toggle();
      combatTrackerButton.toggleClass(
        "tcb-active",
        combatTracker.is(":visible")
      );
      this.log("Toggled combat tracker visibility.");
    } else {
      combatTracker = this.createMiniCombatTracker();
      $("#chat-controls").parent().prepend(combatTracker);
      combatTrackerButton.addClass("tcb-active");
      this.log("Created and displayed mini combat tracker.");
    }
  }

  static async updateMiniCombatTracker(combatTracker) {
    const isGM = game.user.isGM;
    let combat = game.combats.active || game.combats.viewed;
  
    if (!combat) {
      combatTracker.html(`
        <div class="tcb-combatants-nocombat">
          ${isGM ? `<button class="tcb-button" id="tcb-create-combat"><i class="fas fa-plus"></i> ${game.i18n.localize("TRINIUMCB.CreateCombat")}</button>` : game.i18n.localize("TRINIUMCB.NoCombat")}
        </div>
      `);
      if (isGM) {
        $("#tcb-create-combat").off("click").on("click", async () => {
          combat = await Combat.create({});
          await combat.activate();
          this.updateMiniCombatTracker(combatTracker);
        });
      }
      this.log("No combat exists. Displayed create combat button or status message.");
      return;
    }
  
    if (!combat.turns.length) {
      combatTracker.html(`
        <div class="tcb-combatants-nocombatants">${game.i18n.localize("TRINIUMCB.AddCombatants")}</div>
      `);
      this.log("No combatants. Displayed add combatants message.");
      return;
    }
  
    if (!combat.active && isGM) {
      await combat.activate();
      combat = game.combats.active;
    }
  
    const currentTurn = combat.current || { round: 0, turn: 0 };
    const combatants = combat.setupTurns().map((c, index) => {
      const isDefeated = c.defeated;
      const isHidden = c.token.hidden;
      const disposition = c.token.disposition === -1 ? "enemy" : c.token.disposition === 1 ? "ally" : c.token.disposition === -2 ? "secret" : "neutral";
      const isPlayer = c.actor?.hasPlayerOwner;
      const hideForPlayers = !isGM && (!isPlayer && !combat.started) || (currentTurn.round === 1 && index > currentTurn.turn);
  
      let classes = `${c.id === combat.combatant?.id ? "tcb-active" : ""} ${disposition}`;
  
      if (isHidden) {
        classes += isGM ? " hiddenGM" : " hidden";
      } else if (hideForPlayers && !isGM) {
        classes += " hidden";
      } else {
        classes = classes.replace(" hiddenGM", "").replace(" hidden", "");
      }
  
      if (isDefeated) {
        classes += " tcb-defeated";
      } else {
        classes = classes.replace(" tcb-defeated", "");
      }
  
      const displayName = !isGM && (!c.actor || !c.actor.hasPlayerOwner) ? game.i18n.localize("TRINIUMCB.Creature") : c.name;
      const healthBar = this.createHealthBar(c, isGM);
  
      return `
      <div class="tcb-combatant-mini ${classes}" data-combatant-id="${c.id}" data-token-id="${c.token.id}">
        <div class="tcb-combatant-mini-initiative">${c.initiative !== null ? c.initiative : "-"}</div>
        <div class="tcb-combatant-mini-name">${displayName}</div>
        <img src="${c.img}" alt="${c.name}" class="tcb-combatant-mini-img">
        <div class="tcb-combatant-mini-health">${healthBar}</div>
      </div>
      `;
    }).join("");
  
    const controls = this.createControls(isGM, combat);
    const startCombatButton = !combat.started && isGM ? `<button class="tcb-button" id="tcb-start-combat"><i class="fas fa-play"></i> ${game.i18n.localize("TRINIUMCB.StartCombat")}</button>` : "";
  
    combatTracker.html(`
      ${isGM ? `<div class="tcb-combat-controls">${startCombatButton}</div>` : ""}
      <div class="tcb-combatants-mini">${combatants}</div>
      ${controls}
    `);
  
    if (startCombatButton) {
      $("#tcb-start-combat").off("click").on("click", async () => {
        await combat.startCombat();
        await combat.activate();
        this.updateMiniCombatTracker(combatTracker);
      });
    }
  
    this.addCombatTrackerEventListeners();
    if(isGM){this.addRightClickDialogListeners()};
    this.scrollToActiveCombatant(combatTracker);
    this.log("Updated mini combat tracker.");
  }
  
  
  
  
  
  

  static createHealthBar(combatant, isGM) {
    const healthPrivacy = game.settings.get("trinium-chat-buttons", "healthPrivacy");
    const hpPercent = combatant.actor ? combatant.actor.system.attributes.hp.value / combatant.actor.system.attributes.hp.max : 0;
    const displayHP = combatant.actor ? `${combatant.actor.system.attributes.hp.value} / ${combatant.actor.system.attributes.hp.max}` : "";
    const hpColor = `rgba(${Math.round(255 - (hpPercent * 200))}, ${Math.round(hpPercent * 200)}, 0, 1)`;
  
    if (!combatant.isNPC && !isGM) {
      return `<div class="tcb-combatant-mini-health-bar" style="width: ${hpPercent * 100}%; background-color: ${hpColor};"></div>
              <div class="tcb-combatant-mini-health-text">${displayHP}</div>`;
    } else if (healthPrivacy === "healthbar" && !isGM && !combatant.token.hidden) {
      return `<div class="tcb-combatant-mini-health-bar" style="width: ${hpPercent * 100}%; background-color: ${hpColor};"></div>`;
    } else if (healthPrivacy === "all" && !isGM && !combatant.token.hidden) {
      return `<div class="tcb-combatant-mini-health-bar" style="width: ${hpPercent * 100}%; background-color: ${hpColor};"></div>
              <div class="tcb-combatant-mini-health-text">${displayHP}</div>`;
    } else if (isGM) {
      return `<div class="tcb-combatant-mini-health-bar" style="width: ${hpPercent * 100}%; background-color: ${hpColor};"></div>
              <div class="tcb-combatant-mini-health-text">${displayHP}</div>`;
    } else {
      return '';
    }
  }
  

  

  static createControls(isGM, combat) {
    if (isGM) {
      return `
        <div class="tcb-combat-controls-mini">
          <button data-control="previousRound" title="${game.i18n.localize(
            "TRINIUMCB.PreviousRound"
          )}">
            <i class="fas fa-step-backward"></i>
          </button>
          <button data-control="previousTurn" title="${game.i18n.localize(
            "TRINIUMCB.PreviousTurn"
          )}">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button data-control="nextTurn" title="${game.i18n.localize(
            "TRINIUMCB.NextTurn"
          )}">
            <i class="fas fa-arrow-right"></i>
          </button>
          <button data-control="nextRound" title="${game.i18n.localize(
            "TRINIUMCB.NextRound"
          )}">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
      `;
    } else if (combat.combatant?.token?.isOwner) {
      return `
        <div class="tcb-combat-controls-mini">
          <button data-control="endTurn" title="${game.i18n.localize(
            "TRINIUMCB.EndTurn"
          )}" class="end-turn-button">
            <i class="fas fa-hourglass-end"></i> ${game.i18n.localize(
              "TRINIUMCB.EndTurn"
            )}
          </button>
        </div>
      `;
    } else {
      return "";
    }
  }

  static addEventListeners() {
    Hooks.on("updateCombat", () => {
      this.updateMiniCombatTracker($("#tcb-mini-combat-tracker"));
      this.log("Combat updated.");
    });

    Hooks.on("updateCombatant", () => {
      this.updateMiniCombatTracker($("#tcb-mini-combat-tracker"));
      this.log("Combatant updated.");
    });

    Hooks.on("deleteCombatant", () => {
      this.updateMiniCombatTracker($("#tcb-mini-combat-tracker"));
      this.log("Combatant deleted.");
    });

    Hooks.on("renderCombatTracker", () => {
      this.updateMiniCombatTracker($("#tcb-mini-combat-tracker"));
      this.log("Combat tracker rendered.");
    });
  }

  static addCombatTrackerEventListeners() {
    $("#tcb-mini-combat-tracker .tcb-combat-controls-mini button")
      .off("click")
      .on("click", async (event) => {
        const control = $(event.currentTarget).data("control");
        const combat = game.combats.active;
        if (combat) {
          switch (control) {
            case "previousRound":
              await combat.previousRound();
              break;
            case "previousTurn":
              await combat.previousTurn();
              break;
            case "nextTurn":
              await combat.nextTurn();
              break;
            case "nextRound":
              await combat.nextRound();
              break;
            case "endTurn":
              await combat.nextTurn();
              break;
          }
          this.updateMiniCombatTracker($("#tcb-mini-combat-tracker"));
          this.log(`Executed combat control: ${control}`);
        }
      });

    $("#tcb-mini-combat-tracker .tcb-combatant-mini")
      .off("mouseenter mouseleave")
      .on("mouseenter", (event) => {
        const tokenId = $(event.currentTarget).data("token-id");
        const token = canvas.tokens.get(tokenId);
        if (token) {
          token._onHoverIn(event);
        }
      })
      .on("mouseleave", (event) => {
        const tokenId = $(event.currentTarget).data("token-id");
        const token = canvas.tokens.get(tokenId);
        if (token) {
          token._onHoverOut(event);
        }
      });

    $("#tcb-mini-combat-tracker .tcb-combatant-mini")
      .off("click")
      .on("click", (event) => {
        const tokenId = $(event.currentTarget).data("token-id");
        const token = canvas.tokens.get(tokenId);
        if (token) {
          token.control({ releaseOthers: true });
        }
      });

    $("#tcb-mini-combat-tracker .tcb-combatant-mini")
      .off("dblclick")
      .on("dblclick", (event) => {
        const combatantId = $(event.currentTarget).data("combatant-id");
        const combat = game.combats.active;
        const combatant = combat.turns.find((c) => c.id === combatantId);
        if (combatant && combatant.actor?.sheet) {
          combatant.actor.sheet.render(true);
        }
      });

  }

  static addRightClickDialogListeners() {
    $("#tcb-mini-combat-tracker .tcb-combatant-mini").off("contextmenu").on("contextmenu", (event) => {
      event.preventDefault();
  
      const combatantId = $(event.currentTarget).data("combatant-id");
      const combat = game.combats.active;
      const combatant = combat.turns.find(c => c.id === combatantId);
      if (combatant) {
        this.showRightClickDialog(combatant, event.pageX, event.pageY);
      }
    });
  }
  
  static showRightClickDialog(combatant, x, y) {
    const existingDialog = $(".tcb-right-click-dialog");
  
    if (existingDialog.length) {
      const existingCombatantId = existingDialog.data("combatant-id");
      if (existingCombatantId === combatant.id) {
        existingDialog.slideUp(() => existingDialog.remove());
        return;
      } else {
        existingDialog.remove();
      }
    }
  
    const dialogContent = `
      <div class="tcb-right-click-dialog" data-combatant-id="${combatant.id}">
        <div class="tcb-dialog-title">${game.i18n.localize("TRINIUMCB.OptionsFor")} ${combatant.name}</div>
        <div class="tcb-dialog-section">
          <div class="tcb-dialog-section-title">${game.i18n.localize("TRINIUMCB.InitiativeActions")}</div>
          <div class="tcb-dialog-flex">
            <button class="tcb-dialog-button" data-action="clear-initiative" title="${game.i18n.localize("TRINIUMCB.ClearInitiative")}">
              <i class="fas fa-eraser"></i>
            </button>
            <button class="tcb-dialog-button" data-action="reroll-initiative" title="${game.i18n.localize("TRINIUMCB.RerollInitiative")}">
              <i class="fas fa-dice-d20"></i>
            </button>
            <button class="tcb-dialog-button" data-action="set-initiative" title="${game.i18n.localize("TRINIUMCB.SetInitiative")}">
              <i class="fas fa-input-numeric"></i>
            </button>
            <button class="tcb-dialog-button" data-action="set-turn" title="${game.i18n.localize("TRINIUMCB.SetCurrent")}">
              <i class="fas fa-arrows-to-line"></i>
            </button>
          </div>
        </div>
        <div class="tcb-dialog-section">
          <div class="tcb-dialog-section-title">${game.i18n.localize("TRINIUMCB.VisibilityActions")}</div>
          <div class="tcb-dialog-flex">
            <button class="tcb-dialog-button" data-action="toggle-visibility" title="${game.i18n.localize("TRINIUMCB.ToggleVisibility")}">
              <i class="fas fa-eye-slash"></i>
            </button>
            <button class="tcb-dialog-button" data-action="toggle-defeated" title="${game.i18n.localize("TRINIUMCB.MarkDefeated")}">
              <i class="fas fa-skull"></i>
            </button>
          </div>
        </div>
        <div class="tcb-dialog-section">
          <div class="tcb-dialog-section-title">${game.i18n.localize("TRINIUMCB.Disposition")}</div>
          <div class="tcb-dialog-disposition">
            <button class="tcb-dialog-button" data-action="set-disposition" data-disposition="0" title="${game.i18n.localize("TRINIUMCB.Neutral")}">
              <i class="fas fa-meh"></i>
            </button>
            <button class="tcb-dialog-button" data-action="set-disposition" data-disposition="1" title="${game.i18n.localize("TRINIUMCB.Friendly")}">
              <i class="fas fa-smile"></i>
            </button>
            <button class="tcb-dialog-button" data-action="set-disposition" data-disposition="-1" title="${game.i18n.localize("TRINIUMCB.Enemy")}">
              <i class="fas fa-frown"></i>
            </button>
            <button class="tcb-dialog-button" data-action="set-disposition" data-disposition="-2" title="${game.i18n.localize("TRINIUMCB.Secret")}">
              <i class="fas fa-question-circle"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  
    const parentElement = $("#chat-controls-wrapper").length ? $("#chat-controls-wrapper") : $("#chat-controls").parent();
    const dialog = $(dialogContent).hide().prependTo(parentElement);
  
    dialog.find(".tcb-dialog-button").on("click", async (event) => {
      const action = $(event.currentTarget).data("action");
      const disposition = $(event.currentTarget).data("disposition");
      const combat = game.combats.active;
  
      switch (action) {
        case "clear-initiative":
          await combat.updateEmbeddedDocuments('Combatant', [{ _id: combatant.id, initiative: null }]);
          break;
        case "reroll-initiative":
          await combatant.rollInitiative();
          break;
        case "set-initiative":
          const newInitiative = await this.promptForInitiative();
          if (newInitiative !== null) {
            await combat.updateEmbeddedDocuments('Combatant', [{ _id: combatant.id, initiative: newInitiative }]);
          }
          break;
        case "set-turn":
          await combat.update({ turn: combat.turns.indexOf(combatant) });
          break;
        case "toggle-visibility":
          await combatant.token.update({ hidden: !combatant.token.hidden });
          break;
        case "toggle-defeated":
          await combatant.update({ defeated: !combatant.defeated });
          break;
        case "set-disposition":
          await combatant.token.update({ disposition: disposition });
          break;
      }
  
      dialog.slideUp(() => dialog.remove());
      this.updateMiniCombatTracker($("#tcb-mini-combat-tracker"));
    });
  
    $(document).one("click", () => dialog.slideUp(() => dialog.remove()));
  
    if (!existingDialog.length) {
      dialog.slideDown();
    } else {
      dialog.show();
    }
  }
  
  
  
  
  
  
  
  
  
  
  static async promptForInitiative() {
    return new Promise((resolve) => {
      new Dialog({
        title: game.i18n.localize("TRINIUMCB.SetInitiative"),
        content: `<div><label>${game.i18n.localize("TRINIUMCB.SetInitiative")}: <input type="number" id="initiative-value" name="initiative-value"></label></div>`,
        buttons: {
          ok: {
            label: "OK",
            callback: (html) => {
              const value = parseInt(html.find("#initiative-value").val());
              resolve(isNaN(value) ? null : value);
            }
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve(null)
          }
        },
        default: "ok"
      }).render(true);
    });
  }  
  

  static scrollToActiveCombatant(combatTracker) {
    const activeCombatant = combatTracker.find(
      ".tcb-combatant-mini.tcb-active"
    );
    if (activeCombatant.length) {
      const container = combatTracker.find(".tcb-combatants-mini");
      const scrollPosition =
        activeCombatant.position().left +
        container.scrollLeft() -
        container.width() / 2 +
        activeCombatant.width() / 2;
      container.scrollLeft(scrollPosition);
      this.log("Scrolled to active combatant.");
    }
  }

  static log(...args) {
    if (game.settings.get("trinium-chat-buttons", "debug")) {
      console.log("TriniumChatButtonsCombatTracker |", ...args);
    }
  }
}

export function init() {
  TriniumChatButtonsCombatTracker.init();
}
