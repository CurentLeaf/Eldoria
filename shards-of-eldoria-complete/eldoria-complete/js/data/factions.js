var FACTIONS = {
    village_survivors: { id: "village_survivors", name: "Village Survivors", icon: "🏘️",
        description: "The people of Millbrook and other villages. They just want to survive.",
        reputation: 0, maxReputation: 100,
        ranks: [
            { threshold: -50, name: "Enemy", perks: [], description: "They fear and hate you." },
            { threshold: 0, name: "Stranger", perks: [], description: "They don't know you." },
            { threshold: 25, name: "Friend", perks: ["shop_discount_5"], description: "They trust you." },
            { threshold: 50, name: "Hero", perks: ["shop_discount_10", "free_rest"], description: "They revere you." },
            { threshold: 75, name: "Savior", perks: ["shop_discount_15", "free_rest", "backup_in_combat"], description: "They would die for you." }
        ],
        allies: ["elder_council"], enemies: ["cult_of_shattered"]
    },
    shadow_guild: { id: "shadow_guild", name: "The Shadow Guild", icon: "🗡️",
        description: "Assassins, thieves, and information brokers. Morality is expensive.",
        reputation: 0, maxReputation: 100,
        ranks: [
            { threshold: -50, name: "Marked", perks: [], description: "There's a price on your head." },
            { threshold: 0, name: "Unknown", perks: [], description: "They don't know you exist." },
            { threshold: 25, name: "Associate", perks: ["fence_access"], description: "You can do business." },
            { threshold: 50, name: "Member", perks: ["fence_access", "contracts"], description: "You're one of them." },
            { threshold: 75, name: "Shadow", perks: ["fence_access", "contracts", "assassination_immunity"], description: "Even the darkness fears you." }
        ],
        allies: [], enemies: ["village_survivors", "elder_council"]
    },
    cult_of_shattered: { id: "cult_of_shattered", name: "Cult of the Shattered God", icon: "💠",
        description: "Fanatics seeking to reunite the Shards and summon their dark deity.",
        reputation: 0, maxReputation: 100,
        ranks: [
            { threshold: -50, name: "Heretic", perks: [], description: "They hunt you relentlessly." },
            { threshold: 0, name: "Unbeliever", perks: [], description: "You are beneath notice." },
            { threshold: 25, name: "Curious", perks: ["cult_intel"], description: "They watch with interest." },
            { threshold: 50, name: "Initiate", perks: ["cult_intel", "dark_magic"], description: "You have taken the first steps." },
            { threshold: 75, name: "Chosen", perks: ["cult_intel", "dark_magic", "shard_resonance"], description: "The Shattered God whispers to you." }
        ],
        allies: [], enemies: ["village_survivors", "elder_council", "elven_council"]
    },
    elder_council: { id: "elder_council", name: "The Elder Council", icon: "📜",
        description: "Ancient order dedicated to protecting the world from the Shards.",
        reputation: 0, maxReputation: 100,
        ranks: [
            { threshold: -50, name: "Betrayer", perks: [], description: "You have broken sacred trust." },
            { threshold: 0, name: "Unknown", perks: [], description: "They are watching." },
            { threshold: 25, name: "Guardian Initiate", perks: ["shard_lore"], description: "You show promise." },
            { threshold: 50, name: "Guardian", perks: ["shard_lore", "elder_magic"], description: "You are one of the protectors." },
            { threshold: 75, name: "Elder Guardian", perks: ["shard_lore", "elder_magic", "council_seat"], description: "Your voice shapes the world." }
        ],
        allies: ["village_survivors"], enemies: ["cult_of_shattered", "shadow_guild"]
    }
};

var FACTION_PERKS = {
    shop_discount_5: { name: "5% Shop Discount", description: "All purchases cost 5% less.", effect: { shopDiscount: 0.05 } },
    shop_discount_10: { name: "10% Shop Discount", description: "All purchases cost 10% less.", effect: { shopDiscount: 0.10 } },
    shop_discount_15: { name: "15% Shop Discount", description: "All purchases cost 15% less.", effect: { shopDiscount: 0.15 } },
    free_rest: { name: "Free Rest", description: "Rest for free in allied territories.", effect: { freeRest: true } },
    backup_in_combat: { name: "Backup", description: "Chance for allies to join difficult fights.", effect: { combatBackup: 0.2 } },
    fence_access: { name: "Fence Access", description: "Sell stolen goods at full price.", effect: { fenceAccess: true } },
    contracts: { name: "Contracts", description: "Access to assassination and theft contracts.", effect: { contracts: true } },
    assassination_immunity: { name: "Assassination Immunity", description: "The Guild will not accept contracts on you.", effect: { assassinImmune: true } },
    cult_intel: { name: "Cult Intel", description: "Know where cultists are operating.", effect: { cultIntel: true } },
    dark_magic: { name: "Dark Magic", description: "Access to forbidden spells.", effect: { darkMagic: true } },
    shard_resonance: { name: "Shard Resonance", description: "Shards are easier to locate.", effect: { shardSense: true } },
    shard_lore: { name: "Shard Lore", description: "Detailed knowledge of Shard locations and history.", effect: { shardLore: true } },
    elder_magic: { name: "Elder Magic", description: "Access to ancient protective spells.", effect: { elderMagic: true } },
    council_seat: { name: "Council Seat", description: "Influence major world decisions.", effect: { councilSeat: true } }
};
