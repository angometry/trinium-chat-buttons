# Trinium Chat Buttons

[![Latest Release](https://img.shields.io/github/v/release/thedarktongo/trinium-chat-buttons)](https://github.com/thedarktongo/trinium-chat-buttons/releases/latest)
[![License](https://img.shields.io/github/license/thedarktongo/trinium-chat-buttons)](https://github.com/thedarktongo/trinium-chat-buttons/blob/main/LICENSE)

Trinium Chat Buttons is a Foundry VTT module that adds several new buttons below the chat.

## Features

- **Roll Type Buttons**: Switch between different roll types (Public Roll, GM Roll, Self Roll, Blind Roll) using buttons instead of a dropdown.
- **MIDI QOL Buttons**: Toggle MIDI QOL features on and off as if you held down one of its keybindings. Requires [Midi QOL](https://gitlab.com/tposney/midi-qol).
- **Combat Tracker**: Show a mini horizontal combat tracker integrated into the chat controls for quick and easy combat management.

## Usage

### Roll Type Buttons

The roll type buttons replace the traditional dropdown menu for selecting the roll mode, reducing necessary clicks to 1:
- Public Roll
- GM Roll
- Self Roll
- Blind Roll

### MIDI QOL Buttons

If [Midi QOL](https://gitlab.com/tposney/midi-qol) is active, additional buttons will appear for:
- Fast Forward all rolls
- Auto Roll/Fast Forward rolls
- Advantage
- Disadvantage

These buttons allow you to toggle these states as if you held the corresponding MIDI keybinding. If polling is enabled in the settings, buttons will also be automatically highlighted while you hold a Midi keybinding.

**Note:** The toggle affects the same variables as Midi: Holding Midi keybindings and then releasing them will turn off the button. This will be especially noticeable with Advantage and Disadvantage as their default keys are often pressed for other reasons (CTRL and LeftAlt)

### Combat Tracker

A mini combat tracker is available within the chat controls, providing a compact view of the combat status directly in the chat interface.

#### Features

- **Combatant List:** Displays all active combatants with their initiative, name, image, and health.
- **Health Bar:** Visual representation of combatant's health with color indicating health status.
- **Disposition Colors:** Background colors to indicate if a combatant is an ally (green), enemy (red), or neutral (yellow). 
- **Defeated Status:** Visual indication (strikethrough and red background) for defeated combatants.
- **NPC Name Masking:** Invisible NPCs are hidden and all NPC names are set to "Creature" for non-GM players.
- **Hidden NPCs:** Tokens set to invisible have a grey background for GM players and are hidden to non-GM players.

#### Shortcuts
- **Click Combatant:** Select token.
- **Double Click Combatant:** Open character sheet.

#### Additional Buttons
- **GM: Roll all NPC initiatives** 
- **GM: Select all players in scene** 
- **GM: Select random player in scene** 
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
