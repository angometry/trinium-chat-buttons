# Trinium Chat Buttons

[![Latest Release](https://img.shields.io/github/v/release/thedarktongo/trinium-chat-buttons)](https://github.com/thedarktongo/trinium-chat-buttons/releases/latest)
[![License](https://img.shields.io/github/license/thedarktongo/trinium-chat-buttons)](https://github.com/thedarktongo/trinium-chat-buttons/blob/main/LICENSE)

Trinium Chat Buttons is a Foundry VTT module that adds several new buttons below the chat.

## Features

- **Roll Privacy Buttons**: Switch between different roll types (Public Roll, GM Roll, Self Roll, Blind Roll) using buttons instead of a dropdown.
- **MIDI QOL Buttons**: Toggle MIDI QOL features on and off as if you held down one of its keybindings. Requires [Midi QOL](https://gitlab.com/tposney/midi-qol).
- **Combat Tracker**: Show a mini horizontal combat tracker integrated into the chat controls for quick and easy combat management.

#### GM View

The GM in the following screnshot rolls privately, automatically rolls fast forwarded with advantage through midi QOL and has a nice view of the combat tracker right above the chat!

![GM Buttons](https://github.com/TheDarkTongo/trinium-chat-buttons/blob/main/media/examples/buttons-GM.png)

#### Player View (Collapsed Midi)
This player on the other hand rolls publicly, doesn't need Midi Buttons and, if they want, they can open up the combat tracker or roll initiative right from the chat tab!

![Player Buttons No Midi](https://github.com/TheDarkTongo/trinium-chat-buttons/blob/main/media/examples/buttons-player-nomidi.png)

## Usage

### Roll Privacy Buttons

These roll privacy buttons replace the traditional dropdown menu for selecting the roll mode, reducing necessary clicks to 1. Efficient!

### MIDI QOL Buttons

If [Midi QOL](https://gitlab.com/tposney/midi-qol) is active, additional buttons will appear for:
- Fast Forward all rolls
- Auto Roll/Fast Forward rolls
- Advantage
- Disadvantage

#### Polling Power
Look, no (mouse) hands! If polling is enabled in the settings, Buttons automatically update to show you which Midi modifier key you're holding.
Or, if you prefer, you can always toggle them on until disabled by clicking.
![Midi Polling](https://github.com/TheDarkTongo/trinium-chat-buttons/blob/main/media/examples/buttons-midi-polling.gif)

**Note:** The toggle affects the same variables as Midi: Holding Midi keybindings and then releasing them will turn off the button. This will be especially noticeable with Advantage and Disadvantage as their default keys are often pressed for other reasons (CTRL and LeftAlt)

### Combat Tracker

A mini combat tracker is available within the chat controls, providing a compact view of the combat status directly in the chat interface.

#### GM View
Convenient, concise, compact combat. This GM is one click away from an overview of the current encounter and a button to roll initiative quickly.

![Combat Tracker GM](https://github.com/TheDarkTongo/trinium-chat-buttons/blob/main/media/examples/combat-tracker-gm.gif)

#### Features

- **Combatant List:** Displays all active combatants with their initiative, name, image, and health.
- **Health Bar:** Visual representation of combatant's health with color indicating health status.
- **Disposition Colors:** Background colors to indicate if a combatant is an ally (green), enemy (red), neutral (yellow) or secret (purple). 
- **Defeated Status:** Visual indication (strikethrough and red background) for defeated combatants.
- **Masking:**
    - **Names:** All NPC names are set to "Creature" for non-GM players.
    - **Hidden NPCs:** Tokens set to invisible have a grey background for GM players and are hidden to non-GM players.
    - **Health:** Players can't see NPC Health and Healthbar. Can be configured in settings.
    - **Hide until turn:** Before combat and on the first round, players can't see NPCs who haven't acted yet.

#### GM and Player View
While the GM on the left sees everything, the *Hidden* Zombie, ceature names and health values are hidden to the player. Yes, it also has a glowing End Turn button!

![Combat Tracker GM and Player View](https://github.com/TheDarkTongo/trinium-chat-buttons/blob/main/media/examples/combat-tracker-gm-player-view.gif)

#### Shortcuts
- **Click Combatant:** Select token.
- **Double Click Combatant:** Open character sheet.
- **Right Click Combatant**:
  - Clear Initiative
  - Reroll Initiative
  - Set Initiative
  - Set Turn to this Combatant
  - Toggle Token Visibility
  - Toggle Defeated Status
  - Change Disposition (Neutral, Friendly, Enemy, Secret)

#### Right-click menu.
All it takes is one right-click to get all the quick actions the GM might want on their combatants!

![Combat Tracker context menu](https://github.com/TheDarkTongo/trinium-chat-buttons/blob/main/media/examples/combat-tracker-menu.gif)

#### Additional Buttons next to the Mini Tracker
- **GM: Roll all NPC initiatives** 
- **GM: Select all player tokens. Doubleclick to select all NPCs** 
- **GM: Pick one selected token at random. If none selected, pick a random player** 
- **Player: Find and select my token**
- **Player: Own initiative roller**

### Additional CSS Changes

Additional changes that improve readability of the sidebar can be enabled in the module settings.

## Support

If you encounter any issues or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/thedarktongo/trinium-chat-buttons/issues).

## Contributing

Contributions are welcome and appreciated! Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

The roll privacy buttons are Inspired by [DF Chat Enhancements](https://github.com/flamewave000/dragonflagon-fvtt/tree/master/df-chat-enhance).

Special thanks to Tim Posney for creating [Midi QOL](https://gitlab.com/tposney/midi-qol).
