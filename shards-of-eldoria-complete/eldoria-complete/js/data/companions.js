var COMPANIONS = {
    lyra: { id: "lyra", name: "Lyra Shadowmend", icon: "🥷", class: "assassin",
        description: "A former assassin seeking redemption. Quick with a blade, quicker with sarcasm.",
        backstory: "Once the deadliest blade in the Shadow Guild. Left after a job went wrong.",
        stats: { strength: 6, agility: 12, intelligence: 8, vitality: 5, luck: 7 },
        skills: { active: { name: "Shadow Strike", damage: 2.0, description: "Attack from the shadows." },
                  passive: { name: "Evasion", description: "+15% party dodge chance." } },
        recruitment: { location: "dark_forest", quest: "side_assassin_redemption", condition: "spare" },
        approval: 0, romanceable: true, personalQuest: "lyra_past"
    },
    borin: { id: "borin", name: "Borin Ironforge", icon: "🔨", class: "blacksmith",
        description: "A dwarven smith whose forge was destroyed by cultists. Hits things very hard.",
        backstory: "Three generations of Ironforges worked that forge. Now it's ash.",
        stats: { strength: 14, agility: 4, intelligence: 6, vitality: 12, luck: 3 },
        skills: { active: { name: "Hammer Time", damage: 2.5, description: "Devastating overhead strike." },
                  passive: { name: "Iron Will", description: "+20% party defense." } },
        recruitment: { location: "millbrook", quest: null, condition: "talk_after_chieftain" },
        approval: 0, romanceable: false, personalQuest: "borin_vengeance"
    },
    seraphina: { id: "seraphina", name: "Seraphina", icon: "🧝", class: "mage",
        description: "An elven scholar researching the Shards. Knows more than she says.",
        backstory: "Sent by the Elven Council. Her true mission is unclear.",
        stats: { strength: 3, agility: 7, intelligence: 15, vitality: 4, luck: 8 },
        skills: { active: { name: "Arcane Blast", damage: 2.2, description: "Pure magical damage." },
                  passive: { name: "Mana Font", description: "+30% skill damage for party." } },
        recruitment: { location: "ashenmoor", quest: "side_elven_scholar", condition: "pass_test" },
        approval: 0, romanceable: true, personalQuest: "seraphina_truth", secretTraitor: true
    },
    kira: { id: "kira", name: "Kira Moonshadow", icon: "🐺", class: "werewolf",
        description: "A werewolf struggling with her curse. Loyal to those who accept her.",
        backstory: "Bitten as a child. Has never belonged anywhere.",
        stats: { strength: 10, agility: 10, intelligence: 5, vitality: 8, luck: 5 },
        skills: { active: { name: "Savage Fury", damage: 1.8, description: "Multiple rapid attacks." },
                  passive: { name: "Pack Tactics", description: "+10% damage per companion." } },
        recruitment: { location: "shadow_woods", quest: "side_werewolf_cure", condition: "any" },
        approval: 0, romanceable: true, personalQuest: "kira_pack", transformation: true
    }
};

var COMPANION_DIALOGUES = {
    lyra: {
        greeting: ["Try not to die.", "Another day, another disaster.", "I have a bad feeling about this."],
        approval_high: ["You're not so bad. For a hero.", "I... trust you. Don't make me regret it."],
        approval_low: ["Are you always this stupid?", "I should have stayed in the shadows."],
        combat_start: ["Finally, something to kill.", "This should be quick."],
        combat_victory: ["Messy. I would have done it cleaner.", "Not bad."],
        location_millbrook: ["Quaint. Too many witnesses.", "I've burned villages like this. Different life."],
        location_dark_forest: ["Stay close. Things hunt here.", "I know these shadows. They know me."]
    },
    borin: {
        greeting: ["Aye, what now?", "My hammer thirsts.", "Stone and steel guide us."],
        approval_high: ["You're good folk. Rare, these days.", "I'd forge you a blade. If I had a forge."],
        approval_low: ["Bah. You remind me why I work alone.", "The stone judges you. It ain't impressed."],
        combat_start: ["HAMMER TIME!", "By my beard, you'll regret this!"],
        combat_victory: ["That'll leave a dent.", "My ancestors smile upon me."],
        location_millbrook: ["Could rebuild here. Good stone.", "Reminds me of home. Before."]
    }
};

var APPROVAL_ACTIONS = {
    lyra: {
        positive: ["spare_enemy", "stealth_approach", "dark_humor", "question_authority"],
        negative: ["unnecessary_killing", "blind_trust", "naive_choices", "work_with_guild"]
    },
    borin: {
        positive: ["direct_approach", "protect_innocents", "honor_dead", "craft_items"],
        negative: ["destroy_property", "disrespect_tradition", "cowardice", "use_dark_magic"]
    },
    seraphina: {
        positive: ["seek_knowledge", "magical_solutions", "spare_creatures", "collect_artifacts"],
        negative: ["destroy_books", "anti_magic_choices", "crude_behavior", "reveal_secrets"]
    },
    kira: {
        positive: ["accept_monsters", "fight_alongside", "show_kindness", "embrace_nature"],
        negative: ["reject_her_nature", "hunt_werewolves", "cruel_choices", "betray_trust"]
    }
};
