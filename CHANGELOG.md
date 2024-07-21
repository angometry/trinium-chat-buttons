## v1.5.0

### New Features

#### GM SCREEN

- The GM Screen now supports journal pages! Paste only the journal UUID into the editor and it'll be loaded in place of HTML/Markdown. Currently, only text and image pages are fully supported.
- The GM Screen now supports enrichers, both in Journal and HTML/Markdown form.
- Each Subscreen (Column) can now be split into up to 3 rows. Each row has its own tab selector.
- Each Subscreen (Column) can be set to a custom width, ignoring the Subscreen Width setting. (the first Subscreen is always on the left)

- The Tab editor now features a tab selector. It will warn you if you try to change tabs with unsaved changes.

### Improvements
- Subscreens are now called Columns, because we now have rows and Subscreen is a terrible name.
- The combat tracker now automatically opens for you when the page is loaded.

#### GM SCREEN
- The GM Screen now supports 10 tabs instead of 4. The tab selector has been changed to a floating dropdown to avoid cluttering the header.
- The Tab editor now shows the exact sizing of the Column you opened it from, including height, so you know exactly what's in view with no scrolling. It also informs you.
- More style improvements
- Localization improvements (Still only english)

### Bug fixes
- Fixes more GM Screen Sizing issues

### Known Issues
- There is currently no default content for tab 5 to 10. The "Restore Default" button will eventually will be replaced with a "Choose preset" button. You are welcome to submit content!
- Opening the GM screen for the first time is extremely laggy if journal pages with images are loaded. This only happens if the image has not been loaded before e.g. the actual journal.

### Planned features

- In the GM  screen, 

## v1.4.1

### New Features

- Added markdown support in the GM Screen through the [marked](https://github.com/markedjs/marked) library. HTML is still supported.
- Added a dedicated GM Screen editor with live preview on tab that respects your Subscreen width settings. GM Screen content can no longer be edited through the foundry settings.
- Added a settings window to configure the GM screen without going through foundry settings.

### Improvements

- The GM Screen is instantly rebuilt with the correct settings whenever you edit any of them.
- Added setting to expand the Bottom Mode GM Screen horizontally, ignoring Subscreen width.
- Minor GM screen style improvements

### Bug fixes
- Fixes rare GM Screen sizing issues. 

## v1.4.0

### Improvements
- Added Combat Tracker setting to remove the actual combat tracker and leave only turn controls.
- The right-click menu buttons in the combat tracker will now show the token's current disposition, visibility and defeated status.
- Added small indicator above the combatant targeted by the right-click menu.

### New Features: CUSTOMIZABLE GM SCREEN

REJOICE! The GM Screen button is now available!

- The GM Screen expands from the left or right as a sidebar, or the bottom as a screen.
- It has 4 different tabs, allowing you to switch between multiple sets of information.
- You can configure the content of each tab in the settings! The content supports HTML at this time
- Various other
  - Number of subscreens: Allows you to open a maximum of 4 different tabs at once. Default 1.
  - Side mode settings: Change subscreen width, in pixels.
  - Bottom mode settings: Change right and left margin and GM screen height as % of the entire canvas.

## v1.3.1

### Bug Fixes
- Fixed typo that caused some combatants to not be properly updated in the mini combat tracker
- Added missing string in en.json


## v1.3.0

### New Features
Mini Combat Tracker:
- You can now change initiative directly by clicking on the initiative value in the mini tracker
- GMs also have an End Combat button next to the other turn buttons (Yes, I initially forgot about that one.)
- Added ability to apply mini tracker styles to the main combat tracker. Can be toggled in settings.

### Improvements
- Major refactor to improve mantainability and performance, especially with combat tracker updates and events.
- Initiative input is now quicker, cleaner and better looking, instead of using ugly foundry dialogs.
- Log level can now be configured in settings.
- Combatant options right-click menu no longer closes once a button within it is pressed
- Small CSS improvements

### Bug Fixes
- Fixed specific token updates not updating the combat tracker.

## v1.2.1

Verified foundry v11 compatibility

## v1.2.0

### New Features

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

### Improvements
- Added a setting to configure how much of an NPC's health is shown to the player. Nothing, only the healthbar or the nujmerical value too. Players' health value and bar are always shown.
- On round 1, players no longer see non-player combatants that haven't taken a turn yet.
- Refactored the janky mess the combat tracker class used to be.
- Added support for "Secret" token disposition.
- Improved CSS

### Bug Fixes

- Fixed hidden status not being removed when the token is unhidden.
- Fixed some issues with combats that were in view and running, but not marked as active by foundry.
- Fixed defeated status sometimes not working.
- Fixed some combat tracker event handlers not being cleaned up correctly.

## v1.1.1

### Improvements
- More desirable default settings
- Direct links to main branch in module.json

## v1.1.0

### New Features

Added new features to the combat tracker:
- Dynamic Health bar
- Defeated status
- Double click to open character sheet
- End turn button for players
- Privacy features (hiding enemies, names and removing non-GM combat controls)

Added new buttons next to the combat tracker button:
- GM Buttons: Roll NPC initiative, select all player tokens, and select a random player token.
- Player Button: Self initiative roller.

### Improvements
- New button styles
- Greatly improved combat tracker styles

### Bug Fixes

- Fixed errors with invalid combatants (such as when the actor is deleted)
