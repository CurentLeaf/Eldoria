var STORY = {
    opening: {
        id: "opening",
        title: "Awakening",
        text: "Darkness.\n\nThen pain—a throbbing ache behind your eyes, the taste of blood and dirt in your mouth. Your fingers find cold stone beneath you, slick with something you do not want to identify.\n\nYou remember... nothing. Fragments. A village. Screaming. Fire against a midnight sky.\n\nYour body protests as you force yourself upright. You are in a forest clearing, ancient oaks looming overhead like silent judges. The air smells of smoke and something else—decay, perhaps, or the aftermath of violence.\n\nThrough the trees, you see an orange glow. Fire. The village burns in the distance.",
        choices: [
            { text: "Move toward the burning village", next: "approach_village" },
            { text: "Search your belongings first", next: "search_belongings" },
            { text: "Call out for help", next: "call_for_help" }
        ],
        effects: { quest_update: "main_awakening.wake_up" }
    },

    search_belongings: {
        id: "search_belongings",
        title: "Taking Stock",
        text: "Before rushing into danger, you check what you have.\n\nYour pouch contains some gold coins. Your clothes, though torn, are of decent quality. Around your neck hangs a pendant—a simple circle of silver containing a blue gemstone that seems to pulse with inner light.\n\nThe moment your fingers touch it, pain lances through your skull. Images flash: robed figures, dark rituals, a chamber of impossible geometry.\n\nYou are a Guardian. The gem is one of five Shards of Eldoria. If they are reunited in the wrong hands, the world ends.\n\nYou must protect it. At all costs.",
        choices: [
            { text: "Head toward the village", next: "approach_village" }
        ],
        effects: { flag: "shard_vision" }
    },

    call_for_help: {
        id: "call_for_help",
        title: "A Mistake",
        text: "Your voice echoes through the dark forest. For a moment, silence.\n\nThen you hear it—rustling in the undergrowth. Yellow eyes gleam in the darkness. A starving wolf emerges from the shadows, drawn by your cries.\n\nIt was hungry before. Now it has found prey.",
        choices: [
            { text: "Fight the wolf!", combat: "forest_wolf", next: "after_wolf" }
        ]
    },

    after_wolf: {
        id: "after_wolf",
        title: "Survival",
        text: "The wolf lies dead at your feet. Your hands shake—from fear or adrenaline, you cannot tell.\n\nThe glow of the burning village reminds you of more pressing concerns. Someone there might need help.",
        choices: [
            { text: "Head to the village", next: "approach_village" }
        ]
    },

    approach_village: {
        id: "approach_village",
        title: "The Burning Village",
        text: "You push through the undergrowth toward the flames. The smoke thickens with each step, carrying screams on its bitter breath.\n\nThe village of Millbrook burns before you. Half the structures are ablaze. Figures run through the chaos—villagers fleeing, and smaller shapes pursuing them. Goblins.\n\nAt the village center, an elderly woman stands defiant before a burning inn. She holds a gnarled staff, and despite her age, there is steel in her stance.\n\nA goblin scout spots you and charges with a rusted blade raised!",
        choices: [
            { text: "Fight the goblin!", combat: "goblin_scout", next: "after_first_goblin" }
        ],
        effects: { quest_update: "main_village_flames.reach_village" }
    },

    after_first_goblin: {
        id: "after_first_goblin",
        title: "First Blood",
        text: "The goblin falls. Your blade is wet with its dark blood.\n\nMore goblins notice you. A larger one—a warrior in crude armor—steps forward, flanked by two scouts. The warrior grins, revealing pointed teeth.\n\n\"Fresh meat,\" it growls in broken Common.\n\nThe elderly woman calls out: \"Survivor! Get to cover or fight your way through!\"",
        choices: [
            { text: "Fight the goblin warrior", combat: "goblin_warrior", next: "reach_elder" },
            { text: "Try to sneak around", check: { stat: "agility", dc: 8 }, next: "sneak_success", fail: "sneak_fail" }
        ]
    },

    sneak_success: {
        id: "sneak_success",
        title: "Shadow Movement",
        text: "You slip through the smoke and chaos like a ghost. The goblins never see you pass.\n\nYou reach the elderly woman, who eyes you with a mixture of suspicion and hope.",
        choices: [
            { text: "Continue", next: "reach_elder" }
        ]
    },

    sneak_fail: {
        id: "sneak_fail",
        title: "Caught!",
        text: "A goblin spots you mid-sneak. It shrieks an alarm, and suddenly you are surrounded.\n\nNo choice now but to fight!",
        choices: [
            { text: "Fight!", combat: "goblin_warrior", next: "reach_elder" }
        ]
    },

    reach_elder: {
        id: "reach_elder",
        title: "Elder Mira",
        text: "The elderly woman lowers her staff as you approach. Up close, you see power crackling around her fingers—she is no mere villager.\n\n\"I am Mira,\" she says. \"Elder of Millbrook, or what remains of it. You fight well, stranger.\"\n\nHer eyes drop to your chest—to where the pendant rests beneath your shirt. Her expression shifts.\n\n\"You carry a Shard. I thought they were all lost.\" She grabs your arm. \"The goblins came for it. Their chieftain, Grimjaw—he serves something darker. You must stop him, or more villages will burn.\"",
        choices: [
            { text: "\"Where can I find this chieftain?\"", next: "chieftain_location" },
            { text: "\"What do you know about this shard?\"", next: "shard_info" },
            { text: "\"I need to prepare first\"", next: "prepare_first" }
        ],
        effects: { quest_update: "main_village_flames.speak_elder" }
    },

    chieftain_location: {
        id: "chieftain_location",
        title: "The Goblin Lair",
        text: "\"Grimjaw makes his lair in the old mines, north through the Dark Forest. But be warned—he is no ordinary goblin. Something has... changed him. Made him stronger, crueler.\"\n\nShe presses a small vial into your hands. \"A healing draught. You will need it.\"\n\n\"Go now, before more innocents die.\"",
        choices: [
            { text: "Head to the goblin lair", next: "forest_path" },
            { text: "Explore the village first", next: "explore_village" }
        ],
        effects: { giveItem: "greater_health_potion", quest_start: "main_chieftain" }
    },

    shard_info: {
        id: "shard_info",
        title: "The Shards of Eldoria",
        text: "Mira's voice drops to a whisper. \"Long ago, a great power was sundered into five pieces—the Shards of Eldoria. Each contains immense magical energy. Together, they could reshape reality itself.\"\n\nShe looks at you intently. \"Or destroy it. There are those who seek to reunite them for terrible purposes. The Cult of the Shattered God believes rejoining the shards will summon their dark deity.\"\n\n\"You must be a Guardian—chosen to protect the shards. Though how you came to have one, and why you have no memory... that troubles me.\"",
        choices: [
            { text: "\"Where is the goblin chieftain?\"", next: "chieftain_location" },
            { text: "\"I need to prepare first\"", next: "prepare_first" }
        ]
    },

    prepare_first: {
        id: "prepare_first",
        title: "Preparation",
        text: "\"Wise,\" Mira nods. \"The merchant's shop still stands—barely. Take what supplies you need. Some villagers may need help as well.\"\n\nShe gestures to the chaos around you. \"When you are ready, the path north leads through the Dark Forest to the goblin lair.\"",
        choices: [
            { text: "Go to the shop", next: "visit_shop" },
            { text: "Help villagers", next: "help_villagers" },
            { text: "Head to the forest immediately", next: "forest_path" }
        ]
    },

    explore_village: {
        id: "explore_village",
        title: "Millbrook Ruins",
        text: "You walk through the burning streets. Bodies lie in the dirt—goblin and human alike. A child cries somewhere in the smoke.\n\nThe merchant's shop stands partially intact. A few villagers huddle near the well, tending to the wounded.",
        choices: [
            { text: "Visit the shop", next: "visit_shop" },
            { text: "Help the wounded", next: "help_villagers" },
            { text: "Search for the crying child", next: "find_child" },
            { text: "Head to the forest", next: "forest_path" }
        ]
    },

    visit_shop: {
        id: "visit_shop",
        title: "The Merchant",
        text: "The merchant, a stout man with a singed beard, looks up as you enter.\n\n\"Buying or selling? Either way, make it quick. I am packing what I can before more of those monsters arrive.\"",
        choices: [
            { text: "Browse wares (opens shop)", action: "open_shop" },
            { text: "Leave", next: "explore_village" }
        ]
    },

    help_villagers: {
        id: "help_villagers",
        title: "Tending the Wounded",
        text: "You help bandage wounds and carry the injured to safety. An old man grasps your hand.\n\n\"Bless you, stranger. Take this—it is all I have, but you have earned it.\"\n\nHe presses a few coins into your palm.",
        choices: [
            { text: "Continue", next: "explore_village" }
        ],
        effects: { gold: 15, karma: 5 }
    },

    find_child: {
        id: "find_child",
        title: "The Lost Child",
        text: "You follow the crying to a collapsed building. A young girl is trapped beneath a fallen beam, too heavy for her to move.\n\n\"Please,\" she sobs. \"Help me!\"",
        choices: [
            { text: "Lift the beam (requires 7 STR)", check: { stat: "strength", dc: 7 }, next: "save_child", fail: "fail_save_child" },
            { text: "Look for something to use as leverage", next: "lever_solution" }
        ]
    },

    save_child: {
        id: "save_child",
        title: "Rescued",
        text: "With a grunt of effort, you heave the beam aside. The girl scrambles free and throws her arms around you.\n\n\"Thank you, thank you!\"\n\nHer mother rushes over, tears streaming down her face. She presses a small pouch into your hands before gathering her daughter and fleeing.",
        choices: [
            { text: "Continue", next: "explore_village" }
        ],
        effects: { giveItem: "health_potion", karma: 10 }
    },

    fail_save_child: {
        id: "fail_save_child",
        title: "Not Strong Enough",
        text: "You strain against the beam, but it will not budge. The fire spreads closer.\n\n\"Please!\" the girl screams.\n\nYou look around frantically for another solution.",
        choices: [
            { text: "Find a lever", next: "lever_solution" }
        ]
    },

    lever_solution: {
        id: "lever_solution",
        title: "Clever Thinking",
        text: "You grab a long piece of metal from the debris and wedge it under the beam. Using a chunk of stone as a fulcrum, you lever the beam up just enough for the girl to crawl free.\n\nHer mother arrives, weeping with relief.",
        choices: [
            { text: "Continue", next: "explore_village" }
        ],
        effects: { karma: 10 }
    },

    forest_path: {
        id: "forest_path",
        title: "The Dark Forest",
        text: "The path north leads into the Dark Forest. The trees grow thick here, their branches blocking out what little moonlight remains. Strange sounds echo in the darkness—animal calls that do not quite sound natural.\n\nThe forest has a reputation. Travelers who enter unprepared rarely return.",
        choices: [
            { text: "Press onward", next: "forest_encounter" },
            { text: "Return to the village", next: "explore_village" }
        ]
    },

    forest_encounter: {
        id: "forest_encounter",
        title: "Ambush!",
        text: "You have barely entered the forest when shapes detach from the shadows. Goblins—three of them, with crude weapons raised.\n\n\"Kill the human!\" one shrieks. \"Take the shiny thing it carries!\"\n\nThey know about the shard. This is no random attack.",
        choices: [
            { text: "Fight!", combat: "goblin_scout", next: "after_ambush" }
        ]
    },

    after_ambush: {
        id: "after_ambush",
        title: "Deeper In",
        text: "The goblins lie dead. You search their bodies and find a crude map scratched on leather—it shows the path to their lair.\n\nThe forest grows darker as you proceed. Twisted trees seem to watch your passage. After what feels like hours, you see torchlight ahead.\n\nThe goblin lair.",
        choices: [
            { text: "Approach carefully", next: "lair_entrance" },
            { text: "Rush in", next: "lair_rush" }
        ],
        effects: { quest_update: "main_chieftain.find_lair" }
    },

    lair_entrance: {
        id: "lair_entrance",
        title: "The Mine Entrance",
        text: "You creep closer to the old mine entrance. Two goblin guards stand watch, picking their teeth with bone fragments.\n\nBeyond them, torchlight flickers in the tunnel. You hear drums echoing from within—and chanting. Something dark is happening in there.",
        choices: [
            { text: "Attack the guards", combat: "goblin_warrior", next: "inside_lair" },
            { text: "Try to sneak past", check: { stat: "agility", dc: 10 }, next: "sneak_lair", fail: "sneak_lair_fail" }
        ]
    },

    lair_rush: {
        id: "lair_rush",
        title: "Reckless Charge",
        text: "You charge toward the entrance, weapon raised. The guards see you coming and sound an alarm.\n\nBy the time you reach them, reinforcements are already emerging from the mine.",
        choices: [
            { text: "Fight through!", combat: "goblin_warrior", next: "inside_lair_alert" }
        ]
    },

    sneak_lair: {
        id: "sneak_lair",
        title: "Silent Entry",
        text: "You slip past the guards like a shadow, entering the mine undetected.\n\nThe tunnel twists downward into darkness. The chanting grows louder.",
        choices: [
            { text: "Continue deeper", next: "inside_lair" }
        ]
    },

    sneak_lair_fail: {
        id: "sneak_lair_fail",
        title: "Spotted!",
        text: "A loose stone betrays you. The guards whirl around.\n\n\"INTRUDER!\" one bellows, raising its weapon.",
        choices: [
            { text: "Fight!", combat: "goblin_warrior", next: "inside_lair_alert" }
        ]
    },

    inside_lair: {
        id: "inside_lair",
        title: "The Inner Sanctum",
        text: "The tunnel opens into a vast cavern. Dozens of goblins kneel in concentric circles around a raised platform. Upon the platform stands the largest goblin you have ever seen—Grimjaw.\n\nBut something is wrong with him. Dark veins pulse beneath his skin. His eyes glow with an unnatural light. In his hand, he holds a fragment of crystal that pulses in rhythm with your own shard.\n\n\"The final piece comes to me,\" Grimjaw growls, turning to face you. \"The Shattered God will be pleased.\"\n\nThe other goblins part, creating a path between you and their chieftain.",
        choices: [
            { text: "Face Grimjaw", next: "boss_fight" }
        ]
    },

    inside_lair_alert: {
        id: "inside_lair_alert",
        title: "Prepared for You",
        text: "You fight through the tunnels, leaving goblin bodies in your wake. But by the time you reach the inner cavern, Grimjaw is waiting.\n\n\"I knew you would come,\" the massive goblin growls. Dark energy crackles around his form. \"The shard called to the shard. Now give me what you carry, and I will make your death quick.\"",
        choices: [
            { text: "Never!", next: "boss_fight" }
        ]
    },

    boss_fight: {
        id: "boss_fight",
        title: "Grimjaw the Corrupted",
        text: "Grimjaw roars and leaps from the platform, his massive blade sweeping toward you.\n\nThis is it. Kill or be killed.",
        choices: [
            { text: "FIGHT GRIMJAW!", combat: "goblin_chieftain", next: "victory" }
        ]
    },

    victory: {
        id: "victory",
        title: "Victory",
        text: "Grimjaw falls. The dark energy dissipates from his body as he collapses, shrinking back to the size of a normal—if large—goblin.\n\nThe crystal shard he carried clatters to the ground. As you pick it up, it merges with your own pendant, the blue glow intensifying.\n\nTwo shards. Three remain.\n\nThe surviving goblins flee into the darkness, their master defeated. You stand alone in the cavern, victorious but troubled.\n\nGrimjaw spoke of the Shattered God. Someone gave him that shard. Someone is collecting them.\n\nYour quest has only begun.",
        choices: [
            { text: "Return to Millbrook", next: "return_village" }
        ],
        effects: { 
            quest_complete: "main_chieftain",
            flag: "act1_complete"
        }
    },

    return_village: {
        id: "return_village",
        title: "A Hero Returns",
        text: "The journey back to Millbrook feels shorter. Perhaps hope makes the road easier.\n\nElder Mira meets you at the village edge. She sees the merged shard and nods slowly.\n\n\"It is done, then. You have bought us time. But the Cult will send others. You must find the remaining shards before they do.\"\n\nShe hands you a worn map. \"The next shard was last seen in the city of Ashenmoor. But be warned—the city has fallen to darkness. A plague of shadows consumes it.\"\n\nYour adventure continues...",
        choices: [
            { text: "Begin free exploration", next: "free_roam" }
        ]
    },

    free_roam: {
        id: "free_roam",
        text: "SHOW_MAIN_INTERFACE"
    }
};

var LOCATIONS = {
    millbrook: {
        id: "millbrook",
        name: "Millbrook Village",
        description: "The burned husk of your first home in this new life.",
        accessible: true,
        enemies: ["forest_wolf", "goblin_scout"],
        levelRange: [1, 4]
    },
    dark_forest: {
        id: "dark_forest",
        name: "The Dark Forest",
        description: "Ancient trees block out the sky. Things move in the shadows.",
        accessible: true,
        enemies: ["forest_wolf", "goblin_scout", "goblin_warrior"],
        levelRange: [2, 6]
    },
    goblin_lair: {
        id: "goblin_lair",
        name: "Goblin Lair",
        description: "The old mines, now infested with goblins.",
        accessible: false,
        unlockRequirement: { quest: "main_village_flames" },
        enemies: ["goblin_scout", "goblin_warrior"],
        levelRange: [4, 8]
    },
    shadow_woods: {
        id: "shadow_woods",
        name: "Shadow Woods",
        description: "Even darker than the forest. The trees here have no leaves.",
        accessible: false,
        unlockRequirement: { quest: "main_chieftain" },
        enemies: ["shadow_assassin", "corrupted_treant"],
        levelRange: [8, 12]
    }
};
