function Game() {
    this.character = null;
    this.currentNode = null;
    this.combat = null;
    this.inventory = null;
    this.quests = null;
    this.ui = null;
    this.inCombat = false;
    this.combatNextNode = null;
}

Game.prototype.init = function() {
    this.ui = new GameUI(this);
    this.ui.showTitleScreen();
    console.log("Game initialized!");
};

Game.prototype.newGame = function(name, characterClass, difficulty) {
    console.log("Starting new game:", name, characterClass, difficulty);

    // Create character
    this.character = new Character(name, characterClass, difficulty);

    // Initialize systems
    this.combat = new CombatEngine(this);
    this.inventory = new InventoryManager(this);
    this.quests = new QuestManager(this);

    // Give starting equipment
    var startEquip = CLASS_EQUIPMENT[characterClass];
    if (startEquip) {
        if (startEquip.weapon) {
            this.inventory.addItem(startEquip.weapon);
            this.inventory.equipItem(startEquip.weapon, "weapon");
        }
        if (startEquip.armor) {
            this.inventory.addItem(startEquip.armor);
            this.inventory.equipItem(startEquip.armor, "armor");
        }
        if (startEquip.items) {
            for (var i = 0; i < startEquip.items.length; i++) {
                this.inventory.addItem(startEquip.items[i]);
            }
        }
    }

    // Start first quest
    this.quests.startQuest("main_awakening");

    // Begin story
    this.startStoryNode("opening");
};

Game.prototype.startStoryNode = function(nodeId) {
    console.log("Starting story node:", nodeId);

    var node = STORY[nodeId];
    if (!node) {
        console.error("Story node not found:", nodeId);
        this.ui.showMainInterface();
        return;
    }

    this.currentNode = nodeId;

    // Apply effects
    if (node.effects) {
        this.applyEffects(node.effects);
    }

    this.ui.displayStoryNode(node);
};

Game.prototype.makeChoice = function(choiceIndex) {
    var node = STORY[this.currentNode];
    if (!node || !node.choices) return;

    var choice = node.choices[choiceIndex];
    if (!choice) return;

    // Check stat requirements
    if (choice.check) {
        var statValue = this.character.getEffectiveStat(choice.check.stat);
        if (statValue < choice.check.dc) {
            // Should be disabled, but just in case
            this.ui.showMessage("You need " + choice.check.dc + " " + choice.check.stat.toUpperCase() + " for this option.");
            return;
        }
    }

    // Apply karma
    if (choice.karma) {
        this.character.karma += choice.karma;
    }

    // Handle combat
    if (choice.combat) {
        this.startCombat(choice.combat, choice.next);
        return;
    }

    // Handle shop
    if (choice.action === "open_shop") {
        this.openShop("millbrook");
        return;
    }

    // Continue story
    if (choice.next) {
        this.startStoryNode(choice.next);
    } else if (choice.fail) {
        this.startStoryNode(choice.fail);
    }
};

Game.prototype.applyEffects = function(effects) {
    if (!effects) return;

    if (effects.flag) {
        this.character.setFlag(effects.flag, true);
    }

    if (effects.gold) {
        this.character.gold += effects.gold;
    }

    if (effects.karma) {
        this.character.karma += effects.karma;
    }

    if (effects.giveItem) {
        this.inventory.addItem(effects.giveItem);
        var item = ITEMS[effects.giveItem] || WEAPONS[effects.giveItem];
        if (item) {
            this.ui.showNotification("Obtained: " + item.name);
        }
    }

    if (effects.quest_start) {
        this.quests.startQuest(effects.quest_start);
        var quest = QUESTS[effects.quest_start];
        if (quest) {
            this.ui.showNotification("New Quest: " + quest.title);
        }
    }

    if (effects.quest_update) {
        var parts = effects.quest_update.split(".");
        if (parts.length === 2) {
            this.quests.updateObjective(parts[0], parts[1]);
        }
    }

    if (effects.quest_complete) {
        this.quests.completeQuest(effects.quest_complete);
        var completedQuest = QUESTS[effects.quest_complete];
        if (completedQuest) {
            this.ui.showNotification("Quest Complete: " + completedQuest.title);
        }
    }
};

Game.prototype.startCombat = function(enemyId, nextNode) {
    var enemy = this.combat.startCombat(enemyId);
    if (!enemy) {
        console.error("Failed to start combat with:", enemyId);
        return;
    }

    this.inCombat = true;
    this.combatNextNode = nextNode || null;
    this.ui.showCombatInterface(enemy);
};

Game.prototype.playerCombatAction = function(action) {
    if (!this.inCombat) return;

    var result;

    switch (action) {
        case "attack":
            result = this.combat.playerAttack(false);
            break;
        case "skill":
            if (this.character.specialCooldown > 0) {
                this.ui.showMessage("Skill on cooldown!");
                return;
            }
            result = this.combat.playerAttack(true);
            break;
        case "flee":
            result = this.combat.attemptFlee();
            break;
    }

    this.ui.updateCombat(result);

    if (result && !result.ongoing) {
        this.endCombat(result);
    }
};

Game.prototype.useCombatItem = function(itemId) {
    if (!this.inCombat) return;

    var result = this.combat.useItem(itemId);
    this.ui.updateCombat(result);

    if (result && !result.ongoing) {
        this.endCombat(result);
    }
};

Game.prototype.endCombat = function(result) {
    this.inCombat = false;

    if (result.fled) {
        this.ui.showMessage("You escaped!");
        this.ui.showMainInterface();
        return;
    }

    if (result.victory) {
        this.ui.showCombatVictory(result);
    } else {
        this.ui.showCombatDefeat(result);
    }
};

Game.prototype.afterCombat = function(victory) {
    if (victory && this.combatNextNode) {
        this.startStoryNode(this.combatNextNode);
    } else {
        this.ui.showMainInterface();
    }
    this.combatNextNode = null;
};

Game.prototype.explore = function(locationId) {
    var location = LOCATIONS[locationId];
    if (!location) {
        this.ui.showMessage("Location not found.");
        return;
    }

    // Check if accessible
    if (!location.accessible) {
        if (location.unlockRequirement && location.unlockRequirement.quest) {
            if (!this.quests.isQuestCompleted(location.unlockRequirement.quest)) {
                this.ui.showMessage("This area is locked. Complete more quests first.");
                return;
            }
        }
    }

    // Level warning
    if (location.levelRange) {
        var minLevel = location.levelRange[0];
        if (this.character.level < minLevel - 2) {
            if (!confirm("WARNING: This area is for levels " + location.levelRange[0] + "-" + location.levelRange[1] + ". You are level " + this.character.level + " and may die!\n\nContinue anyway?")) {
                return;
            }
        }
    }

    // Random encounter
    if (location.enemies && location.enemies.length > 0) {
        if (Math.random() < 0.65) {
            var enemyId = location.enemies[Math.floor(Math.random() * location.enemies.length)];
            this.startCombat(enemyId, null);
            return;
        }
    }

    this.ui.showMessage("You explore " + location.name + " but find nothing of interest.");
};

Game.prototype.rest = function() {
    this.character.fullHeal();
    this.ui.showNotification("Fully rested! HP and skills restored.");
    this.ui.showMainInterface();
};

Game.prototype.showQuests = function() {
    this.ui.showQuestLog(this.quests);
};

Game.prototype.showInventory = function() {
    this.ui.showInventory(this.inventory.getInventoryDisplay());
};

Game.prototype.showCharacter = function() {
    this.ui.showCharacterSheet(this.character);
};

Game.prototype.openShop = function(shopId) {
    var shop = SHOP_INVENTORIES[shopId];
    if (!shop) {
        this.ui.showMessage("Shop not found.");
        return;
    }
    this.ui.showShop(shop);
};

Game.prototype.buyItem = function(itemId, price) {
    if (this.character.gold < price) {
        this.ui.showMessage("Not enough gold!");
        return;
    }

    if (!this.inventory.addItem(itemId)) {
        this.ui.showMessage("Inventory full!");
        return;
    }

    this.character.gold -= price;
    this.ui.showNotification("Purchased!");
    this.openShop("millbrook");
};

Game.prototype.useItem = function(itemId) {
    var result = this.inventory.useItem(itemId);
    if (result.success) {
        this.ui.showNotification(result.message);
    }
    this.showInventory();
};

Game.prototype.equipItem = function(itemId, slot) {
    this.inventory.equipItem(itemId, slot);
    this.ui.showNotification("Equipped!");
    this.showInventory();
};

Game.prototype.allocateStat = function(stat) {
    if (this.character.allocateStat(stat)) {
        this.ui.showNotification("+1 " + stat.toUpperCase());
        this.showCharacter();
    }
};

// Initialize
var game;
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded, starting game...");
    game = new Game();
    game.init();
});
