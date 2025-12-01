var WEAPONS = {
    rusty_sword: {
        id: "rusty_sword",
        name: "Rusty Sword",
        type: "SWORD",
        icon: "🗡️",
        damage: 5,
        rarity: "COMMON",
        description: "A blade caked in rust and old blood.",
        stats: { strength: 1 }
    },
    wooden_staff: {
        id: "wooden_staff",
        name: "Gnarled Staff",
        type: "STAFF",
        icon: "🪄",
        damage: 4,
        rarity: "COMMON",
        description: "A twisted branch humming with power.",
        stats: { intelligence: 3 }
    },
    hunting_knife: {
        id: "hunting_knife",
        name: "Hunting Knife",
        type: "DAGGER",
        icon: "🔪",
        damage: 3,
        rarity: "COMMON",
        description: "Sharp and quick.",
        stats: { agility: 2 }
    },
    soldier_sword: {
        id: "soldier_sword",
        name: "Soldier Blade",
        type: "SWORD",
        icon: "⚔️",
        damage: 9,
        rarity: "UNCOMMON",
        description: "Standard military issue.",
        value: 50
    },
    bloodmourne: {
        id: "bloodmourne",
        name: "Bloodmourne",
        type: "SWORD",
        icon: "🩸",
        damage: 18,
        rarity: "LEGENDARY",
        description: "A cursed blade that hungers for blood.",
        curse: { type: "bloodthirst", severity: 2 },
        value: 500
    },
    shadow_dagger: {
        id: "shadow_dagger",
        name: "Shadow Fang",
        type: "DAGGER",
        icon: "🌑",
        damage: 12,
        rarity: "RARE",
        description: "Forged in darkness itself.",
        stats: { agility: 5, luck: 3 },
        value: 200
    },
    flame_staff: {
        id: "flame_staff",
        name: "Inferno Staff",
        type: "STAFF",
        icon: "🔥",
        damage: 14,
        rarity: "RARE",
        description: "Burns with eternal flame.",
        stats: { intelligence: 8 },
        value: 250
    }
};
