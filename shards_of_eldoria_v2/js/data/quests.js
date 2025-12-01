var QUESTS = {
    main_awakening: {
        id: "main_awakening",
        title: "The Awakening",
        type: "main",
        act: 1,
        description: "You awaken in darkness with fragmented memories. Find out who you are.",
        objectives: [
            { id: "wake_up", text: "Regain consciousness", completed: false },
            { id: "find_village", text: "Find civilization", completed: false }
        ],
        rewards: { xp: 50, gold: 0 },
        nextQuest: "main_village_flames"
    },
    main_village_flames: {
        id: "main_village_flames",
        title: "Village in Flames",
        type: "main",
        act: 1,
        description: "Millbrook burns. Goblins have attacked. Save who you can.",
        objectives: [
            { id: "reach_village", text: "Reach the burning village", completed: false },
            { id: "speak_elder", text: "Find Elder Mira", completed: false },
            { id: "defeat_goblins", text: "Defeat the goblin raiders", completed: false }
        ],
        rewards: { xp: 100, gold: 50 },
        nextQuest: "main_chieftain"
    },
    main_chieftain: {
        id: "main_chieftain",
        title: "The Chieftain",
        type: "main",
        act: 1,
        description: "The goblin chieftain must be stopped before more villages burn.",
        objectives: [
            { id: "find_lair", text: "Locate the goblin lair", completed: false },
            { id: "defeat_chieftain", text: "Defeat Grimjaw the Chieftain", completed: false }
        ],
        rewards: { xp: 250, gold: 100 }
    },
    side_wolf_hunt: {
        id: "side_wolf_hunt",
        title: "Wolf Hunt",
        type: "side",
        description: "Wolves have been attacking travelers. Thin their numbers.",
        objectives: [
            { id: "kill_wolves", text: "Kill 3 wolves (0/3)", completed: false, count: 0, target: 3 }
        ],
        rewards: { xp: 60, gold: 30 }
    },
    side_herb_gathering: {
        id: "side_herb_gathering",
        title: "Healing Herbs",
        type: "side",
        description: "The village healer needs herbs from the forest.",
        objectives: [
            { id: "gather_herbs", text: "Gather forest herbs", completed: false }
        ],
        rewards: { xp: 30, gold: 20, items: ["health_potion", "health_potion"] }
    },
    side_lost_ring: {
        id: "side_lost_ring",
        title: "The Lost Ring",
        type: "side",
        description: "A widow lost her wedding ring near the old mill.",
        objectives: [
            { id: "find_ring", text: "Search near the old mill", completed: false },
            { id: "return_ring", text: "Return the ring", completed: false }
        ],
        rewards: { xp: 40, gold: 15, karma: 5 }
    }
};
