var FISH = {
    river_trout: { id: "river_trout", name: "River Trout", icon: "🐟", rarity: "common", value: 8, description: "A staple catch." },
    mudfish: { id: "mudfish", name: "Mudfish", icon: "🐟", rarity: "common", value: 5, description: "Ugly but edible." },
    silver_minnow: { id: "silver_minnow", name: "Silver Minnow", icon: "🐟", rarity: "common", value: 6, description: "Small and shiny." },
    pond_bass: { id: "pond_bass", name: "Pond Bass", icon: "🐟", rarity: "common", value: 10, description: "Puts up a fight." },
    crayfish: { id: "crayfish", name: "Crayfish", icon: "🦞", rarity: "common", value: 7, description: "Not technically a fish." },
    golden_carp: { id: "golden_carp", name: "Golden Carp", icon: "🐠", rarity: "uncommon", value: 25, description: "Scales gleam like coins." },
    shadow_trout: { id: "shadow_trout", name: "Shadow Trout", icon: "🐟", rarity: "uncommon", value: 30, description: "Only visible in darkness." },
    crystal_perch: { id: "crystal_perch", name: "Crystal Perch", icon: "🐠", rarity: "uncommon", value: 28, description: "Partially transparent." },
    moon_bass: { id: "moon_bass", name: "Moon Bass", icon: "🐟", rarity: "uncommon", value: 35, description: "Glows faintly at night." },
    ghost_pike: { id: "ghost_pike", name: "Ghost Pike", icon: "👻", rarity: "rare", value: 75, description: "Phases in and out of reality." },
    void_eel: { id: "void_eel", name: "Void Eel", icon: "🐍", rarity: "rare", value: 85, description: "From somewhere else." },
    starlight_salmon: { id: "starlight_salmon", name: "Starlight Salmon", icon: "✨", rarity: "rare", value: 90, description: "Contains actual starlight." },
    blood_koi: { id: "blood_koi", name: "Blood Koi", icon: "🔴", rarity: "rare", value: 80, description: "Beautiful and unsettling." },
    the_lurker: { id: "the_lurker", name: "The Lurker", icon: "🐊", rarity: "legendary", value: 500, description: "Ancient predator.", combat: "the_lurker_fish" },
    the_old_one: { id: "the_old_one", name: "The Old One", icon: "🐙", rarity: "legendary", value: 1000, description: "Older than the lake.", combat: "the_old_one_fish" },
    drowned_god_fish: { id: "drowned_god_fish", name: "The Drowned God", icon: "💀", rarity: "legendary", value: 2000, description: "A fallen deity.", combat: "drowned_god" }
};

var FISHING_LOCATIONS = {
    millbrook_pond: { id: "millbrook_pond", name: "Millbrook Pond", description: "A peaceful pond. Good for beginners.",
        fish: ["river_trout", "mudfish", "silver_minnow", "pond_bass", "crayfish", "golden_carp"],
        rarityWeights: { common: 70, uncommon: 25, rare: 4, legendary: 1 }, catchRate: 0.7, unlocked: true },
    dark_river: { id: "dark_river", name: "The Dark River", description: "Black waters. Strange things swim here.",
        fish: ["shadow_trout", "mudfish", "crystal_perch", "ghost_pike", "void_eel", "the_lurker"],
        rarityWeights: { common: 50, uncommon: 35, rare: 12, legendary: 3 }, catchRate: 0.55, unlocked: true },
    crystal_lake: { id: "crystal_lake", name: "Crystal Lake", description: "Sacred waters touched by magic.",
        fish: ["crystal_perch", "moon_bass", "starlight_salmon", "blood_koi", "the_old_one"],
        rarityWeights: { common: 40, uncommon: 40, rare: 17, legendary: 3 }, catchRate: 0.5, unlocked: false },
    abyssal_depths: { id: "abyssal_depths", name: "The Abyssal Depths", description: "No light reaches here.",
        fish: ["void_eel", "ghost_pike", "blood_koi", "drowned_god_fish"],
        rarityWeights: { common: 20, uncommon: 40, rare: 35, legendary: 5 }, catchRate: 0.4, unlocked: false }
};

var FISHING_EQUIPMENT = {
    basic_rod: { id: "basic_rod", name: "Basic Rod", bonus: 0, description: "A simple rod." },
    sturdy_rod: { id: "sturdy_rod", name: "Sturdy Rod", bonus: 1, description: "Better construction." },
    master_rod: { id: "master_rod", name: "Master Rod", bonus: 2, description: "Expert craftsmanship." },
    legendary_rod: { id: "legendary_rod", name: "Rod of the Depths", bonus: 4, description: "Whispers to the fish." },
    quality_bait: { id: "quality_bait", name: "Quality Bait", bonus: 1, consumable: true },
    rare_bait: { id: "rare_bait", name: "Glowing Bait", bonus: 2, consumable: true }
};

var FISHING_TOURNAMENTS = {
    millbrook_contest: { id: "millbrook_contest", name: "Millbrook Fishing Contest", location: "millbrook_pond", entryFee: 25,
        targetFish: ["golden_carp", "pond_bass"], targetCount: 3, timeLimit: 5, rewards: { gold: 100, xp: 50, item: "sturdy_rod" } },
    dark_river_challenge: { id: "dark_river_challenge", name: "Dark River Challenge", location: "dark_river", entryFee: 75,
        targetFish: ["shadow_trout", "ghost_pike"], targetCount: 2, timeLimit: 4, rewards: { gold: 300, xp: 150, item: "master_rod" } }
};
