var WEAPONS = {
    rusty_sword: { id: "rusty_sword", name: "Rusty Sword", icon: "🗡️", damage: 4, type: "sword", value: 10, description: "Barely holds an edge." },
    gnarled_staff: { id: "gnarled_staff", name: "Gnarled Staff", icon: "🪄", damage: 3, type: "staff", value: 10, stats: { intelligence: 2 }, description: "Channels magic adequately." },
    worn_daggers: { id: "worn_daggers", name: "Worn Daggers", icon: "🔪", damage: 3, type: "dagger", value: 10, stats: { agility: 2 }, description: "Quick but dull." },
    iron_sword: { id: "iron_sword", name: "Iron Sword", icon: "⚔️", damage: 8, type: "sword", value: 50, description: "A reliable blade." },
    steel_sword: { id: "steel_sword", name: "Steel Sword", icon: "⚔️", damage: 12, type: "sword", value: 120, description: "Well-forged steel." },
    battle_axe: { id: "battle_axe", name: "Battle Axe", icon: "🪓", damage: 15, type: "axe", value: 150, stats: { strength: 2 }, description: "Heavy and brutal." },
    oak_staff: { id: "oak_staff", name: "Oak Staff", icon: "🪄", damage: 6, type: "staff", value: 80, stats: { intelligence: 4 }, description: "Solid magical conduit." },
    crystal_staff: { id: "crystal_staff", name: "Crystal Staff", icon: "🔮", damage: 10, type: "staff", value: 200, stats: { intelligence: 6, luck: 2 }, description: "Amplifies arcane energy." },
    shadow_daggers: { id: "shadow_daggers", name: "Shadow Daggers", icon: "🗡️", damage: 9, type: "dagger", value: 140, stats: { agility: 4, luck: 2 }, description: "Seem to drink the light." },
    moonblade: { id: "moonblade", name: "Moonblade", icon: "🌙", damage: 18, type: "sword", value: 500, stats: { agility: 3, luck: 3 }, description: "Forged in moonlight.", special: { critBonus: 0.1 } },
    flamberge: { id: "flamberge", name: "Flamberge", icon: "🔥", damage: 22, type: "sword", value: 600, stats: { strength: 4 }, description: "The wavy blade catches fire.", special: { fireDamage: 5 } },

    // Cursed weapons
    bloodthirst: { id: "bloodthirst", name: "Bloodthirst", icon: "🩸", damage: 25, type: "sword", value: 0, cursed: true, stats: { strength: 5 },
        description: "It drinks deep. Always thirsty.", curse: { name: "Blood Price", effect: "lose_health_on_kill", value: 5, description: "Lose 5 HP after each kill." } },
    soul_drinker: { id: "soul_drinker", name: "Soul Drinker", icon: "👻", damage: 20, type: "dagger", value: 0, cursed: true, stats: { agility: 6, intelligence: -3 },
        description: "Whispers promises of power.", curse: { name: "Soul Tax", effect: "xp_drain", value: 0.1, description: "10% XP consumed by blade." } },
    the_consuming: { id: "the_consuming", name: "The Consuming", icon: "🕳️", damage: 35, type: "axe", value: 0, cursed: true, stats: { strength: 8, vitality: -4 },
        description: "It eats everything.", curse: { name: "Endless Hunger", effect: "gold_drain", value: 5, description: "Lose 5 gold per combat." } },
    whispers_edge: { id: "whispers_edge", name: "Whisper's Edge", icon: "👁️", damage: 28, type: "sword", value: 0, cursed: true, stats: { intelligence: 8, luck: -5 },
        description: "Tells secrets you wish you never knew.", curse: { name: "Maddening Whispers", effect: "confusion", description: "Occasionally causes confusion." } },
    griefs_burden: { id: "griefs_burden", name: "Grief's Burden", icon: "💔", damage: 30, type: "hammer", value: 0, cursed: true, stats: { strength: 10, agility: -6 },
        description: "Weight of a thousand sorrows.", curse: { name: "Weight of Sorrow", effect: "slow", description: "Always act last. Cannot flee." } },
    famine: { id: "famine", name: "Famine", icon: "💀", damage: 32, type: "scythe", value: 0, cursed: true, stats: { strength: 6, intelligence: 6 },
        description: "One of the Four.", curse: { name: "Starving", effect: "no_healing", value: 0.5, description: "Healing 50% less effective." }, legendary: true }
};

var WEAPON_ENHANCEMENTS = {
    sharpened: { id: "sharpened", name: "Sharpened", tier: 1, cost: 50, materials: ["whetstone"], bonus: { damage: 2 } },
    reinforced: { id: "reinforced", name: "Reinforced", tier: 1, cost: 60, materials: ["iron_ingot"], bonus: { damage: 1, durability: 20 } },
    flaming: { id: "flaming", name: "Flaming", tier: 2, cost: 200, materials: ["fire_essence", "ruby"], bonus: { damage: 3, fireDamage: 5 } },
    frost: { id: "frost", name: "Frost", tier: 2, cost: 200, materials: ["ice_essence", "sapphire"], bonus: { damage: 3, slowChance: 0.2 } },
    vampiric: { id: "vampiric", name: "Vampiric", tier: 2, cost: 300, materials: ["blood_essence", "dark_gem"], bonus: { damage: 2, lifesteal: 0.1 } },
    vorpal: { id: "vorpal", name: "Vorpal", tier: 3, cost: 500, materials: ["void_crystal", "moonstone"], bonus: { damage: 5, critBonus: 0.15 } },
    holy: { id: "holy", name: "Holy", tier: 3, cost: 600, materials: ["blessed_water", "divine_essence"], bonus: { damage: 4, bonusVsUndead: 15 } },
    godslayer: { id: "godslayer", name: "Godslayer", tier: 4, cost: 2000, materials: ["divine_scale", "void_heart", "star_metal"], bonus: { damage: 10, bonusVsBosses: 25 } }
};

var CLASS_EQUIPMENT = {
    warrior: { weapon: "rusty_sword", armor: "leather_armor", items: ["health_potion", "health_potion"] },
    mage: { weapon: "gnarled_staff", armor: "cloth_robes", items: ["health_potion", "mana_potion"] },
    rogue: { weapon: "worn_daggers", armor: "leather_armor", items: ["health_potion", "throwing_knife"] }
};
