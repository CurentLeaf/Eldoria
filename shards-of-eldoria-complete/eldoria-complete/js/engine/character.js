function Character(name, characterClass, difficulty) {
    this.name = name;
    this.characterClass = characterClass;
    this.difficulty = difficulty || "normal";
    this.level = 1;
    this.xp = 0;
    this.xpToLevel = 100;
    this.gold = 30;
    this.karma = 0;
    this.statPoints = 0;
    this.baseStats = { maxHealth: 60, health: 60, strength: 5, intelligence: 5, agility: 5, vitality: 5, luck: 5, defense: 0 };
    this.equipment = { weapon: null, armor: null, accessory: null };
    this.inventory = [];
    this.maxInventory = 20;
    this.statusEffects = [];
    this.specialCooldown = 0;
    this.flags = {};
    this.totalKills = 0;
    this.deaths = 0;
    this.applyClassBonuses();
    this.applyDifficultyMods();
    this.skills = this.getStartingSkills();
}

Character.prototype.applyClassBonuses = function() {
    var bonuses = { warrior: { strength: 4, vitality: 3, maxHealth: 20 }, mage: { intelligence: 4, luck: 2, maxHealth: -10 }, rogue: { agility: 4, luck: 2 } };
    var bonus = bonuses[this.characterClass];
    if (bonus) { for (var stat in bonus) this.baseStats[stat] = (this.baseStats[stat] || 0) + bonus[stat]; this.baseStats.health = this.baseStats.maxHealth; }
};

Character.prototype.applyDifficultyMods = function() {
    if (this.difficulty === "hard") { this.baseStats.maxHealth = Math.floor(this.baseStats.maxHealth * 0.8); this.baseStats.health = this.baseStats.maxHealth; }
    else if (this.difficulty === "nightmare") { this.baseStats.maxHealth = Math.floor(this.baseStats.maxHealth * 0.6); this.baseStats.health = this.baseStats.maxHealth; this.permadeath = true; }
};

Character.prototype.getStartingSkills = function() {
    var skills = {
        warrior: { active: { id: "brutal_strike", name: "Brutal Strike", multiplier: 1.8, cooldown: 3, description: "180% damage." }, passive: { id: "iron_skin", name: "Iron Skin", description: "10% damage reduction." } },
        mage: { active: { id: "soul_burn", name: "Soul Burn", multiplier: 2.0, cooldown: 3, description: "200% magic damage." }, passive: { id: "arcane_mind", name: "Arcane Mind", description: "INT boosts crit chance." } },
        rogue: { active: { id: "backstab", name: "Backstab", multiplier: 2.5, cooldown: 2, description: "250% damage." }, passive: { id: "evasion", name: "Evasion", description: "15% dodge chance." } }
    };
    return skills[this.characterClass] || skills.warrior;
};

Character.prototype.getEffectiveStat = function(stat) {
    var value = this.baseStats[stat] || 0;
    for (var slot in this.equipment) {
        var itemId = this.equipment[slot];
        if (itemId) { var item = ITEMS[itemId] || WEAPONS[itemId]; if (item && item.stats && item.stats[stat]) value += item.stats[stat]; }
    }
    return Math.max(0, value);
};

Character.prototype.addXP = function(amount) {
    if (this.difficulty === "hard") amount = Math.floor(amount * 1.2);
    this.xp += amount;
    var result = { leveledUp: false, amount: amount };
    while (this.xp >= this.xpToLevel) {
        this.xp -= this.xpToLevel; this.level++; this.xpToLevel = Math.floor(this.xpToLevel * 1.4);
        this.statPoints += 3; this.baseStats.maxHealth += 8; this.baseStats.health = this.baseStats.maxHealth;
        result.leveledUp = true; result.newLevel = this.level;
    }
    return result;
};

Character.prototype.takeDamage = function(amount, type) {
    if (this.characterClass === "rogue" && Math.random() < 0.15) return { dodged: true, damage: 0 };
    var defense = this.getEffectiveStat("defense");
    var actualDamage = Math.max(1, amount - Math.floor(defense * 0.5));
    if (this.difficulty === "hard") actualDamage = Math.floor(actualDamage * 1.3);
    else if (this.difficulty === "nightmare") actualDamage = Math.floor(actualDamage * 1.5);
    if (this.characterClass === "warrior") actualDamage = Math.floor(actualDamage * 0.9);
    this.baseStats.health = Math.max(0, this.baseStats.health - actualDamage);
    return { dodged: false, damage: actualDamage };
};

Character.prototype.heal = function(amount) {
    var maxHealth = this.getEffectiveStat("maxHealth") || this.baseStats.maxHealth;
    var oldHealth = this.baseStats.health;
    this.baseStats.health = Math.min(maxHealth, this.baseStats.health + amount);
    return this.baseStats.health - oldHealth;
};

Character.prototype.fullHeal = function() { this.baseStats.health = this.baseStats.maxHealth; this.statusEffects = []; this.specialCooldown = 0; };
Character.prototype.isAlive = function() { return this.baseStats.health > 0; };

Character.prototype.die = function() {
    this.deaths++;
    var goldLoss = Math.floor(this.gold * 0.15);
    this.gold = Math.max(0, this.gold - goldLoss);
    if (!this.permadeath) this.baseStats.health = Math.floor(this.baseStats.maxHealth * 0.25);
    return { permadeath: this.permadeath, goldLoss: goldLoss };
};

Character.prototype.setFlag = function(flag, value) { this.flags[flag] = value; };
Character.prototype.getFlag = function(flag) { return this.flags[flag]; };

Character.prototype.allocateStat = function(stat) {
    if (this.statPoints > 0) {
        this.baseStats[stat] = (this.baseStats[stat] || 0) + 1; this.statPoints--;
        if (stat === "vitality") { this.baseStats.maxHealth += 3; this.baseStats.health += 3; }
        return true;
    }
    return false;
};
