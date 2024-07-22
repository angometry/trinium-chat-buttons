export const GM_SCREEN_PRESETS = {
  nameGenerators: {
    name: 'Name Generators',
    content: `
**Name Generators**
### Humans
Alia, Bran, Caius, Dara, Evan, Fiona, Gideon, Hanna, Ian, Julia, Kurt, Lara, Max, Nora, Oliver, Petra, Quinn, Rosa, Seth, Tina,
### Elves
Aerin, Belenor, Caranthir, Daenys, Elenwe, Finrod, Galadriel, Haldir, Idrial, Jorah, Kaelthas, Legolas, Mirelen, Nimrodel, Oropher, Phaeron, Quel'dorei, Rian, Silvan, Tauriel,
### Dwarves
Dain, Eberk, Fargrim, Gloin, Harbek, Ironfist, Jorin, Kili, Lorin, Morgran, Nain, Oin, Ponto, Quorlinn, Rurik, Sigrun, Thorin, Ulfgar, Vondal, Wulfgar,
### Halflings
Lidda, Milo, Podo, Caramip, Doder, Eglantine, Fosco, Griffo, Heribald, Isolde, Jago, Kodo, Largo, Minto, Norbo, Polo, Quince, Rollo, Sapphira, Togo,
### Dragonborn
Arjhan, Balasar, Kriv, Daar, Enkoodabaoo, Ghesh, Heskan, Irhtos, Jax, Kava, Medrash, Nala, Othokent, Perra, Razaan, Sora, Thava, Uadjit, Vrondiss, Wulx,
### Taverns
The Gilded Rose, The Drunken Dwarf, The Last Drop, The Silver Eel, The Rusty Dragon, The Salty Dog, The Wandering Minstrel, The Prancing Pony, The Sly Fox, The Laughing Giant, The Hungry Ogre, The Golden Griffin, The Red Dragon, The Velvet Curtain, The Black Pearl, The Copper Kettle, The Blue Moon, The Jolly Roger, The Royal Oak, The Blind Beggar,
### Villain Groups
The Black Network, The Crimson Hand, The Frozen Hearts, The Shadow Thieves, The Iron Circle, The Dark Enclave, The Night Masks, The Red Wizards, The Emerald Claw, The Lords of Dust, The Cult of the Dragon, The Sable Company, The Guild of Shadows, The Syndicate, The Broken Chain, The Circle of the Phoenix, The Ebon Triad, The Ivory Tower, The Sons of Liberty, The Twilight Guard,
### Small Towns
Willowdale, Oakhaven, Briarwood, Greendale, Rivermoot, Foxglove, Pinecrest, Eldenwood, Whitebridge, Mistvale, Dawndale, Silverstream, Thistletop, Brindle, Goldshore, Stonelake, Fallcrest, Lakeshire, Brightwater, Moonstair,
### Locations
Crystal Caverns, Darkwood Forest, Misty Isles, The Howling Hills, Thunder Peaks, Silent Sands, Shimmering Shores, Starfall Lake, Frozen Wastes, Crimson Valley, Whispering Woods, Stormy Cape, Sunken City, Glimmering Plains, Eternal Swamp, Hidden Temple, Broken Ridge, Golden Sands, Lost Ruins, Haunted Moor,
`,
  },
  dnd5eConditions: {
    name: 'DnD 5e conditions cheatsheet',
    content: `
**Conditions**
##### Blinded
Can't see, fails any ability check requiring sight, attack rolls against have advantage, and the creature's attack rolls have disadvantage.
##### Charmed
Can't attack the charmer, charmer has advantage on social interaction checks.
##### Deafened
Can't hear, automatically fails any ability check requiring hearing.
##### Frightened
Disadvantage on ability checks and attack rolls while the source of fear is in line of sight, can't willingly move closer to the source.
##### Grappled
Speed becomes 0, ends if grappler is incapacitated or moved away.
##### Incapacitated
Can't take actions or reactions.
##### Paralyzed
Incapacitated, can't move or speak, fails Strength and Dexterity saving throws, attack rolls against have advantage, any attack that hits is a critical hit if within 5 feet.
##### Petrified
Transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone).
##### Exhaustion
Level 1: Disadvantage on ability checks, Level 2: Speed halved, Level 3: Disadvantage on attack rolls and saving throws, Level 4: Hit point maximum halved, Level 5: Speed reduced to 0, Level 6: Death.
`,
  },
  dnd5eActionsInCombat: {
    name: 'DnD5e Actions in Combat',
    content: `
### Actions in Combat
| Action         | Description                        |
|----------------|------------------------------------|
| Attack         | Make a weapon attack.              |
| Cast a Spell   | Cast one of your spells.           |
| Disengage      | Move without provoking opportunity attacks. |
| Dodge          | Make all attacks against you have disadvantage. |

### Cover
| Type               | Benefit                                     |
|--------------------|---------------------------------------------|
| Half Cover         | +2 bonus to AC and Dexterity saving throws  |
| Three-Quarters Cover | +5 bonus to AC and Dexterity saving throws |
| Total Cover        | Cannot be directly targeted by attacks or spells |
`,
  },
  dnd5eMagicItems: {
    name: 'DnD5e Healing Potions and Magic Items',
    content: `
### Healing Potions
| Type               | Heal      |
|--------------------|-----------|
| Potion of Healing  | 2d4+2     |
| Greater Healing    | 4d4+4     |
| Superior Healing   | 8d4+8     |
| Supreme Healing    | 10d4+20   |

### Magic Item Cost
| Item Rarity  | Cost           |
|--------------|----------------|
| Common       | 50-100 gp      |
| Uncommon     | 101-500 gp     |
| Rare         | 501-5,000 gp   |
| Very Rare    | 5,001-50,000 gp|
| Legendary    | 50,001+ gp     |
`,
  },
  dnd5eTaskDifficulty: {
    name: 'DnD5e Task Difficulty',
    content: `**Reference Tables**
### Task Difficulty DCs
| Difficulty         | DC  |
|--------------------|-----|
| Very Easy          | 5   |
| Easy               | 10  |
| Medium             | 15  |
| Hard               | 20  |
| Very Hard          | 25  |
| Nearly Impossible  | 30  |`,
  },
  dnd5eExhaustionTravel: {
    name: 'DnD5e Exhaustion and travel',
    content: `
  ### Exhaustion
| Level  | Effect                                     |
|--------|--------------------------------------------|
| 1      | Disadvantage on ability checks             |
| 2      | Speed halved                               |
| 3      | Disadvantage on attack rolls and saving throws |
| 4      | Hit point maximum halved                   |
| 5      | Speed reduced to 0                         |
| 6      | Death                                      |

### Travel
| Pace   | Speed (mph) | Effect                                |
|--------|-------------|---------------------------------------|
| Fast   | 4           | -5 penalty to passive Wisdom (Perception) |
| Normal | 3           | None                                  |
| Slow   | 2           | Can use stealth                       |
  `,
  },
};
