var STORY = {
    opening: { id: "opening", title: "Awakening",
        text: "Darkness.\n\nThen pain—a throbbing ache behind your eyes, the taste of blood and dirt. Your fingers find cold stone beneath you.\n\nYou remember... nothing. Fragments. A village. Screaming. Fire against a midnight sky.\n\nYour body protests as you force yourself upright. You are in a forest clearing, ancient oaks looming like silent judges. The air smells of smoke.\n\nThrough the trees, you see an orange glow. Fire. The village burns.",
        choices: [
            { text: "Move toward the burning village", next: "approach_village" },
            { text: "Search your belongings first", next: "search_belongings" },
            { text: "Call out for help", next: "call_for_help" }
        ],
        effects: { quest_update: "main_awakening.wake_up" }
    },
    search_belongings: { id: "search_belongings", title: "Taking Stock",
        text: "Your pouch contains some gold coins. Around your neck hangs a pendant—a silver circle containing a blue gemstone that pulses with inner light.\n\nThe moment your fingers touch it, pain lances through your skull. Images flash: robed figures, dark rituals, impossible geometry.\n\nYou are a Guardian. The gem is one of five Shards of Eldoria. If reunited in wrong hands, the world ends.\n\nYou must protect it. At all costs.",
        choices: [{ text: "Head toward the village", next: "approach_village" }],
        effects: { flag: "shard_vision" }
    },
    call_for_help: { id: "call_for_help", title: "A Mistake",
        text: "Your voice echoes through the forest. For a moment, silence.\n\nThen rustling in the undergrowth. Yellow eyes gleam in the darkness. A starving wolf emerges, drawn by your cries.\n\nIt was hungry before. Now it has found prey.",
        choices: [{ text: "Fight the wolf!", combat: "forest_wolf", next: "after_wolf" }]
    },
    after_wolf: { id: "after_wolf", title: "Survival",
        text: "The wolf lies dead at your feet. Your hands shake—from fear or adrenaline, you cannot tell.\n\nThe glow of the burning village reminds you of more pressing concerns.",
        choices: [{ text: "Head to the village", next: "approach_village" }]
    },
    approach_village: { id: "approach_village", title: "The Burning Village",
        text: "The village of Millbrook burns before you. Half the structures are ablaze. Figures run through the chaos—villagers fleeing, and smaller shapes pursuing them. Goblins.\n\nAt the village center, an elderly woman stands defiant before a burning inn. She holds a gnarled staff, and despite her age, there is steel in her stance.\n\nA goblin scout spots you and charges!",
        choices: [{ text: "Fight the goblin!", combat: "goblin_scout", next: "after_first_goblin" }],
        effects: { quest_update: "main_village_flames.reach_village" }
    },
    after_first_goblin: { id: "after_first_goblin", title: "First Blood",
        text: "The goblin falls. More notice you. A larger one—a warrior in crude armor—steps forward.\n\n\"Fresh meat,\" it growls.\n\nThe elderly woman calls out: \"Survivor! Get to cover or fight your way through!\"",
        choices: [
            { text: "Fight the goblin warrior", combat: "goblin_warrior", next: "reach_elder" },
            { text: "Try to sneak around", check: { stat: "agility", dc: 8 }, next: "sneak_success", fail: "sneak_fail" }
        ]
    },
    sneak_success: { id: "sneak_success", title: "Shadow Movement",
        text: "You slip through the smoke like a ghost. The goblins never see you pass.\n\nYou reach the elderly woman, who eyes you with suspicion and hope.",
        choices: [{ text: "Continue", next: "reach_elder" }]
    },
    sneak_fail: { id: "sneak_fail", title: "Caught!",
        text: "A goblin spots you mid-sneak. It shrieks an alarm!\n\nNo choice now but to fight!",
        choices: [{ text: "Fight!", combat: "goblin_warrior", next: "reach_elder" }]
    },
    reach_elder: { id: "reach_elder", title: "Elder Mira",
        text: "The elderly woman lowers her staff as you approach.\n\n\"I am Mira,\" she says. \"Elder of Millbrook, or what remains of it.\"\n\nHer eyes drop to your chest—where the pendant rests. Her expression shifts.\n\n\"You carry a Shard. The goblins came for it. Their chieftain, Grimjaw—he serves something darker. You must stop him.\"",
        choices: [
            { text: "\"Where can I find this chieftain?\"", next: "chieftain_location" },
            { text: "\"What do you know about this shard?\"", next: "shard_info" },
            { text: "\"I need to prepare first\"", next: "prepare_first" }
        ],
        effects: { quest_update: "main_village_flames.speak_elder" }
    },
    chieftain_location: { id: "chieftain_location", title: "The Goblin Lair",
        text: "\"Grimjaw makes his lair in the old mines, north through the Dark Forest. But be warned—something has changed him. Made him stronger, crueler.\"\n\nShe presses a vial into your hands. \"A healing draught. You will need it.\"",
        choices: [
            { text: "Head to the goblin lair", next: "forest_path" },
            { text: "Explore the village first", next: "explore_village" }
        ],
        effects: { giveItem: "greater_health_potion", quest_start: "main_chieftain" }
    },
    shard_info: { id: "shard_info", title: "The Shards of Eldoria",
        text: "\"Long ago, a great power was sundered into five pieces—the Shards of Eldoria. Each contains immense magical energy. Together, they could reshape reality itself.\"\n\n\"Or destroy it. The Cult of the Shattered God seeks to reunite them for terrible purposes.\"\n\n\"You must be a Guardian—chosen to protect the shards.\"",
        choices: [
            { text: "\"Where is the goblin chieftain?\"", next: "chieftain_location" },
            { text: "\"I need to prepare first\"", next: "prepare_first" }
        ]
    },
    prepare_first: { id: "prepare_first", title: "Preparation",
        text: "\"Wise,\" Mira nods. \"The merchant shop still stands. Old Pete runs a fishing spot. The Burned Boot tavern has... entertainment.\"\n\n\"When ready, the path north leads through the Dark Forest to the goblin lair.\"",
        choices: [
            { text: "Go to the shop", next: "visit_shop" },
            { text: "Check out the tavern", next: "visit_tavern" },
            { text: "Go fishing", action: "open_fishing", location: "millbrook_pond" },
            { text: "Head to the forest immediately", next: "forest_path" }
        ]
    },
    explore_village: { id: "explore_village", title: "Millbrook Ruins",
        text: "You walk through the burning streets. Bodies lie in the dirt. A child cries somewhere.\n\nThe merchant's shop stands partially intact. Villagers huddle near the well.",
        choices: [
            { text: "Visit the shop", next: "visit_shop" },
            { text: "Help the wounded", next: "help_villagers" },
            { text: "Search for the crying child", next: "find_child" },
            { text: "Check the tavern", next: "visit_tavern" },
            { text: "Go fishing at the pond", action: "open_fishing", location: "millbrook_pond" },
            { text: "Head to the forest", next: "forest_path" }
        ]
    },
    visit_tavern: { id: "visit_tavern", title: "The Burned Boot Tavern",
        text: "Despite chaos outside, the Burned Boot stands. A nervous man shuffles cards.\n\n\"Name's Honest Tom. Care for a game? Might be our last night alive.\"\n\nMadame Fortune sits in another corner, her wheel spinning slowly.",
        choices: [
            { text: "Gamble with Honest Tom", action: "open_gambling", location: "millbrook_tavern" },
            { text: "Try Madame Fortune's Wheel", action: "open_wheel" },
            { text: "Leave", next: "explore_village" }
        ]
    },
    visit_shop: { id: "visit_shop", title: "The Merchant",
        text: "The merchant, a stout man with singed beard, looks up.\n\n\"Buying or selling? Either way, make it quick.\"",
        choices: [
            { text: "Browse wares (opens shop)", action: "open_shop" },
            { text: "Leave", next: "explore_village" }
        ]
    },
    help_villagers: { id: "help_villagers", title: "Tending the Wounded",
        text: "You help bandage wounds and carry the injured. An old man grasps your hand.\n\n\"Bless you, stranger.\" He presses coins into your palm.",
        choices: [{ text: "Continue", next: "explore_village" }],
        effects: { gold: 15, karma: 5 }
    },
    find_child: { id: "find_child", title: "The Lost Child",
        text: "You follow crying to a collapsed building. A young girl is trapped beneath a fallen beam.",
        choices: [
            { text: "Lift the beam (requires 7 STR)", check: { stat: "strength", dc: 7 }, next: "save_child", fail: "fail_save_child" },
            { text: "Look for something to use as leverage", next: "lever_solution" }
        ]
    },
    save_child: { id: "save_child", title: "Rescued",
        text: "With effort, you heave the beam aside. The girl scrambles free and hugs you.\n\nHer mother rushes over, pressing a pouch into your hands.",
        choices: [{ text: "Continue", next: "explore_village" }],
        effects: { giveItem: "health_potion", karma: 10 }
    },
    fail_save_child: { id: "fail_save_child", title: "Not Strong Enough",
        text: "You strain against the beam, but it won't budge. The fire spreads closer.\n\nYou look around frantically for another solution.",
        choices: [{ text: "Find a lever", next: "lever_solution" }]
    },
    lever_solution: { id: "lever_solution", title: "Clever Thinking",
        text: "You grab metal from debris and wedge it under the beam. Using stone as fulcrum, you lever it up just enough for the girl to crawl free.",
        choices: [{ text: "Continue", next: "explore_village" }],
        effects: { karma: 10 }
    },
    forest_path: { id: "forest_path", title: "The Dark Forest",
        text: "The path north leads into the Dark Forest. Trees grow thick, blocking moonlight. Strange sounds echo—animal calls that don't sound natural.\n\nYou notice a river running through. Dark water that might hold fish.",
        choices: [
            { text: "Press onward", next: "forest_encounter" },
            { text: "Fish in the dark river", action: "open_fishing", location: "dark_river" },
            { text: "Return to the village", next: "explore_village" }
        ]
    },
    forest_encounter: { id: "forest_encounter", title: "Ambush!",
        text: "Shapes detach from the shadows. Goblins—three of them.\n\n\"Kill the human!\" one shrieks. \"Take the shiny thing!\"\n\nThey know about the shard. This is no random attack.",
        choices: [{ text: "Fight!", combat: "goblin_scout", next: "after_ambush" }]
    },
    after_ambush: { id: "after_ambush", title: "Deeper In",
        text: "The goblins lie dead. You find a crude map on leather—showing the path to their lair.\n\nAfter hours, you see torchlight ahead. The goblin lair.",
        choices: [
            { text: "Approach carefully", next: "lair_entrance" },
            { text: "Rush in", next: "lair_rush" }
        ],
        effects: { quest_update: "main_chieftain.find_lair" }
    },
    lair_entrance: { id: "lair_entrance", title: "The Mine Entrance",
        text: "Two goblin guards stand watch. Beyond them, torchlight flickers. You hear drums and chanting. Something dark is happening.",
        choices: [
            { text: "Attack the guards", combat: "goblin_warrior", next: "inside_lair" },
            { text: "Try to sneak past", check: { stat: "agility", dc: 10 }, next: "sneak_lair", fail: "sneak_lair_fail" }
        ]
    },
    lair_rush: { id: "lair_rush", title: "Reckless Charge",
        text: "You charge toward the entrance. The guards see you coming and sound an alarm.",
        choices: [{ text: "Fight through!", combat: "goblin_warrior", next: "inside_lair_alert" }]
    },
    sneak_lair: { id: "sneak_lair", title: "Silent Entry",
        text: "You slip past the guards like a shadow, entering the mine undetected.\n\nThe tunnel twists downward. The chanting grows louder.",
        choices: [{ text: "Continue deeper", next: "inside_lair" }]
    },
    sneak_lair_fail: { id: "sneak_lair_fail", title: "Spotted!",
        text: "A loose stone betrays you. The guards whirl around.\n\n\"INTRUDER!\"",
        choices: [{ text: "Fight!", combat: "goblin_warrior", next: "inside_lair_alert" }]
    },
    inside_lair: { id: "inside_lair", title: "The Inner Sanctum",
        text: "The tunnel opens into a vast cavern. Dozens of goblins kneel around a raised platform. Upon it stands Grimjaw—the largest goblin you've ever seen.\n\nDark veins pulse beneath his skin. His eyes glow. In his hand, a crystal fragment pulses with your own shard.\n\n\"The final piece comes to me,\" Grimjaw growls. \"The Shattered God will be pleased.\"",
        choices: [{ text: "Face Grimjaw", next: "boss_fight" }]
    },
    inside_lair_alert: { id: "inside_lair_alert", title: "Prepared for You",
        text: "By the time you reach the inner cavern, Grimjaw is waiting.\n\n\"I knew you would come,\" the massive goblin growls. Dark energy crackles around him. \"Give me the shard, and I will make your death quick.\"",
        choices: [{ text: "Never!", next: "boss_fight" }]
    },
    boss_fight: { id: "boss_fight", title: "Grimjaw the Corrupted",
        text: "Grimjaw roars and leaps from the platform, his massive blade sweeping toward you.\n\nThis is it. Kill or be killed.",
        choices: [{ text: "FIGHT GRIMJAW!", combat: "goblin_chieftain", next: "victory" }]
    },
    victory: { id: "victory", title: "Victory",
        text: "Grimjaw falls. The dark energy dissipates as he collapses, shrinking to normal size.\n\nThe crystal shard he carried clatters to the ground. As you pick it up, it merges with your pendant, the blue glow intensifying.\n\nTwo shards. Three remain.\n\nGrimjaw spoke of the Shattered God. Someone gave him that shard. Someone is collecting them.\n\nYour quest has only begun.",
        choices: [{ text: "Return to Millbrook", next: "return_village" }],
        effects: { quest_complete: "main_chieftain", flag: "act1_complete" }
    },
    return_village: { id: "return_village", title: "A Hero Returns",
        text: "Elder Mira meets you at the village edge. She sees the merged shard and nods.\n\n\"It is done. You have bought us time. But the Cult will send others.\"\n\nShe hands you a worn map. \"The next shard was last seen in the city of Ashenmoor. But be warned—the city has fallen to a plague of shadows.\"\n\n\"Rest. Prepare. Then continue your journey. And...\" she smiles faintly, \"try not to lose all your gold to Madame Fortune.\"",
        choices: [{ text: "Begin free exploration", next: "free_roam" }]
    },
    free_roam: { id: "free_roam", text: "SHOW_MAIN_INTERFACE" }
};

var LOCATIONS = {
    millbrook: { id: "millbrook", name: "Millbrook Village", description: "The burned husk of your first home. Survivors rebuild.",
        accessible: true, shops: ["millbrook"], fishing: "millbrook_pond", gambling: "millbrook_tavern",
        enemies: ["forest_wolf", "goblin_scout"], levelRange: [1, 4] },
    dark_forest: { id: "dark_forest", name: "The Dark Forest", description: "Ancient trees block the sky. Things move in shadows.",
        accessible: true, fishing: "dark_river", enemies: ["forest_wolf", "goblin_scout", "goblin_warrior", "shadow_assassin"], levelRange: [2, 8] },
    goblin_lair: { id: "goblin_lair", name: "Goblin Lair", description: "The old mines, now mostly empty.",
        accessible: false, unlockRequirement: { quest: "main_village_flames" }, enemies: ["goblin_scout", "goblin_warrior"], levelRange: [4, 8] },
    shadow_woods: { id: "shadow_woods", name: "Shadow Woods", description: "Even darker than the forest. The trees have no leaves.",
        accessible: false, unlockRequirement: { quest: "main_chieftain" }, enemies: ["shadow_assassin", "corrupted_treant", "undead_knight"], levelRange: [8, 12] },
    crystal_lake: { id: "crystal_lake", name: "Crystal Lake", description: "Sacred waters said to grant visions.",
        accessible: false, unlockRequirement: { quest: "main_chieftain" }, fishing: "crystal_lake", enemies: ["corrupted_treant", "cultist"], levelRange: [10, 14] },
    ashenmoor: { id: "ashenmoor", name: "Ashenmoor", description: "A city consumed by shadow plague. The living are few.",
        accessible: false, unlockRequirement: { quest: "main_second_shard" }, shops: ["blacksmith", "magic_shop", "shadow_market"],
        gambling: "shadow_den", enemies: ["cultist", "undead_knight", "blood_witch", "demon_spawn"], levelRange: [10, 16] }
};
