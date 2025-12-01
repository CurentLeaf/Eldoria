var GAMBLING_GAMES = {
    liars_dice: { id: "liars_dice", name: "Liar's Dice", icon: "🎲", minBet: 10, maxBet: 500,
        description: "Bluff your way to victory or be caught in a lie.",
        rules: "Both players roll dice secretly. Bid on the total of a face value. Call 'liar' or raise the bid." },
    fates_hand: { id: "fates_hand", name: "Fate's Hand", icon: "🃏", minBet: 20, maxBet: 1000,
        description: "A card game where 21 is salvation, 22 is damnation.",
        rules: "Draw cards to reach 21 without going over. Dealer draws after you stand." },
    wheel_of_misfortune: { id: "wheel_of_misfortune", name: "Wheel of Misfortune", icon: "🎡", minBet: 50, maxBet: 200,
        description: "Spin the wheel. Most outcomes are bad. Some are worse.",
        rules: "Spin and pray. The wheel decides your fate." },
    death_dealer: { id: "death_dealer", name: "Death Dealer", icon: "💀", minBet: 100, maxBet: 5000,
        description: "High stakes. Literal life and death.",
        rules: "Draw a card. Higher card wins. Tie means you both take damage." },
    knucklebones: { id: "knucklebones", name: "Knucklebones", icon: "🦴", minBet: 5, maxBet: 100,
        description: "An ancient game of skill and luck.",
        rules: "Roll bones into your grid. Match patterns to score." }
};

var GAMBLING_LOCATIONS = {
    millbrook_tavern: { id: "millbrook_tavern", name: "The Burned Boot Tavern", description: "Desperate people gambling their last coins.",
        games: ["liars_dice", "fates_hand", "wheel_of_misfortune"], atmosphere: "desperate", cheatDifficulty: 8 },
    shadow_den: { id: "shadow_den", name: "The Shadow Den", description: "Where the serious gamblers play.",
        games: ["liars_dice", "fates_hand", "death_dealer", "knucklebones"], atmosphere: "dangerous", cheatDifficulty: 12 },
    bone_pit: { id: "bone_pit", name: "The Bone Pit", description: "Orc gambling den. They respect boldness.",
        games: ["knucklebones", "death_dealer"], atmosphere: "brutal", cheatDifficulty: 15, unlocked: false }
};

var WHEEL_SEGMENTS = [
    { label: "💰 JACKPOT!", type: "win", multiplier: 5, weight: 1 },
    { label: "💰 Big Win", type: "win", multiplier: 3, weight: 3 },
    { label: "💰 Win", type: "win", multiplier: 2, weight: 8 },
    { label: "🔄 Push", type: "push", multiplier: 1, weight: 10 },
    { label: "💸 Lose", type: "lose", multiplier: 0, weight: 20 },
    { label: "💸 Lose Big", type: "lose", multiplier: -1, weight: 10 },
    { label: "🍺 Free Drink", type: "special", effect: "heal", value: 10, weight: 8 },
    { label: "🎁 Mystery Prize", type: "special", effect: "random_item", weight: 5 },
    { label: "☠️ CURSED", type: "curse", effect: "curse", weight: 3 },
    { label: "⚔️ BAR FIGHT", type: "combat", enemy: "drunk_patron", weight: 5 },
    { label: "🎰 SPIN AGAIN", type: "spin_again", weight: 7 },
    { label: "💀 DEATH", type: "death", damage: 50, weight: 1 }
];

var GAMBLING_NPCS = {
    honest_tom: { id: "honest_tom", name: "Honest Tom", location: "millbrook_tavern", personality: "nervous",
        dialogue: { win: "Ha! Lucky...", lose: "Better luck next time!", cheat_caught: "HEY! I saw that!" }, cheatSkill: 5, wealth: 200 },
    sly_silva: { id: "sly_silva", name: "Sly Silva", location: "shadow_den", personality: "cunning",
        dialogue: { win: "Impressive.", lose: "The house always wins.", cheat_caught: "Guards!" }, cheatSkill: 12, wealth: 2000 },
    grimgor: { id: "grimgor", name: "Grimgor the Orc", location: "bone_pit", personality: "aggressive",
        dialogue: { win: "GOOD GAME HUMAN!", lose: "GRIMGOR WINS!", cheat_caught: "GRIMGOR CRUSH CHEATER!" }, cheatSkill: 8, wealth: 500 },
    madame_fortune: { id: "madame_fortune", name: "Madame Fortune", location: "millbrook_tavern", personality: "mysterious",
        dialogue: { spin: "The wheel knows all...", jackpot: "Fate smiles upon you!", curse: "The wheel has spoken..." }, isWheelOperator: true }
};

var ADDICTION_EFFECTS = {
    thresholds: [500, 2000, 5000, 10000],
    effects: [
        { name: "Casual Gambler", description: "No effects.", modifier: 0 },
        { name: "Regular", description: "-5% shop prices.", modifier: { shopDiscount: 0.05 } },
        { name: "Hooked", description: "Occasional urge to gamble.", modifier: { gamblingUrge: 0.1 } },
        { name: "Addict", description: "Strong urges. -10% all stats when not gambling.", modifier: { statPenalty: 0.1, gamblingUrge: 0.3 } },
        { name: "Lost Soul", description: "Cannot leave gambling locations easily.", modifier: { trapped: true, statPenalty: 0.2 } }
    ]
};
