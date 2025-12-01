var ITEMS = {
    health_potion: {
        id: "health_potion",
        name: "Health Potion",
        type: "consumable",
        icon: "🧪",
        description: "Restores 30 HP",
        effect: { heal: 30 },
        value: 15,
        stackable: true
    },
    greater_health_potion: {
        id: "greater_health_potion",
        name: "Greater Health Potion",
        type: "consumable",
        icon: "💉",
        description: "Restores 75 HP",
        effect: { heal: 75 },
        value: 40,
        stackable: true
    },
    bread: {
        id: "bread",
        name: "Stale Bread",
        type: "consumable",
        icon: "🍞",
        description: "Restores 8 HP",
        effect: { heal: 8 },
        value: 3,
        stackable: true
    },
    antidote: {
        id: "antidote",
        name: "Antidote",
        type: "consumable",
        icon: "💊",
        description: "Cures poison",
        effect: { cure: "poison" },
        value: 20,
        stackable: true
    },
    leather_armor: {
        id: "leather_armor",
        name: "Leather Armor",
        type: "armor",
        icon: "🥋",
        description: "Basic protection",
        stats: { defense: 3 },
        value: 25
    },
    mage_robes: {
        id: "mage_robes",
        name: "Mage Robes",
        type: "armor",
        icon: "🧥",
        description: "Enchanted fabric",
        stats: { defense: 2, intelligence: 3 },
        value: 40
    },
    shadow_cloak: {
        id: "shadow_cloak",
        name: "Shadow Cloak",
        type: "armor",
        icon: "🦇",
        description: "Woven from darkness",
        stats: { defense: 4, agility: 3 },
        value: 60
    },
    iron_armor: {
        id: "iron_armor",
        name: "Iron Armor",
        type: "armor",
        icon: "🛡️",
        description: "Solid protection",
        stats: { defense: 8, agility: -2 },
        value: 100
    }
};

var CLASS_EQUIPMENT = {
    warrior: {
        weapon: "rusty_sword",
        armor: "leather_armor",
        items: ["health_potion", "health_potion", "bread"]
    },
    mage: {
        weapon: "wooden_staff",
        armor: "mage_robes",
        items: ["health_potion", "health_potion"]
    },
    rogue: {
        weapon: "hunting_knife",
        armor: "shadow_cloak",
        items: ["health_potion", "bread", "bread"]
    }
};

var SHOP_INVENTORIES = {
    millbrook: {
        id: "millbrook",
        name: "Millbrook General Store",
        items: [
            { id: "health_potion", price: 20 },
            { id: "greater_health_potion", price: 50 },
            { id: "bread", price: 5 },
            { id: "antidote", price: 25 },
            { id: "leather_armor", price: 30 },
            { id: "soldier_sword", price: 75 }
        ]
    }
};
