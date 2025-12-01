function CombatEngine(game) {
    this.game = game;
    this.inCombat = false;
    this.currentEnemy = null;
    this.turn = 0;
    this.combatLog = [];
}

CombatEngine.prototype.startCombat = function(enemyId) {
    var enemyData = ENEMIES[enemyId];
    if (!enemyData) {
        console.error("Enemy not found:", enemyId);
        return null;
    }

    this.currentEnemy = {
        id: enemyData.id,
        name: enemyData.name,
        icon: enemyData.icon,
        level: enemyData.level,
        description: enemyData.description,
        stats: {
            health: enemyData.stats.health,
            maxHealth: enemyData.stats.maxHealth,
            strength: enemyData.stats.strength,
            defense: enemyData.stats.defense,
            agility: enemyData.stats.agility
        },
        xpReward: enemyData.xpReward,
        goldReward: enemyData.goldReward,
        loot: enemyData.loot || [],
        isBoss: enemyData.isBoss || false,
        phases: enemyData.phases || [],
        currentPhase: 0
    };

    this.inCombat = true;
    this.turn = 0;
    this.combatLog = [];

    this.combatLog.push({
        text: "A " + this.currentEnemy.name + " attacks!",
        type: "system"
    });

    return this.currentEnemy;
};

CombatEngine.prototype.playerAttack = function(useSkill) {
    if (!this.inCombat) return null;

    this.turn++;
    var char = this.game.character;
    var enemy = this.currentEnemy;

    var damage = this.calculatePlayerDamage(useSkill);

    // Check for critical hit
    var critChance = 0.05 + (char.getEffectiveStat("luck") * 0.02);
    if (char.characterClass === "mage") {
        critChance += char.getEffectiveStat("intelligence") * 0.01;
    }

    var isCrit = Math.random() < critChance;
    if (isCrit) {
        damage = Math.floor(damage * 1.5);
    }

    enemy.stats.health -= damage;

    if (useSkill) {
        char.specialCooldown = char.skills.active.cooldown;
        this.combatLog.push({
            text: char.skills.active.name + "! " + damage + " damage!" + (isCrit ? " CRITICAL!" : ""),
            type: "player_attack"
        });
    } else {
        this.combatLog.push({
            text: "You attack for " + damage + " damage!" + (isCrit ? " CRITICAL!" : ""),
            type: "player_attack"
        });
    }

    // Check boss phases
    if (enemy.isBoss && enemy.phases.length > 0) {
        var healthPercent = enemy.stats.health / enemy.stats.maxHealth;
        var phase = enemy.phases[enemy.currentPhase];
        if (phase && healthPercent <= phase.threshold) {
            this.combatLog.push({ text: phase.message, type: "boss_phase" });
            enemy.currentPhase++;
            enemy.stats.strength += 2;
        }
    }

    if (enemy.stats.health <= 0) {
        return this.endCombat(true);
    }

    return this.enemyTurn();
};

CombatEngine.prototype.calculatePlayerDamage = function(useSkill) {
    var char = this.game.character;
    var baseDamage = char.getEffectiveStat("strength");

    var weaponId = char.equipment.weapon;
    if (weaponId && WEAPONS[weaponId]) {
        baseDamage += WEAPONS[weaponId].damage;
    }

    // Mages use intelligence instead
    if (char.characterClass === "mage") {
        baseDamage = Math.max(baseDamage, char.getEffectiveStat("intelligence"));
    }

    if (useSkill && char.skills.active) {
        baseDamage = Math.floor(baseDamage * char.skills.active.multiplier);
    }

    // Randomize slightly
    baseDamage = Math.floor(baseDamage * (0.85 + Math.random() * 0.3));

    return Math.max(1, baseDamage);
};

CombatEngine.prototype.enemyTurn = function() {
    var char = this.game.character;
    var enemy = this.currentEnemy;

    var baseDamage = enemy.stats.strength;
    baseDamage = Math.floor(baseDamage * (0.85 + Math.random() * 0.3));

    var result = char.takeDamage(baseDamage);

    if (result.dodged) {
        this.combatLog.push({
            text: enemy.name + " attacks but you dodge!",
            type: "enemy_attack"
        });
    } else {
        this.combatLog.push({
            text: enemy.name + " hits you for " + result.damage + " damage!",
            type: "enemy_attack"
        });
    }

    if (char.specialCooldown > 0) {
        char.specialCooldown--;
    }

    if (!char.isAlive()) {
        return this.endCombat(false);
    }

    return {
        ongoing: true,
        playerHealth: char.baseStats.health,
        enemyHealth: enemy.stats.health,
        log: this.combatLog.slice(-6)
    };
};

CombatEngine.prototype.useItem = function(itemId) {
    var char = this.game.character;
    var item = ITEMS[itemId];

    if (!item || !this.game.inventory.hasItem(itemId)) {
        return { success: false, message: "Item not available" };
    }

    this.game.inventory.removeItem(itemId, 1);

    if (item.effect && item.effect.heal) {
        var healed = char.heal(item.effect.heal);
        this.combatLog.push({
            text: "Used " + item.name + "! Restored " + healed + " HP.",
            type: "heal"
        });
    }

    return this.enemyTurn();
};

CombatEngine.prototype.attemptFlee = function() {
    var char = this.game.character;
    var enemy = this.currentEnemy;

    if (enemy.isBoss) {
        this.combatLog.push({
            text: "You cannot flee from a boss!",
            type: "system"
        });
        return { success: false, ongoing: true, log: this.combatLog.slice(-6) };
    }

    var fleeChance = 0.3 + (char.getEffectiveStat("agility") - enemy.stats.agility) * 0.05;

    if (Math.random() < fleeChance) {
        this.inCombat = false;
        return { success: true, fled: true, ongoing: false };
    }

    this.combatLog.push({ text: "Failed to escape!", type: "system" });
    return this.enemyTurn();
};

CombatEngine.prototype.endCombat = function(victory) {
    this.inCombat = false;
    var char = this.game.character;
    var enemy = this.currentEnemy;

    if (victory) {
        var xpResult = char.addXP(enemy.xpReward);
        var goldGain = enemy.goldReward.min + Math.floor(Math.random() * (enemy.goldReward.max - enemy.goldReward.min + 1));
        char.gold += goldGain;
        char.totalKills++;

        var loot = [];
        if (enemy.loot) {
            for (var i = 0; i < enemy.loot.length; i++) {
                var drop = enemy.loot[i];
                if (Math.random() < drop.chance) {
                    this.game.inventory.addItem(drop.id);
                    loot.push(drop.id);
                }
            }
        }

        return {
            ongoing: false,
            victory: true,
            xp: enemy.xpReward,
            gold: goldGain,
            loot: loot,
            levelUp: xpResult.leveledUp,
            newLevel: xpResult.newLevel,
            log: this.combatLog
        };
    } else {
        var deathResult = char.die();
        var msg = DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];

        return {
            ongoing: false,
            victory: false,
            permadeath: deathResult.permadeath,
            goldLost: deathResult.goldLoss,
            deathMessage: msg,
            log: this.combatLog
        };
    }
};
