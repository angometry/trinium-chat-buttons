// Define constants for each GM Screen Tab Content
export const GM_SCREEN_TAB1_CONTENT = `
<div>
    <h2>Name Generators</h2>
    <h3>Humans</h3>
    Alia, Bran, Caius, Dara, Evan, Fiona, Gideon, Hanna, Ian, Julia, Kurt, Lara, Max, Nora, Oliver, Petra, Quinn, Rosa, Seth, Tina,
    <h3>Elves</h3>
    Aerin, Belenor, Caranthir, Daenys, Elenwe, Finrod, Galadriel, Haldir, Idrial, Jorah, Kaelthas, Legolas, Mirelen, Nimrodel, Oropher, Phaeron, Quel'dorei, Rian, Silvan, Tauriel,
    <h3>Dwarves</h3>
    Dain, Eberk, Fargrim, Gloin, Harbek, Ironfist, Jorin, Kili, Lorin, Morgran, Nain, Oin, Ponto, Quorlinn, Rurik, Sigrun, Thorin, Ulfgar, Vondal, Wulfgar,
    <h3>Halflings</h3>
    Lidda, Milo, Podo, Caramip, Doder, Eglantine, Fosco, Griffo, Heribald, Isolde, Jago, Kodo, Largo, Minto, Norbo, Polo, Quince, Rollo, Sapphira, Togo,
    <h3>Dragonborn</h3>
    Arjhan, Balasar, Kriv, Daar, Enkoodabaoo, Ghesh, Heskan, Irhtos, Jax, Kava, Medrash, Nala, Othokent, Perra, Razaan, Sora, Thava, Uadjit, Vrondiss, Wulx,
    <h3>Taverns</h3>
    The Gilded Rose, The Drunken Dwarf, The Last Drop, The Silver Eel, The Rusty Dragon, The Salty Dog, The Wandering Minstrel, The Prancing Pony, The Sly Fox, The Laughing Giant, The Hungry Ogre, The Golden Griffin, The Red Dragon, The Velvet Curtain, The Black Pearl, The Copper Kettle, The Blue Moon, The Jolly Roger, The Royal Oak, The Blind Beggar,
    <h3>Villain Groups</h3>
    The Black Network, The Crimson Hand, The Frozen Hearts, The Shadow Thieves, The Iron Circle, The Dark Enclave, The Night Masks, The Red Wizards, The Emerald Claw, The Lords of Dust, The Cult of the Dragon, The Sable Company, The Guild of Shadows, The Syndicate, The Broken Chain, The Circle of the Phoenix, The Ebon Triad, The Ivory Tower, The Sons of Liberty, The Twilight Guard,
    <h3>Small Towns</h3>
    Willowdale, Oakhaven, Briarwood, Greendale, Rivermoot, Foxglove, Pinecrest, Eldenwood, Whitebridge, Mistvale, Dawndale, Silverstream, Thistletop, Brindle, Goldshore, Stonelake, Fallcrest, Lakeshire, Brightwater, Moonstair,
    <h3>Locations</h3>
    Crystal Caverns, Darkwood Forest, Misty Isles, The Howling Hills, Thunder Peaks, Silent Sands, Shimmering Shores, Starfall Lake, Frozen Wastes, Crimson Valley, Whispering Woods, Stormy Cape, Sunken City, Glimmering Plains, Eternal Swamp, Hidden Temple, Broken Ridge, Golden Sands, Lost Ruins, Haunted Moor,
</div>
`;

export const GM_SCREEN_TAB2_CONTENT = `
<div>
    <h2>Reference Tables</h2>
    <h3>Task Difficulty DCs</h3>
    <table>
        <tr><th>Difficulty</th><th>DC</th></tr>
        <tr><td>Very Easy</td><td>5</td></tr>
        <tr><td>Easy</td><td>10</td></tr>
        <tr><td>Medium</td><td>15</td></tr>
        <tr><td>Hard</td><td>20</td></tr>
        <tr><td>Very Hard</td><td>25</td></tr>
        <tr><td>Nearly Impossible</td><td>30</td></tr>
    </table>
    <h3>Healing Potions</h3>
    <table>
        <tr><th>Type</th><th>Heal</th></tr>
        <tr><td>Potion of Healing</td><td>2d4+2</td></tr>
        <tr><td>Greater Healing</td><td>4d4+4</td></tr>
        <tr><td>Superior Healing</td><td>8d4+8</td></tr>
        <tr><td>Supreme Healing</td><td>10d4+20</td></tr>
    </table>
    <h3>Magic Item Cost</h3>
    <table>
        <tr><th>Item Rarity</th><th>Cost</th></tr>
        <tr><td>Common</td><td>50-100 gp</td></tr>
        <tr><td>Uncommon</td><td>101-500 gp</td></tr>
        <tr><td>Rare</td><td>501-5,000 gp</td></tr>
        <tr><td>Very Rare</td><td>5,001-50,000 gp</td></tr>
        <tr><td>Legendary</td><td>50,001+ gp</td></tr>
    </table>
</div>
`;

export const GM_SCREEN_TAB3_CONTENT = `
<div>
    <h2>Conditions</h2>
    <h5>Blinded</h5>
    Can't see, fails any ability check requiring sight, attack rolls against have advantage, and the creature's attack rolls have disadvantage.
    <h5>Charmed</h5>
    Can't attack the charmer, charmer has advantage on social interaction checks.
    <h5>Deafened</h5>
    Can't hear, automatically fails any ability check requiring hearing.
    <h5>Frightened</h5>
    Disadvantage on ability checks and attack rolls while the source of fear is in line of sight, can't willingly move closer to the source.
    <h5>Grappled</h5>
    Speed becomes 0, ends if grappler is incapacitated or moved away.
    <h5>Incapacitated</h5>
    Can't take actions or reactions.
    <h5>Paralyzed</h5>
    Incapacitated, can't move or speak, fails Strength and Dexterity saving throws, attack rolls against have advantage, any attack that hits is a critical hit if within 5 feet.
    <h5>Petrified</h5>
    Transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone).
    <h5>Exhaustion</h5>
    Level 1: Disadvantage on ability checks, Level 2: Speed halved, Level 3: Disadvantage on attack rolls and saving throws, Level 4: Hit point maximum halved, Level 5: Speed reduced to 0, Level 6: Death.
</div>
`;

export const GM_SCREEN_TAB4_CONTENT = `
<div>
    <h2>Combat and Travel</h2>
    <h3>Actions in Combat</h3>
    <table>
        <tr><th>Action</th><th>Description</th></tr>
        <tr><td>Attack</td><td>Make a weapon attack.</td></tr>
        <tr><td>Cast a Spell</td><td>Cast one of your spells.</td></tr>
        <tr><td>Disengage</td><td>Move without provoking opportunity attacks.</td></tr>
        <tr><td>Dodge</td><td>Make all attacks against you have disadvantage.</td></tr>
    </table>
    <h3>Cover</h3>
<table>
    <tr><th>Type</th><th>Benefit</th></tr>
    <tr><td>Half Cover</td><td>+2 bonus to AC and Dexterity saving throws</td></tr>
    <tr><td>Three-Quarters Cover</td><td>+5 bonus to AC and Dexterity saving throws</td></tr>
    <tr><td>Total Cover</td><td>Cannot be directly targeted by attacks or spells</td></tr>
</table>
<h3>Exhaustion</h3>
<table>
    <tr><th>Level</th><th>Effect</th></tr>
    <tr><td>1</td><td>Disadvantage on ability checks</td></tr>
    <tr><td>2</td><td>Speed halved</td></tr>
    <tr><td>3</td><td>Disadvantage on attack rolls and saving throws</td></tr>
    <tr><td>4</td><td>Hit point maximum halved</td></tr>
    <tr><td>5</td><td>Speed reduced to 0</td></tr>
    <tr><td>6</td><td>Death</td></tr>
</table>
<h3>Travel</h3>
<table>
    <tr><th>Pace</th><th>Speed (mph)</th><th>Effect</th></tr>
    <tr><td>Fast</td><td>4</td><td>-5 penalty to passive Wisdom (Perception)</td></tr>
    <tr><td>Normal</td><td>3</td><td>None</td></tr>
    <tr><td>Slow</td><td>2</td><td>Can use stealth</td></tr>
</table>
</div>
`;