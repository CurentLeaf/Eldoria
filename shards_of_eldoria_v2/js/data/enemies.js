var ENEMIES = {
    forest_wolf: {
        id: "forest_wolf",
        name: "Starving Wolf",
        icon: "🐺",
        level: 2,
        description: "Hunger has driven it to madness.",
        stats: {
            health: 30,
            maxHealth: 30,
            strength: 6,
            defense: 1,
            agility: 7
        },
        xpReward: 20,
        goldReward: { min: 2, max: 8 },
        loot: [{ id: "bread", chance: 0.3 }]
    },
    goblin_scout: {
        id: "goblin_scout",
        name: "Goblin Scout",
        icon: "👺",
        level: 2,
        description: "Small, cowardly, dangerous in groups.",
        stats: {
            health: 25,
            maxHealth: 25,
            strength: 5,
            defense: 1,
            agility: 6
        },
        xpReward: 18,
        goldReward: { min: 5, max: 15 },
        loot: [{ id: "health_potion", chance: 0.2 }]
    },
    goblin_warrior: {
        id: "goblin_warrior",
        name: "Goblin Warrior",
        icon: "👹",
        level: 4,
        description: "Armored and angry.",
        stats: {
            health: 50,
            maxHealth: 50,
            strength: 8,
            defense: 4,
            agility: 4
        },
        xpReward: 40,
        goldReward: { min: 10, max: 25 },
        loot: [{ id: "health_potion", chance: 0.4 }]
    },
    corrupted_treant: {
        id: "corrupted_treant",
        name: "Corrupted Treant",
        icon: "🌳",
        level: 6,
        description: "An ancient tree twisted by dark magic.",
        stats: {
            health: 100,
            maxHealth: 100,
            strength: 12,
            defense: 8,
            agility: 2
        },
        xpReward: 80,
        goldReward: { min: 20, max: 40 },
        loot: []
    },
    shadow_assassin: {
        id: "shadow_assassin",
        name: "Shadow Assassin",
        icon: "🥷",
        level: 8,
        description: "A killer who moves through darkness.",
        stats: {
            health: 60,
            maxHealth: 60,
            strength: 15,
            defense: 3,
            agility: 12
        },
        xpReward: 100,
        goldReward: { min: 30, max: 60 },
        loot: [{ id: "shadow_dagger", chance: 0.1 }]
    },
    goblin_chieftain: {
        id: "goblin_chieftain",
        name: "Grimjaw the Chieftain",
        icon: "👑",
        level: 8,
        description: "The tyrant of the goblin tribes.",
        stats: {
            health: 200,
            maxHealth: 200,
            strength: 14,
            defense: 8,
            agility: 5
        },
        xpReward: 300,
        goldReward: { min: 100, max: 150 },
        loot: [{ id: "soldier_sword", chance: 0.5 }],
        isBoss: true,
        phases: [
            { threshold: 0.6, message: "Grimjaw roars with fury!" },
            { threshold: 0.3, message: "Grimjaw enters a blood rage!" }
        ]
    },
    the_hollow_knight: {
        id: "the_hollow_knight",
        name: "The Hollow Knight",
        icon: "⚔️",
        level: 15,
        description: "An empty suit of armor animated by pure malice.",
        stats: {
            health: 500,
            maxHealth: 500,
            strength: 25,
            defense: 20,
            agility: 6
        },
        xpReward: 800,
        goldReward: { min: 200, max: 300 },
        loot: [{ id: "bloodmourne", chance: 0.2 }],
        isBoss: true
    }
};

var DEATH_MESSAGES = [
    "Your vision fades to black. The darkness claims another soul.",
    "Blood pools beneath you. Your story ends here.",
    "The pain stops. Everything stops. Perhaps this is peace.",
    "Death comes not as an enemy, but as a release from suffering.",
    "Your last breath escapes. The world continues without you."
];
