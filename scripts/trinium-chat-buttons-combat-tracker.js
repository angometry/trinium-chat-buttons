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

    if (!this.initialized) {
      this.addCombatTrackerButton();
      const combatTracker = this.createMiniCombatTracker();

      chatControls.parent().prepend(combatTracker);

      this.addEventListeners();
      this.initialized = true;
    }
  }

  static addCombatTrackerButton() {
    const combatTrackerVisibility = game.settings.get(
      "trinium-chat-buttons",
      "combatTrackerButtonVisibility"
    );
    const isGM = game.user.isGM;

    const showCombatTrackerButtons =
      combatTrackerVisibility === "everyone" ||
      (combatTrackerVisibility === "players" && !isGM) ||
      (combatTrackerVisibility === "gm" && isGM);

      if (showCombatTrackerButtons) {
        const combatTrackerButton = $(`<button class="tcb-button" id="tcb-combat-tracker-toggle" title="${game.i18n.localize(
          "TRINIUMCB.ToggleCombatTracker"
        )}">
          <i class="fas fa-fist-raised"></i>
          ${game.i18n.localize("TRINIUMCB.MiniTracker")}
        </button>`);

      const controlIcons = $(
        '<div id="tcb-control-icons" class="tcb-button-row"></div>'
      );

      if (isGM) {
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
        `);
        controlIcons.css("width", "20%");
        combatTrackerButton.css("width", "80%");
      }

      const buttonGroup = $(
        '<div id="tcb-combat-tracker-button-groups" class="tcb-button-row"></div>'
      );
      buttonGroup.append(combatTrackerButton);
      buttonGroup.append(controlIcons);

      $("#chat-controls").parent().prepend(buttonGroup);

      combatTrackerButton.on("click", async () => {
        await this.toggleCombatTracker();
      });

      this.addControlIconListeners();
    }
  }

  static addControlIconListeners() {
    $("#tcb-roll-npc-initiative").on("click", async () => {
      const combat = game.combats.active;
      if (combat) {
        await combat.rollNPC();
        this.log("Rolled NPC initiative.");
      }
    });

    $("#tcb-select-all-player-tokens").on("click", () => {
      canvas.tokens.releaseAll();
      const tokens = canvas.tokens.placeables.filter(
        (t) => t.actor?.hasPlayerOwner
      );
      tokens.forEach((t) => t.control({ releaseOthers: false }));
      this.log("Selected all player tokens.");
    });

    $("#tcb-select-random-player-token").on("click", () => {
      canvas.tokens.releaseAll();
      const tokens = canvas.tokens.placeables.filter(
        (t) => t.actor?.hasPlayerOwner
      );
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      if (randomToken) {
        randomToken.control({ releaseOthers: true });
        this.log("Selected a random player token.");
      }
    });

    $("#tcb-roll-player-initiative").on("click", async () => {
      const combat = game.combats.active;
      if (combat) {
        const combatant = combat.getCombatantsByActor(game.user.character.id)[0];
        if (combatant && combatant.actor && combatant.token.isOwner) {
          await combat.rollInitiative([combatant.id]);
          this.log("Rolled initiative for player.");
        }
      }
    });
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

  static createMiniCombatTracker() {
    const combatTracker = $(
      '<div id="tcb-mini-combat-tracker" class="tcb-button-row"></div>'
    );
    this.updateMiniCombatTracker(combatTracker);

    return combatTracker;
  }

  static updateMiniCombatTracker(combatTracker) {
    const isGM = game.user.isGM;
    const combat = game.combats.active;
    if (combat && combat.turns.length > 0) {
      const combatants = combat
        .setupTurns()
        .map((c) => {
          const isDefeated = c.defeated;
          const isHidden = c.token.hidden;
          const hpPercent = c.actor ? c.actor.system.attributes.hp.value / c.actor.system.attributes.hp.max : 0;

          let classes = `${c.id === combat.combatant?.id ? "tcb-active" : ""} ${
            isDefeated ? "tcb-defeated" : ""
          } ${c.token.disposition === -1 ? "enemy" : c.token.disposition === 1 ? "ally" : "neutral"}`;

          if (!isGM && isHidden) classes += " hidden";
          if (isGM && isHidden) classes += " hiddenGM";
          if (!c.actor || !c.actor.hasPlayerOwner) classes += " hidden-health";

          const displayName = !isGM && (!c.actor || !c.actor.hasPlayerOwner) ? "Creature" : c.name;
          const displayHP = isGM && c.actor ? `${c.actor.system.attributes.hp.value} / ${c.actor.system.attributes.hp.max}` : "";

          const hpColor = `rgba(${Math.round(255 - (hpPercent * 200))}, ${Math.round(hpPercent * 200)}, 0, 1)`;

          return `
          <div class="tcb-combatant-mini ${classes}" data-combatant-id="${c.id}" data-token-id="${c.token.id}">
            <div class="tcb-combatant-mini-initiative">${c.initiative !== null ? c.initiative : "-"}</div>
            <div class="tcb-combatant-mini-name">${displayName}</div>
            <img src="${c.img}" alt="${c.name}" class="tcb-combatant-mini-img">
            <div class="tcb-combatant-mini-health">
              <div class="tcb-combatant-mini-health-bar" style="width: ${hpPercent * 100}%; background-color: ${hpColor};"></div>
              <div class="tcb-combatant-mini-health-text">${displayHP}</div>
            </div>
          </div>
        `;
        })
        .join("");

      let controls = "";

      if (isGM) {
        controls = `
          <div class="tcb-combat-controls-mini">
            <button data-control="previousRound" title="${game.i18n.localize(
              "TRINIUMCB.PreviousRound"
            )}"><i class="fas fa-step-backward"></i></button>
            <button data-control="previousTurn" title="${game.i18n.localize(
              "TRINIUMCB.PreviousTurn"
            )}"><i class="fas fa-arrow-left"></i></button>
            <button data-control="nextTurn" title="${game.i18n.localize(
              "TRINIUMCB.NextTurn"
            )}"><i class="fas fa-arrow-right"></i></button>
            <button data-control="nextRound" title="${game.i18n.localize(
              "TRINIUMCB.NextRound"
            )}"><i class="fas fa-step-forward"></i></button>
          </div>
        `;
      } else if (combat.combatant?.token?.isOwner) {
        controls = `
          <div class="tcb-combat-controls-mini">
            <button data-control="endTurn" title="${game.i18n.localize(
              "TRINIUMCB.EndTurn"
            )}" class="end-turn-button"><i class="fas fa-hourglass-end"></i>${game.i18n.localize("TRINIUMCB.EndTurn")}</button>
          </div>
        `;
      }

      combatTracker.html(`
        <div class="tcb-combatants-mini">${combatants}</div>
        ${controls}
      `);

      this.addCombatTrackerEventListeners();
      this.scrollToActiveCombatant(combatTracker);
      this.log("Updated mini combat tracker.");
    } else {
      combatTracker.html(`
        <div class="tcb-combatants-mini">${game.i18n.localize("TRINIUMCB.NoCombat")}</div>
      `);
      this.log("No combat active or no turns available.");
    }
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
        const combatant = combat.turns.find(c => c.id === combatantId);
        if (combatant && combatant.actor?.sheet) {
          combatant.actor.sheet.render(true);
        }
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
