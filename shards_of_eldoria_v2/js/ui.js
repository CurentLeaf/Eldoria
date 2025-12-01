function GameUI(game) {
    this.game = game;
    this.container = document.getElementById("game-container");
    this.selectedClass = "warrior";
    this.selectedDifficulty = "normal";
}

GameUI.prototype.setContent = function(html) {
    this.container.innerHTML = html;
};

GameUI.prototype.showTitleScreen = function() {
    var html = '<div class="title-screen">' +
        '<div class="title-content">' +
        '<h1 class="game-title">⚔️ Shards of Eldoria ⚔️</h1>' +
        '<p class="subtitle">A Dark Fantasy RPG</p>' +
        '<div class="title-buttons">' +
        '<button class="btn btn-primary btn-large" onclick="game.ui.showNewGameScreen()">New Game</button>' +
        '<button class="btn btn-secondary btn-large" id="continue-btn" disabled>Continue</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    this.setContent(html);
};

GameUI.prototype.showNewGameScreen = function() {
    var html = '<div class="new-game-screen">' +
        '<h2>Create Your Character</h2>' +
        '<div class="form-group">' +
        '<label>Name:</label>' +
        '<input type="text" id="char-name" class="input-field" placeholder="Enter your name" maxlength="20">' +
        '</div>' +
        '<div class="form-group">' +
        '<label>Class:</label>' +
        '<div class="class-selection">' +
        '<div class="class-card selected" onclick="game.ui.selectClass(this, \'warrior\')">' +
        '<div class="class-icon">⚔️</div>' +
        '<div class="class-name">Warrior</div>' +
        '<div class="class-desc">Master of combat. High health and strength. Wields heavy weapons.</div>' +
        '<div class="class-stats">+4 STR, +3 VIT, +20 HP</div>' +
        '</div>' +
        '<div class="class-card" onclick="game.ui.selectClass(this, \'mage\')">' +
        '<div class="class-icon">🔮</div>' +
        '<div class="class-name">Mage</div>' +
        '<div class="class-desc">Wielder of arcane power. Devastating magic but fragile.</div>' +
        '<div class="class-stats">+4 INT, +2 LUCK, -10 HP</div>' +
        '</div>' +
        '<div class="class-card" onclick="game.ui.selectClass(this, \'rogue\')">' +
        '<div class="class-icon">🗡️</div>' +
        '<div class="class-name">Rogue</div>' +
        '<div class="class-desc">Swift and deadly. Critical hits and dodges.</div>' +
        '<div class="class-stats">+4 AGI, +2 LUCK, 15% Dodge</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>Difficulty:</label>' +
        '<div class="difficulty-selection">' +
        '<div class="diff-option selected" onclick="game.ui.selectDifficulty(this, \'normal\')">' +
        '<strong>Normal</strong>' +
        '<span>Standard experience. Death is a setback.</span>' +
        '</div>' +
        '<div class="diff-option" onclick="game.ui.selectDifficulty(this, \'hard\')">' +
        '<strong>Hard</strong>' +
        '<span>-20% HP, +30% damage taken, +20% XP gain.</span>' +
        '</div>' +
        '<div class="diff-option" onclick="game.ui.selectDifficulty(this, \'nightmare\')">' +
        '<strong>☠️ Nightmare</strong>' +
        '<span>-40% HP, +50% damage. PERMADEATH - one life only.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="button-row">' +
        '<button class="btn btn-secondary" onclick="game.ui.showTitleScreen()">Back</button>' +
        '<button class="btn btn-primary" onclick="game.ui.startNewGame()">Begin Journey</button>' +
        '</div>' +
        '</div>';
    this.setContent(html);
    this.selectedClass = "warrior";
    this.selectedDifficulty = "normal";
};

GameUI.prototype.selectClass = function(element, className) {
    var cards = document.querySelectorAll(".class-card");
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.remove("selected");
    }
    element.classList.add("selected");
    this.selectedClass = className;
};

GameUI.prototype.selectDifficulty = function(element, diff) {
    var options = document.querySelectorAll(".diff-option");
    for (var i = 0; i < options.length; i++) {
        options[i].classList.remove("selected");
    }
    element.classList.add("selected");
    this.selectedDifficulty = diff;
};

GameUI.prototype.startNewGame = function() {
    var nameInput = document.getElementById("char-name");
    var name = nameInput ? nameInput.value.trim() : "";
    if (!name) name = "Wanderer";
    this.game.newGame(name, this.selectedClass, this.selectedDifficulty);
};

GameUI.prototype.renderHeader = function() {
    var char = this.game.character;
    if (!char) return "";

    return '<div class="game-header">' +
        '<div class="char-info">' +
        '<span class="char-name">' + char.name + '</span>' +
        '<span class="char-class">' + char.characterClass + ' Lv.' + char.level + '</span>' +
        '</div>' +
        '<div class="char-resources">' +
        '<span class="health">❤️ ' + char.baseStats.health + '/' + char.baseStats.maxHealth + '</span>' +
        '<span class="gold">💰 ' + char.gold + '</span>' +
        '<span class="xp">⭐ ' + char.xp + '/' + char.xpToLevel + '</span>' +
        '</div>' +
        '<div class="header-buttons">' +
        '<button class="btn-icon" onclick="game.showQuests()" title="Quests">📜</button>' +
        '<button class="btn-icon" onclick="game.showInventory()" title="Inventory">🎒</button>' +
        '<button class="btn-icon" onclick="game.showCharacter()" title="Character">👤</button>' +
        '</div>' +
        '</div>';
};

GameUI.prototype.displayStoryNode = function(node) {
    if (node.text === "SHOW_MAIN_INTERFACE") {
        this.showMainInterface();
        return;
    }

    var choicesHtml = "";
    if (node.choices && node.choices.length > 0) {
        choicesHtml = '<div class="choices">';
        for (var i = 0; i < node.choices.length; i++) {
            var choice = node.choices[i];
            var disabled = "";
            var tooltip = "";

            if (choice.check) {
                var statValue = this.game.character.getEffectiveStat(choice.check.stat);
                if (statValue < choice.check.dc) {
                    disabled = "disabled";
                    tooltip = " [Requires " + choice.check.dc + " " + choice.check.stat.toUpperCase() + "]";
                } else {
                    tooltip = " [" + choice.check.stat.toUpperCase() + " " + choice.check.dc + " ✓]";
                }
            }

            choicesHtml += '<button class="choice-btn" onclick="game.makeChoice(' + i + ')" ' + disabled + '>' +
                choice.text + tooltip + '</button>';
        }
        choicesHtml += '</div>';
    }

    var titleHtml = node.title ? '<h2 class="chapter-title">' + node.title + '</h2>' : '';
    var textFormatted = node.text.replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br>');

    var html = '<div class="story-screen">' +
        this.renderHeader() +
        '<div class="story-content">' +
        titleHtml +
        '<div class="story-text"><p>' + textFormatted + '</p></div>' +
        choicesHtml +
        '</div>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showCombatInterface = function(enemy) {
    var char = this.game.character;
    var healthPercent = Math.max(0, (char.baseStats.health / char.baseStats.maxHealth) * 100);
    var enemyHealthPercent = Math.max(0, (enemy.stats.health / enemy.stats.maxHealth) * 100);

    var skillDisabled = char.specialCooldown > 0 ? "disabled" : "";
    var skillText = char.skills.active.name;
    if (char.specialCooldown > 0) {
        skillText += " (" + char.specialCooldown + ")";
    }

    var fleeDisabled = enemy.isBoss ? "disabled" : "";

    var html = '<div class="combat-screen">' +
        this.renderHeader() +
        '<div class="combat-arena">' +
        '<div class="enemy-section">' +
        '<div class="enemy-display">' +
        '<span class="enemy-icon">' + enemy.icon + '</span>' +
        '<div class="enemy-info">' +
        '<h3>' + enemy.name + (enemy.isBoss ? ' 👑' : '') + '</h3>' +
        '<div class="enemy-level">Level ' + enemy.level + '</div>' +
        '<div class="health-bar enemy-health">' +
        '<div class="health-fill" style="width:' + enemyHealthPercent + '%"></div>' +
        '<span class="health-text">' + enemy.stats.health + '/' + enemy.stats.maxHealth + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<p class="enemy-desc">' + (enemy.description || '') + '</p>' +
        '</div>' +
        '<div class="combat-log" id="combat-log"></div>' +
        '<div class="player-section">' +
        '<div class="health-bar player-health">' +
        '<div class="health-fill" style="width:' + healthPercent + '%"></div>' +
        '<span class="health-text">' + char.baseStats.health + '/' + char.baseStats.maxHealth + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="combat-actions">' +
        '<button class="btn btn-danger" onclick="game.playerCombatAction(\'attack\')">⚔️ Attack</button>' +
        '<button class="btn btn-magic" onclick="game.playerCombatAction(\'skill\')" ' + skillDisabled + '>✨ ' + skillText + '</button>' +
        '<button class="btn btn-secondary" onclick="game.ui.showCombatItems()">🎒 Items</button>' +
        '<button class="btn btn-flee" onclick="game.playerCombatAction(\'flee\')" ' + fleeDisabled + '>🏃 Flee</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showCombatItems = function() {
    var items = this.game.inventory.getInventoryDisplay();
    var consumables = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].data && items[i].data.type === "consumable") {
            consumables.push(items[i]);
        }
    }

    var html = '<div class="combat-items">';
    for (var j = 0; j < consumables.length; j++) {
        var item = consumables[j];
        html += '<button class="btn btn-secondary" onclick="game.useCombatItem(\'' + item.id + '\')">' +
            item.data.icon + ' ' + item.data.name + ' (x' + item.quantity + ')' +
            '</button>';
    }
    html += '<button class="btn btn-secondary" onclick="game.ui.showCombatInterface(game.combat.currentEnemy)">Cancel</button>';
    html += '</div>';

    document.querySelector(".combat-actions").innerHTML = html;
};

GameUI.prototype.updateCombat = function(result) {
    if (!result) return;

    var log = document.getElementById("combat-log");
    if (log && result.log) {
        var logHtml = "";
        for (var i = 0; i < result.log.length; i++) {
            var entry = result.log[i];
            var className = "log-entry";
            if (entry.type === "player_attack") className += " log-player";
            if (entry.type === "enemy_attack") className += " log-enemy";
            if (entry.type === "heal") className += " log-heal";
            if (entry.type === "boss_phase") className += " log-boss";
            logHtml += '<div class="' + className + '">' + entry.text + '</div>';
        }
        log.innerHTML = logHtml;
        log.scrollTop = log.scrollHeight;
    }

    var char = this.game.character;
    var playerFill = document.querySelector(".player-health .health-fill");
    var playerText = document.querySelector(".player-health .health-text");
    if (playerFill && playerText) {
        var pPercent = Math.max(0, (char.baseStats.health / char.baseStats.maxHealth) * 100);
        playerFill.style.width = pPercent + "%";
        playerText.textContent = char.baseStats.health + "/" + char.baseStats.maxHealth;
    }

    if (this.game.combat.currentEnemy) {
        var enemy = this.game.combat.currentEnemy;
        var enemyFill = document.querySelector(".enemy-health .health-fill");
        var enemyText = document.querySelector(".enemy-health .health-text");
        if (enemyFill && enemyText) {
            var ePercent = Math.max(0, (enemy.stats.health / enemy.stats.maxHealth) * 100);
            enemyFill.style.width = ePercent + "%";
            enemyText.textContent = Math.max(0, enemy.stats.health) + "/" + enemy.stats.maxHealth;
        }
    }
};

GameUI.prototype.showCombatVictory = function(result) {
    var lootHtml = "";
    if (result.loot && result.loot.length > 0) {
        lootHtml = '<div class="loot-list"><h4>Loot:</h4><ul>';
        for (var i = 0; i < result.loot.length; i++) {
            var itemId = result.loot[i];
            var item = ITEMS[itemId] || WEAPONS[itemId];
            var name = item ? item.name : itemId;
            var icon = item ? (item.icon || "📦") : "📦";
            lootHtml += '<li>' + icon + ' ' + name + '</li>';
        }
        lootHtml += '</ul></div>';
    }

    var levelUpHtml = result.levelUp ? '<p class="level-up">🎉 Level Up! Now level ' + result.newLevel + '!</p>' : '';

    var html = '<div class="combat-result victory">' +
        '<h2>⚔️ Victory! ⚔️</h2>' +
        '<div class="rewards">' +
        '<p>+' + result.xp + ' XP</p>' +
        '<p>+' + result.gold + ' Gold</p>' +
        lootHtml +
        levelUpHtml +
        '</div>' +
        '<button class="btn btn-primary" onclick="game.afterCombat(true)">Continue</button>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showCombatDefeat = function(result) {
    if (result.permadeath) {
        this.showGameOver(result);
        return;
    }

    var html = '<div class="combat-result defeat">' +
        '<h2>💀 Defeated 💀</h2>' +
        '<p class="death-message">' + result.deathMessage + '</p>' +
        '<p>Lost ' + result.goldLost + ' gold.</p>' +
        '<p>You wake up back at the village, wounded but alive.</p>' +
        '<button class="btn btn-primary" onclick="game.afterCombat(false)">Continue</button>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showGameOver = function(result) {
    var html = '<div class="game-over">' +
        '<h1>☠️ GAME OVER ☠️</h1>' +
        '<p class="death-message">' + (result.deathMessage || "Your journey has ended.") + '</p>' +
        '<p class="permadeath-warning">The darkness claims another soul. Your story ends here.</p>' +
        '<button class="btn btn-primary" onclick="game.ui.showTitleScreen()">Return to Title</button>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showMainInterface = function() {
    var char = this.game.character;

    var html = '<div class="main-interface">' +
        this.renderHeader() +
        '<div class="main-content">' +
        '<div class="action-panel">' +
        '<h3>What would you like to do?</h3>' +
        '<div class="action-buttons">' +
        '<button class="btn btn-action" onclick="game.explore(\'dark_forest\')">🌲 Explore the Dark Forest</button>' +
        '<button class="btn btn-action" onclick="game.showQuests()">📜 Quest Log</button>' +
        '<button class="btn btn-action" onclick="game.showInventory()">🎒 Inventory</button>' +
        '<button class="btn btn-action" onclick="game.showCharacter()">👤 Character Sheet</button>' +
        '<button class="btn btn-action" onclick="game.openShop(\'millbrook\')">🛒 Visit Shop</button>' +
        '<button class="btn btn-action" onclick="game.rest()">🏕️ Rest & Heal</button>' +
        '</div>' +
        '</div>' +
        '<div class="location-info">' +
        '<h3>📍 Current Location: Millbrook (Ruins)</h3>' +
        '<p>The burned remnants of your first home in this strange new life. Survivors work to rebuild.</p>' +
        '</div>' +
        '</div>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showQuestLog = function(quests) {
    var mainQuests = quests.getActiveQuests("main");
    var sideQuests = quests.getActiveQuests("side");

    var questHtml = '<div class="quest-list">';

    if (mainQuests.length > 0) {
        questHtml += '<h3>⚔️ Main Quests</h3>';
        for (var i = 0; i < mainQuests.length; i++) {
            questHtml += this.renderQuestEntry(mainQuests[i]);
        }
    }

    if (sideQuests.length > 0) {
        questHtml += '<h3>📌 Side Quests</h3>';
        for (var j = 0; j < sideQuests.length; j++) {
            questHtml += this.renderQuestEntry(sideQuests[j]);
        }
    }

    if (mainQuests.length === 0 && sideQuests.length === 0) {
        questHtml += '<p class="no-quests">No active quests. Explore to find adventure!</p>';
    }

    questHtml += '</div>';

    var html = '<div class="quest-screen">' +
        this.renderHeader() +
        '<h2>📜 Quest Log</h2>' +
        questHtml +
        '<button class="btn btn-secondary" onclick="game.ui.showMainInterface()">Back</button>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.renderQuestEntry = function(quest) {
    var progress = this.game.quests.getQuestProgress(quest.id);

    var objectivesHtml = '<ul class="objectives">';
    for (var i = 0; i < quest.objectives.length; i++) {
        var obj = quest.objectives[i];
        var status = obj.completed ? "✅" : "⬜";
        var completed = obj.completed ? " completed" : "";
        objectivesHtml += '<li class="' + completed + '">' + status + ' ' + obj.text + '</li>';
    }
    objectivesHtml += '</ul>';

    return '<div class="quest-entry ' + quest.type + '">' +
        '<div class="quest-header">' +
        '<h4>' + quest.title + '</h4>' +
        '<span class="quest-progress">' + progress.completed + '/' + progress.total + '</span>' +
        '</div>' +
        '<p class="quest-desc">' + quest.description + '</p>' +
        objectivesHtml +
        '</div>';
};

GameUI.prototype.showInventory = function(items) {
    var char = this.game.character;

    var equipHtml = '<div class="equipment-section">' +
        '<h3>⚔️ Equipment</h3>' +
        '<div class="equipment-slots">' +
        this.renderEquipSlot("weapon", char.equipment.weapon) +
        this.renderEquipSlot("armor", char.equipment.armor) +
        this.renderEquipSlot("accessory", char.equipment.accessory) +
        '</div>' +
        '</div>';

    var invHtml = '<div class="inventory-grid">';
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var icon = item.data ? (item.data.icon || "📦") : "📦";
        var name = item.data ? item.data.name : item.id;
        var qty = item.quantity > 1 ? '<span class="item-qty">x' + item.quantity + '</span>' : '';

        invHtml += '<div class="inventory-item" onclick="game.ui.showItemOptions(\'' + item.id + '\')">' +
            '<span class="item-icon">' + icon + '</span>' +
            '<span class="item-name">' + name + '</span>' +
            qty +
            '</div>';
    }
    invHtml += '</div>';

    var html = '<div class="inventory-screen">' +
        this.renderHeader() +
        '<h2>🎒 Inventory (' + items.length + '/' + char.maxInventory + ')</h2>' +
        equipHtml +
        invHtml +
        '<button class="btn btn-secondary" onclick="game.ui.showMainInterface()">Back</button>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.renderEquipSlot = function(slot, itemId) {
    var item = itemId ? (ITEMS[itemId] || WEAPONS[itemId]) : null;
    var content = item ? (item.icon + ' ' + item.name) : 'Empty';
    var emptyClass = item ? '' : 'empty';

    return '<div class="equip-slot">' +
        '<div class="slot-label">' + slot.charAt(0).toUpperCase() + slot.slice(1) + '</div>' +
        '<div class="slot-item ' + emptyClass + '">' + content + '</div>' +
        '</div>';
};

GameUI.prototype.showItemOptions = function(itemId) {
    var item = ITEMS[itemId] || WEAPONS[itemId];
    if (!item) return;

    var options = '';
    if (item.type === "consumable") {
        options += '<button class="btn btn-primary" onclick="game.useItem(\'' + itemId + '\')">Use</button>';
    } else if (item.type === "armor" || WEAPONS[itemId]) {
        var slot = WEAPONS[itemId] ? "weapon" : "armor";
        options += '<button class="btn btn-primary" onclick="game.equipItem(\'' + itemId + '\', \'' + slot + '\')">Equip</button>';
    }

    alert(item.name + "\n" + (item.description || "") + "\n\nValue: " + (item.value || 0) + " gold");
};

GameUI.prototype.showCharacterSheet = function(char) {
    var stats = ["strength", "intelligence", "agility", "vitality", "luck"];

    var statsHtml = '<div class="stats-grid">';
    for (var i = 0; i < stats.length; i++) {
        var stat = stats[i];
        var value = char.getEffectiveStat(stat);
        var base = char.baseStats[stat];
        var bonus = value - base;
        var bonusText = bonus !== 0 ? ' <span class="' + (bonus > 0 ? 'bonus' : 'penalty') + '">(' + (bonus > 0 ? '+' : '') + bonus + ')</span>' : '';

        var allocBtn = '';
        if (char.statPoints > 0) {
            allocBtn = '<button class="btn-tiny" onclick="game.allocateStat(\'' + stat + '\')">+</button>';
        }

        statsHtml += '<div class="stat-row">' +
            '<span class="stat-name">' + stat.toUpperCase() + '</span>' +
            '<span class="stat-value">' + value + bonusText + '</span>' +
            allocBtn +
            '</div>';
    }
    statsHtml += '</div>';

    var statPointsHtml = char.statPoints > 0 ? '<p class="stat-points">🔵 ' + char.statPoints + ' stat points available!</p>' : '';

    var html = '<div class="character-screen">' +
        this.renderHeader() +
        '<h2>👤 ' + char.name + '</h2>' +
        '<div class="char-overview">' +
        '<span class="class-badge">' + char.characterClass + '</span>' +
        '<p>Level ' + char.level + ' | ' + char.xp + '/' + char.xpToLevel + ' XP</p>' +
        statPointsHtml +
        '</div>' +
        '<h3>📊 Stats</h3>' +
        statsHtml +
        '<h3>⚡ Skills</h3>' +
        '<div class="skills-list">' +
        '<div class="skill-entry">' +
        '<strong>' + char.skills.active.name + '</strong>' +
        '<p>' + char.skills.active.description + '</p>' +
        '</div>' +
        '<div class="skill-entry passive">' +
        '<strong>' + char.skills.passive.name + '</strong>' +
        '<p>' + char.skills.passive.description + '</p>' +
        '</div>' +
        '</div>' +
        '<h3>📈 Progress</h3>' +
        '<p>Total Kills: ' + char.totalKills + ' | Deaths: ' + char.deaths + '</p>' +
        '<p>Karma: ' + (char.karma >= 0 ? '😇' : '😈') + ' ' + char.karma + '</p>' +
        '<button class="btn btn-secondary" onclick="game.ui.showMainInterface()">Back</button>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showShop = function(shop) {
    var char = this.game.character;

    var itemsHtml = '<div class="shop-items">';
    for (var i = 0; i < shop.items.length; i++) {
        var shopItem = shop.items[i];
        var item = ITEMS[shopItem.id] || WEAPONS[shopItem.id];
        if (!item) continue;

        var canAfford = char.gold >= shopItem.price;
        var affordClass = canAfford ? '' : 'unaffordable';
        var disabled = canAfford ? '' : 'disabled';

        itemsHtml += '<div class="shop-item ' + affordClass + '">' +
            '<span class="item-icon">' + (item.icon || "📦") + '</span>' +
            '<div class="item-info">' +
            '<span class="item-name">' + item.name + '</span>' +
            '<span class="item-desc">' + (item.description || "").substring(0, 50) + '</span>' +
            '</div>' +
            '<div class="item-price">💰 ' + shopItem.price + '</div>' +
            '<button class="btn btn-small btn-primary" onclick="game.buyItem(\'' + shopItem.id + '\', ' + shopItem.price + ')" ' + disabled + '>Buy</button>' +
            '</div>';
    }
    itemsHtml += '</div>';

    var html = '<div class="shop-screen">' +
        this.renderHeader() +
        '<h2>🛒 ' + shop.name + '</h2>' +
        itemsHtml +
        '<button class="btn btn-secondary" onclick="game.ui.showMainInterface()">Leave Shop</button>' +
        '</div>';

    this.setContent(html);
};

GameUI.prototype.showMessage = function(msg) {
    alert(msg);
};

GameUI.prototype.showNotification = function(msg) {
    var notif = document.createElement("div");
    notif.className = "notification";
    notif.textContent = msg;
    document.body.appendChild(notif);

    setTimeout(function() {
        notif.classList.add("fade-out");
        setTimeout(function() {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 500);
    }, 3000);
};
