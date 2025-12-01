var ITEMS = {
    // Consumables
    health_potion: { id: "health_potion", name: "Health Potion", icon: "🧪", type: "consumable", stackable: true, value: 25, effect: { heal: 30 }, description: "Restores 30 HP." },
    greater_health_potion: { id: "greater_health_potion", name: "Greater Health Potion", icon: "🧪", type: "consumable", stackable: true, value: 60, effect: { heal: 75 }, description: "Restores 75 HP." },
    superior_health_potion: { id: "superior_health_potion", name: "Superior Health Potion", icon: "💉", type: "consumable", stackable: true, value: 150, effect: { heal: 150 }, description: "Restores 150 HP." },
    mana_potion: { id: "mana_potion", name: "Mana Potion", icon: "💙", type: "consumable", stackable: true, value: 30, effect: { mana: 30 }, description: "Restores 30 MP." },
    antidote: { id: "antidote", name: "Antidote", icon: "💚", type: "consumable", stackable: true, value: 20, effect: { cure: "poison" }, description: "Cures poison." },
    remove_curse_scroll: { id: "remove_curse_scroll", name: "Remove Curse Scroll", icon: "📜", type: "consumable", stackable: true, value: 300, effect: { removeCurse: true }, description: "Removes a cursed item." },
    throwing_knife: { id: "throwing_knife", name: "Throwing Knife", icon: "🗡️", type: "consumable", stackable: true, value: 15, effect: { damage: 15 }, description: "Deals 15 damage." },
    bomb: { id: "bomb", name: "Bomb", icon: "💣", type: "consumable", stackable: true, value: 50, effect: { damage: 40, aoe: true }, description: "Hits all enemies." },
    smoke_bomb: { id: "smoke_bomb", name: "Smoke Bomb", icon: "💨", type: "consumable", stackable: true, value: 35, effect: { escape: true }, description: "Guaranteed escape." },
    strength_elixir: { id: "strength_elixir", name: "Strength Elixir", icon: "💪", type: "consumable", stackable: true, value: 75, effect: { buff: { strength: 5 }, duration: 3 }, description: "+5 STR for 3 combats." },
    luck_charm: { id: "luck_charm", name: "Luck Charm", icon: "🍀", type: "consumable", stackable: true, value: 100, effect: { buff: { luck: 10 }, duration: 5 }, description: "+10 LUCK for 5 combats." },

    // Armor
    cloth_robes: { id: "cloth_robes", name: "Cloth Robes", icon: "👘", type: "armor", slot: "armor", value: 30, stats: { defense: 2, intelligence: 2 }, description: "Lightweight magical attire." },
    leather_armor: { id: "leather_armor", name: "Leather Armor", icon: "🦺", type: "armor", slot: "armor", value: 50, stats: { defense: 5 }, description: "Basic protection." },
    chainmail: { id: "chainmail", name: "Chainmail", icon: "⛓️", type: "armor", slot: "armor", value: 150, stats: { defense: 10, agility: -1 }, description: "Interlocking metal rings." },
    plate_armor: { id: "plate_armor", name: "Plate Armor", icon: "🛡️", type: "armor", slot: "armor", value: 400, stats: { defense: 20, agility: -3 }, description: "Heavy but protective." },
    shadow_cloak: { id: "shadow_cloak", name: "Shadow Cloak", icon: "🌑", type: "armor", slot: "armor", value: 300, stats: { defense: 8, agility: 4 }, description: "Made of woven shadows." },
    mage_robes: { id: "mage_robes", name: "Archmage Robes", icon: "🧙", type: "armor", slot: "armor", value: 350, stats: { defense: 5, intelligence: 8 }, description: "Enhances magical ability." },

    // Accessories
    iron_ring: { id: "iron_ring", name: "Iron Ring", icon: "💍", type: "accessory", slot: "accessory", value: 40, stats: { strength: 2 }, description: "Simple but effective." },
    amulet_of_vitality: { id: "amulet_of_vitality", name: "Amulet of Vitality", icon: "📿", type: "accessory", slot: "accessory", value: 200, stats: { maxHealth: 25, vitality: 3 }, description: "Pulses with life energy." },
    thieves_gloves: { id: "thieves_gloves", name: "Thieves Gloves", icon: "🧤", type: "accessory", slot: "accessory", value: 180, stats: { agility: 4, luck: 2 }, description: "For legitimate purposes." },
    scholars_spectacles: { id: "scholars_spectacles", name: "Scholars Spectacles", icon: "👓", type: "accessory", slot: "accessory", value: 220, stats: { intelligence: 5 }, description: "Enhances perception." },
    lucky_coin: { id: "lucky_coin", name: "Lucky Coin", icon: "🪙", type: "accessory", slot: "accessory", value: 150, stats: { luck: 5 }, description: "Always lands right." },

    // Materials
    whetstone: { id: "whetstone", name: "Whetstone", icon: "🪨", type: "material", stackable: true, value: 15, description: "For sharpening." },
    iron_ingot: { id: "iron_ingot", name: "Iron Ingot", icon: "🔩", type: "material", stackable: true, value: 25, description: "Refined iron." },
    fire_essence: { id: "fire_essence", name: "Fire Essence", icon: "🔥", type: "material", stackable: true, value: 75, description: "Captured flame." },
    ice_essence: { id: "ice_essence", name: "Ice Essence", icon: "❄️", type: "material", stackable: true, value: 75, description: "Frozen forever." },
    blood_essence: { id: "blood_essence", name: "Blood Essence", icon: "🩸", type: "material", stackable: true, value: 100, description: "Life force distilled." },
    void_crystal: { id: "void_crystal", name: "Void Crystal", icon: "💎", type: "material", stackable: true, value: 200, description: "Contains nothing valuable." },
    divine_scale: { id: "divine_scale", name: "Divine Scale", icon: "✨", type: "material", stackable: true, value: 500, description: "Fell from something holy." },

    // Quest/Trophy
    elder_pendant: { id: "elder_pendant", name: "Elder's Pendant", icon: "📿", type: "quest", value: 0, description: "Resonates with the Shards." },
    lurker_scale: { id: "lurker_scale", name: "Lurker Scale", icon: "🐊", type: "trophy", value: 200, description: "Proof of The Lurker." },
    old_one_eye: { id: "old_one_eye", name: "Eye of the Old One", icon: "👁️", type: "trophy", value: 500, stats: { intelligence: 3, luck: 3 }, description: "Still watches." },

    // Fishing
    sturdy_rod: { id: "sturdy_rod", name: "Sturdy Rod", icon: "🎣", type: "fishing_rod", value: 50, fishingBonus: 1, description: "Better than basic." },
    master_rod: { id: "master_rod", name: "Master Rod", icon: "🎣", type: "fishing_rod", value: 150, fishingBonus: 2, description: "Expert craftsmanship." },
    quality_bait: { id: "quality_bait", name: "Quality Bait", icon: "🪱", type: "bait", stackable: true, value: 15, fishingBonus: 1, description: "Attracts better fish." },
    rare_bait: { id: "rare_bait", name: "Glowing Bait", icon: "✨", type: "bait", stackable: true, value: 50, fishingBonus: 2, description: "Irresistible to rare fish." }
};

var SHOP_INVENTORIES = {
    millbrook: { name: "Millbrook General Store", items: [
        { id: "health_potion", price: 25 }, { id: "greater_health_potion", price: 60 }, { id: "antidote", price: 20 },
        { id: "throwing_knife", price: 15 }, { id: "iron_sword", price: 50 }, { id: "leather_armor", price: 50 },
        { id: "iron_ring", price: 40 }, { id: "whetstone", price: 15 }, { id: "quality_bait", price: 15 }
    ]},
    blacksmith: { name: "Borin's Forge", items: [
        { id: "steel_sword", price: 120 }, { id: "battle_axe", price: 150 }, { id: "chainmail", price: 150 },
        { id: "plate_armor", price: 400 }, { id: "iron_ingot", price: 25 }
    ]},
    magic_shop: { name: "Seraphina's Curios", items: [
        { id: "oak_staff", price: 80 }, { id: "crystal_staff", price: 200 }, { id: "mana_potion", price: 30 },
        { id: "mage_robes", price: 350 }, { id: "scholars_spectacles", price: 220 }, { id: "remove_curse_scroll", price: 300 }
    ]},
    shadow_market: { name: "The Shadow Market", items: [
        { id: "shadow_daggers", price: 140 }, { id: "shadow_cloak", price: 300 }, { id: "thieves_gloves", price: 180 },
        { id: "smoke_bomb", price: 35 }, { id: "bomb", price: 50 }, { id: "lucky_coin", price: 150 }
    ]}
};

var DEATH_MESSAGES = [
    "Darkness claims you...", "Your story ends here. Or does it?", "The void embraces you.",
    "You fall. The world fades.", "Death takes you, but death is not the end.", "Your blood stains the earth.",
    "The last thing you see is your enemy's smile.", "Blackness. Then... something else."
];
