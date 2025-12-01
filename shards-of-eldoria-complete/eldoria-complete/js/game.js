function Game() {
    this.character = null;
    this.ui = new GameUI(this);
    this.combat = new CombatEngine(this);
    this.inventory = new InventoryManager(this);
    this.quests = new QuestManager(this);
    this.fishing = new FishingEngine(this);
    this.gambling = new GamblingEngine(this);
    this.currentNode = null;
    this.pendingChoice = null;
    this.currentGamblingGame = null;
    this.currentGamblingLocation = null;
}

Game.prototype.init = function() {
    this.ui.showTitleScreen();
    this.loadGame();
};

Game.prototype.newGame = function(name, characterClass, difficulty) {
    this.character = new Character(name, characterClass, difficulty);
    var startEquip = CLASS_EQUIPMENT[characterClass];
    if (startEquip) {
        this.character.equipment.weapon = startEquip.weapon;
        this.character.equipment.armor = startEquip.armor;
        if (startEquip.items) {
            for (var i = 0; i < startEquip.items.length; i++) this.inventory.addItem(startEquip.items[i]);
        }
    }
    this.quests.startQuest("main_awakening");
    this.currentNode = "opening";
    this.displayCurrentNode();
    this.saveGame();
};

Game.prototype.displayCurrentNode = function() {
    var node = STORY[this.currentNode];
    if (!node) { console.error("Node not found:", this.currentNode); return; }
    this.processNodeEffects(node.effects);
    this.ui.displayStoryNode(node);
};

Game.prototype.processNodeEffects = function(effects) {
    if (!effects) return;
    if (effects.gold) this.character.gold += effects.gold;
    if (effects.karma) this.character.karma += effects.karma;
    if (effects.xp) this.character.addXP(effects.xp);
    if (effects.flag) this.character.setFlag(effects.flag, true);
    if (effects.giveItem) this.inventory.addItem(effects.giveItem);
    if (effects.quest_start) this.quests.startQuest(effects.quest_start);
    if (effects.quest_update) {
        var parts = effects.quest_update.split(".");
        this.quests.updateObjective(parts[0], parts[1]);
    }
    if (effects.quest_complete) this.quests.completeQuest(effects.quest_complete);
};

Game.prototype.makeChoice = function(idx) {
    var node = STORY[this.currentNode];
    if (!node || !node.choices || !node.choices[idx]) return;
    var choice = node.choices[idx];

    if (choice.action) {
        this.handleAction(choice.action, choice);
        return;
    }

    if (choice.check) {
        var statValue = this.character.getEffectiveStat(choice.check.stat);
        if (statValue >= choice.check.dc) {
            this.currentNode = choice.next;
        } else {
            this.currentNode = choice.fail;
        }
        this.displayCurrentNode();
        return;
    }

    if (choice.combat) {
        this.pendingChoice = choice;
        this.startCombat(choice.combat);
        return;
    }

    if (choice.next) {
        this.currentNode = choice.next;
        this.displayCurrentNode();
    }

    this.saveGame();
};

Game.prototype.handleAction = function(action, choice) {
    switch (action) {
        case "open_shop":
            this.openShop("millbrook");
            break;
        case "open_fishing":
            this.openFishing(choice.location || "millbrook_pond");
            break;
        case "open_gambling":
            this.openGambling(choice.location || "millbrook_tavern");
            break;
        case "open_wheel":
            this.openGambling("millbrook_tavern");
            this.selectGamblingGame("wheel_of_misfortune");
            break;
        default:
            console.log("Unknown action:", action);
    }
};

Game.prototype.startCombat = function(enemyId) {
    var enemy = this.combat.startCombat(enemyId);
    if (enemy) this.ui.showCombatInterface(enemy);
};

Game.prototype.playerCombatAction = function(action) {
    var result;
    switch (action) {
        case "attack":
            result = this.combat.playerAttack(false);
            break;
        case "skill":
            if (this.character.specialCooldown <= 0) result = this.combat.playerAttack(true);
            else return;
            break;
        case "flee":
            result = this.combat.attemptFlee();
            break;
    }
    if (!result) return;

    if (!result.ongoing) {
        if (result.victory) this.ui.showCombatVictory(result);
        else if (result.fled) this.afterCombat(false, true);
        else this.ui.showCombatDefeat(result);
    } else {
        this.ui.updateCombat(result);
    }
    this.saveGame();
};

Game.prototype.useCombatItem = function(itemId) {
    var result = this.combat.useItem(itemId);
    if (result && !result.ongoing) {
        if (result.victory) this.ui.showCombatVictory(result);
        else this.ui.showCombatDefeat(result);
    } else {
        this.ui.updateCombat(result);
        this.ui.showCombatInterface(this.combat.currentEnemy);
    }
};

Game.prototype.afterCombat = function(victory, fled) {
    if (fled) {
        this.ui.showMainInterface();
        return;
    }
    if (this.pendingChoice && this.pendingChoice.next) {
        this.currentNode = this.pendingChoice.next;
        this.pendingChoice = null;
        this.displayCurrentNode();
    } else {
        this.ui.showMainInterface();
    }
    this.saveGame();
};

Game.prototype.explore = function(locationId) {
    var location = LOCATIONS[locationId];
    if (!location) { this.ui.showMessage("Location not found."); return; }
    if (!location.accessible) { this.ui.showMessage("This area is not yet accessible."); return; }
    if (location.enemies && location.enemies.length > 0) {
        var enemyId = location.enemies[Math.floor(Math.random() * location.enemies.length)];
        this.pendingChoice = null;
        this.startCombat(enemyId);
    } else {
        this.ui.showMessage("The area is quiet... for now.");
    }
};

Game.prototype.openShop = function(shopId) {
    var shop = SHOP_INVENTORIES[shopId];
    if (!shop) { this.ui.showMessage("Shop not found."); return; }
    this.ui.showShop(shop);
};

Game.prototype.buyItem = function(itemId, price) {
    if (this.character.gold < price) { this.ui.showMessage("Not enough gold!"); return; }
    if (this.character.inventory.length >= this.character.maxInventory) { this.ui.showMessage("Inventory full!"); return; }
    this.character.gold -= price;
    this.inventory.addItem(itemId);
    this.ui.showNotification("Purchased " + ((ITEMS[itemId] || WEAPONS[itemId] || {}).name || itemId) + "!");
    this.openShop("millbrook");
    this.saveGame();
};

Game.prototype.openFishing = function(locationId) {
    this.fishing.goFishing(locationId);
};

Game.prototype.castLine = function() {
    var result = this.fishing.cast();
    this.ui.showFishingResult(result);
    if (result.legendary && result.combat) {
        var self = this;
        setTimeout(function() { self.startCombat(result.combat); }, 2000);
    }
    this.saveGame();
};

Game.prototype.continueFishing = function() {
    if (this.fishing.currentLocation) {
        this.ui.showFishingInterface(this.fishing.currentLocation);
    } else {
        this.ui.showMainInterface();
    }
};

Game.prototype.sellFish = function(fishName, quantity) {
    var result = this.fishing.sellFish(fishName, quantity);
    if (result.success) {
        this.ui.showNotification("Sold for " + result.gold + " gold!");
        this.ui.showFishingInventory();
    }
    this.saveGame();
};

Game.prototype.equipRod = function(rodId) {
    this.fishing.equipRod(rodId);
    this.ui.showFishingEquipment();
};

Game.prototype.openGambling = function(locationId) {
    this.currentGamblingLocation = locationId;
    var location = GAMBLING_LOCATIONS[locationId];
    if (!location) { this.ui.showMessage("Location not found."); return; }
    this.ui.showGamblingLocation(location);
};

Game.prototype.selectGamblingGame = function(gameId) {
    this.currentGamblingGame = gameId;
    var gameData = GAMBLING_GAMES[gameId];
    if (gameData) this.ui.showGamblingGame(gameData);
};

Game.prototype.playGamblingGame = function() {
    var betInput = document.getElementById("bet-amount");
    var bet = betInput ? parseInt(betInput.value) : 10;
    var gameData = GAMBLING_GAMES[this.currentGamblingGame];
    if (!gameData) return;

    var startResult = this.gambling.startGame(this.currentGamblingGame, null, bet);
    if (!startResult.success) { this.ui.showMessage(startResult.message); return; }

    var result;
    switch (this.currentGamblingGame) {
        case "liars_dice":
            result = this.gambling.playLiarsDice();
            break;
        case "fates_hand":
            result = this.gambling.playFatesHand("start");
            if (result.continue) { this.ui.showFatesHandUI(result.state); return; }
            break;
        case "wheel_of_misfortune":
            result = this.gambling.spinWheel();
            break;
        case "death_dealer":
            result = this.gambling.playDeathDealer();
            break;
        case "knucklebones":
            result = this.gambling.playLiarsDice();
            break;
        default:
            result = { won: false, message: "Game not implemented.", amount: bet };
    }

    this.ui.showGamblingResult(result);
    this.saveGame();
};

Game.prototype.fatesHandAction = function(action) {
    var result = this.gambling.playFatesHand(action);
    if (result.continue) {
        this.ui.showFatesHandUI(result.state);
    } else {
        this.ui.showGamblingResult(result);
        this.saveGame();
    }
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

Game.prototype.allocateStat = function(stat) {
    if (this.character.allocateStat(stat)) {
        this.ui.showCharacterSheet(this.character);
        this.saveGame();
    }
};

Game.prototype.rest = function() {
    this.character.fullHeal();
    this.ui.showNotification("You rest and recover fully.");
    this.ui.showMainInterface();
    this.saveGame();
};

Game.prototype.saveGame = function() {
    try {
        var saveData = {
            character: this.character,
            currentNode: this.currentNode,
            quests: { activeQuests: this.quests.activeQuests, completedQuests: this.quests.completedQuests },
            fishing: { fishCaught: this.fishing.fishCaught, totalCatches: this.fishing.totalCatches, equipped: this.fishing.equipped },
            gambling: { gamesPlayed: this.gambling.gamesPlayed, totalWon: this.gambling.totalWon, totalLost: this.gambling.totalLost }
        };
        localStorage.setItem("eldoria_save", JSON.stringify(saveData));
    } catch (e) { console.error("Save failed:", e); }
};

Game.prototype.loadGame = function() {
    try {
        var saveStr = localStorage.getItem("eldoria_save");
        if (!saveStr) return false;
        var saveData = JSON.parse(saveStr);
        if (saveData.character) {
            this.character = new Character(saveData.character.name, saveData.character.characterClass, saveData.character.difficulty);
            Object.assign(this.character, saveData.character);
            this.currentNode = saveData.currentNode;
            if (saveData.quests) {
                this.quests.activeQuests = saveData.quests.activeQuests || {};
                this.quests.completedQuests = saveData.quests.completedQuests || [];
            }
            if (saveData.fishing) {
                this.fishing.fishCaught = saveData.fishing.fishCaught || {};
                this.fishing.totalCatches = saveData.fishing.totalCatches || 0;
                this.fishing.equipped = saveData.fishing.equipped || { rod: "basic_rod", bait: null };
            }
            if (saveData.gambling) {
                this.gambling.gamesPlayed = saveData.gambling.gamesPlayed || 0;
                this.gambling.totalWon = saveData.gambling.totalWon || 0;
                this.gambling.totalLost = saveData.gambling.totalLost || 0;
            }
            var continueBtn = document.getElementById("continue-btn");
            if (continueBtn) {
                continueBtn.disabled = false;
                continueBtn.onclick = function() { game.continueGame(); };
            }
            return true;
        }
    } catch (e) { console.error("Load failed:", e); }
    return false;
};

Game.prototype.continueGame = function() {
    if (this.character) this.displayCurrentNode();
};

var game;
window.onload = function() {
    game = new Game();
    game.init();
};
