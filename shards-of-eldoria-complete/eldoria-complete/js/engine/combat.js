function CombatEngine(game) {
    this.game = game; this.inCombat = false; this.currentEnemy = null; this.turn = 0; this.combatLog = [];
}

CombatEngine.prototype.startCombat = function(enemyId) {
    var enemyData = ENEMIES[enemyId];
    if (!enemyData) return null;
    this.currentEnemy = {
        id: enemyData.id, name: enemyData.name, icon: enemyData.icon, level: enemyData.level, description: enemyData.description,
        stats: { health: enemyData.stats.health, maxHealth: enemyData.stats.maxHealth, strength: enemyData.stats.strength, defense: enemyData.stats.defense, agility: enemyData.stats.agility },
        xpReward: enemyData.xpReward, goldReward: enemyData.goldReward, loot: enemyData.loot || [], isBoss: enemyData.isBoss || false, phases: enemyData.phases || [], currentPhase: 0
    };
    this.inCombat = true; this.turn = 0;
    this.combatLog = [{ text: "A " + this.currentEnemy.name + " attacks!", type: "system" }];
    return this.currentEnemy;
};

CombatEngine.prototype.playerAttack = function(useSkill) {
    if (!this.inCombat) return null;
    this.turn++;
    var char = this.game.character, enemy = this.currentEnemy;
    var damage = this.calculatePlayerDamage(useSkill);
    var critChance = 0.05 + (char.getEffectiveStat("luck") * 0.02);
    if (char.characterClass === "mage") critChance += char.getEffectiveStat("intelligence") * 0.01;
    var isCrit = Math.random() < critChance;
    if (isCrit) damage = Math.floor(damage * 1.5);
    enemy.stats.health -= damage;
    if (useSkill) { char.specialCooldown = char.skills.active.cooldown; this.combatLog.push({ text: char.skills.active.name + "! " + damage + " damage!" + (isCrit ? " CRIT!" : ""), type: "player_attack" }); }
    else { this.combatLog.push({ text: "You attack for " + damage + " damage!" + (isCrit ? " CRIT!" : ""), type: "player_attack" }); }
    if (enemy.isBoss && enemy.phases.length > enemy.currentPhase) {
        var healthPercent = enemy.stats.health / enemy.stats.maxHealth;
        var phase = enemy.phases[enemy.currentPhase];
        if (phase && healthPercent <= phase.threshold) {
            this.combatLog.push({ text: phase.message, type: "boss_phase" });
            enemy.currentPhase++;
            if (phase.bonusStrength) enemy.stats.strength += phase.bonusStrength;
        }
    }
    if (enemy.stats.health <= 0) return this.endCombat(true);
    return this.enemyTurn();
};

CombatEngine.prototype.calculatePlayerDamage = function(useSkill) {
    var char = this.game.character;
    var baseDamage = char.getEffectiveStat("strength");
    var weaponId = char.equipment.weapon;
    if (weaponId && WEAPONS[weaponId]) baseDamage += WEAPONS[weaponId].damage;
    if (char.characterClass === "mage") baseDamage = Math.max(baseDamage, char.getEffectiveStat("intelligence"));
    if (useSkill && char.skills.active) baseDamage = Math.floor(baseDamage * char.skills.active.multiplier);
    return Math.max(1, Math.floor(baseDamage * (0.85 + Math.random() * 0.3)));
};

CombatEngine.prototype.enemyTurn = function() {
    var char = this.game.character, enemy = this.currentEnemy;
    var baseDamage = Math.floor(enemy.stats.strength * (0.85 + Math.random() * 0.3));
    var result = char.takeDamage(baseDamage);
    if (result.dodged) this.combatLog.push({ text: enemy.name + " attacks but you dodge!", type: "enemy_attack" });
    else this.combatLog.push({ text: enemy.name + " hits for " + result.damage + " damage!", type: "enemy_attack" });
    if (char.specialCooldown > 0) char.specialCooldown--;
    if (!char.isAlive()) return this.endCombat(false);
    return { ongoing: true, playerHealth: char.baseStats.health, enemyHealth: enemy.stats.health, log: this.combatLog.slice(-6) };
};

CombatEngine.prototype.useItem = function(itemId) {
    var char = this.game.character, item = ITEMS[itemId];
    if (!item || !this.game.inventory.hasItem(itemId)) return { success: false };
    this.game.inventory.removeItem(itemId, 1);
    if (item.effect && item.effect.heal) { var healed = char.heal(item.effect.heal); this.combatLog.push({ text: "Used " + item.name + "! +" + healed + " HP.", type: "heal" }); }
    return this.enemyTurn();
};

CombatEngine.prototype.attemptFlee = function() {
    var char = this.game.character, enemy = this.currentEnemy;
    if (enemy.isBoss) { this.combatLog.push({ text: "Cannot flee from a boss!", type: "system" }); return { success: false, ongoing: true, log: this.combatLog.slice(-6) }; }
    var fleeChance = 0.3 + (char.getEffectiveStat("agility") - enemy.stats.agility) * 0.05;
    if (Math.random() < fleeChance) { this.inCombat = false; return { success: true, fled: true, ongoing: false }; }
    this.combatLog.push({ text: "Failed to escape!", type: "system" });
    return this.enemyTurn();
};

CombatEngine.prototype.endCombat = function(victory) {
    this.inCombat = false;
    var char = this.game.character, enemy = this.currentEnemy;
    if (victory) {
        var xpResult = char.addXP(enemy.xpReward);
        var goldGain = enemy.goldReward.min + Math.floor(Math.random() * (enemy.goldReward.max - enemy.goldReward.min + 1));
        char.gold += goldGain; char.totalKills++;
        var loot = [];
        if (enemy.loot) { for (var i = 0; i < enemy.loot.length; i++) { if (Math.random() < enemy.loot[i].chance) { this.game.inventory.addItem(enemy.loot[i].id); loot.push(enemy.loot[i].id); } } }
        return { ongoing: false, victory: true, xp: enemy.xpReward, gold: goldGain, loot: loot, levelUp: xpResult.leveledUp, newLevel: xpResult.newLevel, log: this.combatLog };
    } else {
        var deathResult = char.die();
        return { ongoing: false, victory: false, permadeath: deathResult.permadeath, goldLost: deathResult.goldLoss, deathMessage: DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)], log: this.combatLog };
    }
};
