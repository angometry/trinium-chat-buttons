## Changelog

### v1.3.0

#### New Features
Mini Combat Tracker:
- You can now change initiative directly by clicking on the initiative value in the mini tracker
- GMs also have an End Combat button next to the other turn buttons (Yes, I initially forgot about that one.)
- Added ability to apply mini tracker styles to the main combat tracker. Can be toggled in settings.

#### Improvements
- Major refactor to improve mantainability and performance, especially with combat tracker updates and events.
- Initiative input is now quicker, cleaner and better looking, instead of using ugly foundry dialogs.
- Log level can now be configured in settings.
- Combatant options right-click menu no longer closes once a button within it is pressed
- Small CSS improvements

#### Bug Fixes
- Fixed specific token updates not updating the combat tracker.

### v1.2.1

Verified foundry v11 compatibility

### v1.2.0

#### New Features

Added new features to the combat tracker:
- Create combat button, only shown to GM if there is currently no combat.
- Start combat button, only shown to GM if combat hasn't started yet.
- Added Right-click menu on combatants in the combat tracker:
  - Clear Initiative
  - Reroll Initiative
  - Set Initiative
  - Set Turn to this Combatant
  - Toggle Token Visibility
  - Toggle Defeated Status
  - Change Disposition (Neutral, Friendly, Enemy, Secret)

Added new features to the buttons next to the combat tracker:
- Double clicking "Select All Player Tokens" will instead select all NPCs.
- Clicking the (previously) "Select Random Player Token" button while 2 or more tokens are selected will instead select one random token among the selected tokens.
- Added "Find Own Token" button for players.
- Buttons that select tokens now pan to them.

#### Improvements
- Added a setting to configure how much of an NPC's health is shown to the player. Nothing, only the healthbar or the nujmerical value too. Players' health value and bar are always shown.
- On round 1, players no longer see non-player combatants that haven't taken a turn yet.
- Refactored the janky mess the combat tracker class used to be.
- Added support for "Secret" token disposition.
- Improved CSS

#### Bug Fixes

- Fixed hidden status not being removed when the token is unhidden.
- Fixed some issues with combats that were in view and running, but not marked as active by foundry.
- Fixed defeated status sometimes not working.
- Fixed some combat tracker event handlers not being cleaned up correctly.

### v1.1.1

#### Improvements
- More desirable default settings
- Direct links to main branch in module.json

### v1.1.0

#### New Features

Added new features to the combat tracker:
- Dynamic Health bar
- Defeated status
- Double click to open character sheet
- End turn button for players
- Privacy features (hiding enemies, names and removing non-GM combat controls)

Added new buttons next to the combat tracker button:
- GM Buttons: Roll NPC initiative, select all player tokens, and select a random player token.
- Player Button: Self initiative roller.

#### Improvements
- New button styles
- Greatly improved combat tracker styles

#### Bug Fixes

- Fixed errors with invalid combatants (such as when the actor is deleted)
