function FishingEngine(game) {
    this.game = game;
    this.currentLocation = null;
    this.fishCaught = {};
    this.totalCatches = 0;
    this.equipped = { rod: "basic_rod", bait: null };
}

FishingEngine.prototype.goFishing = function(locationId) {
    var location = FISHING_LOCATIONS[locationId];
    if (!location) return { success: false, message: "Unknown fishing location." };
    if (!location.unlocked && location.unlockRequirement) {
        if (location.unlockRequirement.quest && !this.game.quests.isQuestCompleted(location.unlockRequirement.quest)) {
            return { success: false, message: "This location is locked." };
        }
    }
    this.currentLocation = location;
    this.game.ui.showFishingInterface(location);
    return { success: true };
};

FishingEngine.prototype.cast = function() {
    if (!this.currentLocation) return { success: false, message: "Not at a fishing location." };
    var location = this.currentLocation;
    var rodBonus = FISHING_EQUIPMENT[this.equipped.rod] ? FISHING_EQUIPMENT[this.equipped.rod].bonus : 0;
    var catchChance = location.catchRate + (rodBonus * 0.05) + (this.game.character.getEffectiveStat("luck") * 0.01);

    if (Math.random() > catchChance) return { success: false, message: "The fish got away..." };

    var rarity = this.rollRarity(location.rarityWeights, rodBonus);
    var possibleFish = location.fish.filter(function(fId) { return FISH[fId] && FISH[fId].rarity === rarity; });
    if (possibleFish.length === 0) possibleFish = location.fish.filter(function(fId) { return FISH[fId] && FISH[fId].rarity === "common"; });

    var fishId = possibleFish[Math.floor(Math.random() * possibleFish.length)];
    var fish = FISH[fishId];
    if (!fish) return { success: false, message: "Something strange happened..." };

    var isNew = !this.fishCaught[fish.name];
    this.fishCaught[fish.name] = (this.fishCaught[fish.name] || 0) + 1;
    this.totalCatches++;

    if (fish.combat) {
        return { success: true, fish: fish, legendary: true, combat: fish.combat, message: "You've hooked " + fish.name + "! It fights back!" };
    }

    return { success: true, fish: fish, isNew: isNew };
};

FishingEngine.prototype.rollRarity = function(weights, bonus) {
    var total = weights.common + weights.uncommon + weights.rare + weights.legendary;
    var roll = Math.random() * total - (bonus * 2);
    if (roll < weights.legendary) return "legendary";
    roll -= weights.legendary;
    if (roll < weights.rare) return "rare";
    roll -= weights.rare;
    if (roll < weights.uncommon) return "uncommon";
    return "common";
};

FishingEngine.prototype.sellFish = function(fishName, quantity) {
    if (!this.fishCaught[fishName] || this.fishCaught[fishName] < quantity) return { success: false };
    var fish = null;
    for (var id in FISH) { if (FISH[id].name === fishName) { fish = FISH[id]; break; } }
    if (!fish) return { success: false };
    var gold = fish.value * quantity;
    this.fishCaught[fishName] -= quantity;
    this.game.character.gold += gold;
    return { success: true, gold: gold };
};

FishingEngine.prototype.equipRod = function(rodId) {
    if (FISHING_EQUIPMENT[rodId]) this.equipped.rod = rodId;
};

FishingEngine.prototype.getStats = function() {
    var unique = 0, total = Object.keys(FISH).length;
    for (var name in this.fishCaught) if (this.fishCaught[name] > 0) unique++;
    return { totalCatches: this.totalCatches, uniqueFish: unique, totalFishTypes: total, completionPercent: Math.floor((unique / total) * 100) };
};
