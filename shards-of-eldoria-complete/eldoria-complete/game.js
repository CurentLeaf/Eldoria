// ui.js

function GameUI(game) {
    this.game = game;
    this.container = document.getElementById("game-container");
    this.selectedClass = "warrior";
    this.selectedDifficulty = "normal";
}

GameUI.prototype.setContent = function (html) {
    this.container.innerHTML = html;
};

GameUI.prototype.showTitleScreen = function () {
    this.setContent(
        '<div class="title-screen">' +
            '<div class="title-content">' +
            '<h1 class="game-title">⚔️ Shards of Eldoria ⚔️</h1>' +
            '<p class="subtitle">A Dark Fantasy RPG</p>' +
            '<div class="title-buttons">' +
            '<button class="btn btn-primary btn-large" onclick="game.ui.showNewGameScreen()">New Game</button>' +
            '<button class="btn btn-secondary btn-large" id="continue-btn" disabled>Continue</button>' +
            "</div></div></div>"
    );
};

GameUI.prototype.showNewGameScreen = function () {
    this.setContent(
        '<div class="new-game-screen">' +
            "<h2>Create Your Character</h2>" +
            '<div class="form-group">' +
            "<label>Name:</label>" +
            '<input type="text" id="char-name" class="input-field" placeholder="Enter your name" maxlength="20">' +
            "</div>" +
            '<div class="form-group">' +
            "<label>Class:</label>" +
            '<div class="class-selection">' +
            '<div class="class-card selected" onclick="game.ui.selectClass(this, \'warrior\')">' +
            '<div class="class-icon">⚔️</div>' +
            '<div class="class-name">Warrior</div>' +
            '<div class="class-desc">Master of combat. High health and strength.</div>' +
            '<div class="class-stats">+4 STR, +3 VIT, +20 HP</div>' +
            "</div>" +
            '<div class="class-card" onclick="game.ui.selectClass(this, \'mage\')">' +
            '<div class="class-icon">🔮</div>' +
            '<div class="class-name">Mage</div>' +
            '<div class="class-desc">Wielder of arcane power.</div>' +
            '<div class="class-stats">+4 INT, +2 LUCK, -10 HP</div>' +
            "</div>" +
            '<div class="class-card" onclick="game.ui.selectClass(this, \'rogue\')">' +
            '<div class="class-icon">🗡️</div>' +
            '<div class="class-name">Rogue</div>' +
            '<div class="class-desc">Swift and deadly.</div>' +
            '<div class="class-stats">+4 AGI, +2 LUCK, 15% Dodge</div>' +
            "</div>" +
            "</div></div>" +
            '<div class="form-group">' +
            "<label>Difficulty:</label>" +
            '<div class="difficulty-selection">' +
            '<div class="diff-option selected" onclick="game.ui.selectDifficulty(this, \'normal\')">' +
            "<strong>Normal</strong><span>Standard experience.</span></div>" +
            '<div class="diff-option" onclick="game.ui.selectDifficulty(this, \'hard\')">' +
            "<strong>Hard</strong><span>-20% HP, +30% damage, +20% XP.</span></div>" +
            '<div class="diff-option" onclick="game.ui.selectDifficulty(this, \'nightmare\')">' +
            "<strong>☠️ Nightmare</strong><span>PERMADEATH. One life only.</span></div>" +
            "</div></div>" +
            '<div class="button-row">' +
            '<button class="btn btn-secondary" onclick="game.ui.showTitleScreen()">Back</button>' +
            '<button class="btn btn-primary" onclick="game.ui.startNewGame()">Begin Journey</button>' +
            "</div></div>"
    );

    this.selectedClass = "warrior";
    this.selectedDifficulty = "normal";
};

GameUI.prototype.selectClass = function (el, cls) {
    document
        .querySelectorAll(".class-card")
        .forEach(function (c) {
            c.classList.remove("selected");
        });
    el.classList.add("selected");
    this.selectedClass = cls;
};

GameUI.prototype.selectDifficulty = function (el, diff) {
    document
        .querySelectorAll(".diff-option")
        .forEach(function (c) {
            c.classList.remove("selected");
        });
    el.classList.add("selected");
    this.selectedDifficulty = diff;
};

GameUI.prototype.startNewGame = function () {
    var name =
        (document.getElementById("char-name").value || "").trim() ||
        "Wanderer";
    this.game.newGame(name, this.selectedClass, this.selectedDifficulty);
};

GameUI.prototype.renderHeader = function () {
    var c = this.game.character;
    if (!c) return "";

    return (
        '<div class="game-header">' +
        '<div class="char-info">' +
        '<span class="char-name">' +
        c.name +
        "</span>" +
        '<span class="char-class">' +
        c.characterClass +
        " Lv." +
        c.level +
        "</span></div>" +
        '<div class="char-resources">' +
        '<span class="health">❤️ ' +
        c.baseStats.health +
        "/" +
        c.baseStats.maxHealth +
        "</span>" +
        '<span class="gold">💰 ' +
        c.gold +
        "</span>" +
        '<span class="xp">⭐ ' +
        c.xp +
        "/" +
        c.xpToLevel +
        "</span></div>" +
        '<div class="header-buttons">' +
        '<button class="btn-icon" onclick="game.showQuests()" title="Quests">📜</button>' +
        '<button class="btn-icon" onclick="game.showInventory()" title="Inventory">🎒</button>' +
        '<button class="btn-icon" onclick="game.showCharacter()" title="Character">👤</button>' +
        "</div></div>"
    );
};

GameUI.prototype.displayStoryNode = function (node) {
    var choicesHtml = "";

    if (node.choices && node.choices.length > 0) {
        choicesHtml = '<div class="choices">';
        for (var i = 0; i < node.choices.length; i++) {
            var choice = node.choices[i];
            var disabled = "";
            var tooltip = "";

            if (choice.check) {
                var sv = this.game.character.getEffectiveStat(
                    choice.check.stat
                );
                if (sv < choice.check.dc) {
                    disabled = "disabled";
                    tooltip =
                        " [Requires " +
                        choice.check.dc +
                        " " +
                        choice.check.stat.toUpperCase() +
                        "]";
                } else {
                    tooltip =
                        " [" +
                        choice.check.stat.toUpperCase() +
                        " " +
                        choice.check.dc +
                        " ✓]";
                }
            }

            choicesHtml +=
                '<button class="choice-btn" onclick="game.makeChoice(' +
                i +
                ')" ' +
                disabled +
                ">" +
                choice.text +
                tooltip +
                "</button>";
        }
        choicesHtml += "</div>";
    }

    var titleHtml = node.title
        ? '<h2 class="chapter-title">' + node.title + "</h2>"
        : "";

    var textFormatted = node.text
        .replace(/\\n\\n/g, "</p><p>")
        .replace(/\\n/g, "<br>");

    this.setContent(
        '<div class="story-screen">' +
            this.renderHeader() +
            '<div class="story-content">' +
            titleHtml +
            '<div class="story-text"><p>' +
            textFormatted +
            "</p></div>" +
            choicesHtml +
            "</div></div>"
    );
};

GameUI.prototype.showCombatInterface = function (enemy) {
    var c = this.game.character;
    var hp =
        Math.max(0, (c.baseStats.health / c.baseStats.maxHealth) * 100) ||
        0;
    var ehp =
        Math.max(
            0,
            (enemy.stats.health / enemy.stats.maxHealth) * 100
        ) || 0;

    var skillDisabled = c.specialCooldown > 0 ? "disabled" : "";
    var skillLabel =
        c.skills.active.name +
        (c.specialCooldown > 0 ? " (" + c.specialCooldown + ")" : "");

    var fleeDisabled = enemy.isBoss ? "disabled" : "";

    this.setContent(
        '<div class="combat-screen">' +
            this.renderHeader() +
            '<div class="combat-arena">' +
            '<div class="enemy-section">' +
            '<div class="enemy-display">' +
            '<span class="enemy-icon">' +
            enemy.icon +
            "</span>" +
            '<div class="enemy-info">' +
            "<h3>" +
            enemy.name +
            (enemy.isBoss ? " 👑" : "") +
            "</h3>" +
            '<div class="enemy-level">Level ' +
            enemy.level +
            "</div>" +
            '<div class="health-bar enemy-health">' +
            '<div class="health-fill" style="width:' +
            ehp +
            '%"></div>' +
            '<span class="health-text">' +
            enemy.stats.health +
            "/" +
            enemy.stats.maxHealth +
            "</span>" +
            "</div></div></div>" +
            '<p class="enemy-desc">' +
            (enemy.description || "") +
            "</p></div>" +
            '<div class="combat-log" id="combat-log"></div>' +
            '<div class="player-section">' +
            '<div class="health-bar player-health">' +
            '<div class="health-fill" style="width:' +
            hp +
            '%"></div>' +
            '<span class="health-text">' +
            c.baseStats.health +
            "/" +
            c.baseStats.maxHealth +
            "</span></div></div>" +
            '<div class="combat-actions">' +
            '<button class="btn btn-danger" onclick="game.playerCombatAction(\'attack\')">⚔️ Attack</button>' +
            '<button class="btn btn-magic" onclick="game.playerCombatAction(\'skill\')" ' +
            skillDisabled +
            ">✨ " +
            skillLabel +
            "</button>" +
            '<button class="btn btn-secondary" onclick="game.ui.showCombatItems()">🎒 Items</button>' +
            '<button class="btn btn-flee" onclick="game.playerCombatAction(\'flee\')" ' +
            fleeDisabled +
            ">🏃 Flee</button>" +
            "</div></div></div>"
    );
};

GameUI.prototype.showCombatItems = function () {
    var items = this.game.inventory.getInventoryDisplay();
    var html = '<div class="combat-items">';

    for (var j = 0; j < items.length; j++) {
        var it = items[j];
        if (it.data && it.data.type === "consumable") {
            html +=
                '<button class="btn btn-secondary" onclick="game.useCombatItem(\'' +
                it.id +
                "')\">" +
                it.data.icon +
                " " +
                it.data.name +
                " (x" +
                it.quantity +
                ")</button>";
        }
    }

    html +=
        '<button class="btn btn-secondary" onclick="game.ui.showCombatInterface(game.combat.currentEnemy)">Cancel</button></div>';

    document.querySelector(".combat-actions").innerHTML = html;
};

GameUI.prototype.updateCombat = function (result) {
    if (!result) return;

    var log = document.getElementById("combat-log");
    if (log && result.log) {
        var logHtml = "";
        for (var i = 0; i < result.log.length; i++) {
            var e = result.log[i];
            var cn = "log-entry";
            if (e.type === "player_attack") cn += " log-player";
            if (e.type === "enemy_attack") cn += " log-enemy";
            if (e.type === "heal") cn += " log-heal";
            if (e.type === "boss_phase") cn += " log-boss";
            logHtml += '<div class="' + cn + '">' + e.text + "</div>";
        }
        log.innerHTML = logHtml;
        log.scrollTop = log.scrollHeight;
    }

    var c = this.game.character;
    var pf = document.querySelector(".player-health .health-fill");
    var pt = document.querySelector(".player-health .health-text");
    if (pf && pt) {
        pf.style.width =
            Math.max(
                0,
                (c.baseStats.health / c.baseStats.maxHealth) * 100
            ) + "%";
        pt.textContent =
            c.baseStats.health + "/" + c.baseStats.maxHealth;
    }

    if (this.game.combat.currentEnemy) {
        var en = this.game.combat.currentEnemy;
        var ef = document.querySelector(".enemy-health .health-fill");
        var et = document.querySelector(".enemy-health .health-text");
        if (ef && et) {
            ef.style.width =
                Math.max(
                    0,
                    (en.stats.health / en.stats.maxHealth) * 100
                ) + "%";
            et.textContent =
                Math.max(0, en.stats.health) +
                "/" +
                en.stats.maxHealth;
        }
    }
};

GameUI.prototype.showCombatVictory = function (r) {
    var lootHtml = "";
    if (r.loot && r.loot.length > 0) {
        lootHtml = '<div class="loot-list"><h4>Loot:</h4><ul>';
        for (var i = 0; i < r.loot.length; i++) {
            var it = ITEMS[r.loot[i]] || WEAPONS[r.loot[i]];
            lootHtml +=
                "<li>" +
                (it ? it.icon + " " + it.name : r.loot[i]) +
                "</li>";
        }
        lootHtml += "</ul></div>";
    }

    var lvlHtml = r.levelUp
        ? '<p class="level-up">🎉 Level Up! Now level ' +
          r.newLevel +
          "!</p>"
        : "";

    this.setContent(
        '<div class="combat-result victory">' +
            "<h2>⚔️ Victory! ⚔️</h2>" +
            '<div class="rewards">' +
            "<p>+" +
            r.xp +
            " XP</p>" +
            "<p>+" +
            r.gold +
            " Gold</p>" +
            lootHtml +
            lvlHtml +
            "</div>" +
            '<button class="btn btn-primary" onclick="game.afterCombat(true)">Continue</button>' +
            "</div>"
    );
};

GameUI.prototype.showCombatDefeat = function (r) {
    if (r.permadeath) {
        this.showGameOver(r);
        return;
    }

    this.setContent(
        '<div class="combat-result defeat">' +
            "<h2>💀 Defeated 💀</h2>" +
            '<p class="death-message">' +
            r.deathMessage +
            "</p>" +
            "<p>Lost " +
            r.goldLost +
            " gold.</p>" +
            '<button class="btn btn-primary" onclick="game.afterCombat(false)">Continue</button>' +
            "</div>"
    );
};

GameUI.prototype.showGameOver = function (r) {
    this.setContent(
        '<div class="game-over">' +
            "<h1>☠️ GAME OVER ☠️</h1>" +
            '<p class="death-message">' +
            (r.deathMessage || "Your journey ends.") +
            "</p>" +
            '<button class="btn btn-primary" onclick="game.ui.showTitleScreen()">Return to Title</button>' +
            "</div>"
    );
};

GameUI.prototype.showMainInterface = function () {
    var loc = LOCATIONS.millbrook;

    this.setContent(
        '<div class="main-interface">' +
            this.renderHeader() +
            '<div class="main-content">' +
            '<div class="action-panel">' +
            "<h3>📍 " +
            loc.name +
            "</h3>" +
            "<p>" +
            loc.description +
            "</p>" +
            '<div class="action-buttons">' +
            '<button class="btn btn-action" onclick="game.explore(\'dark_forest\')">🌲 Explore Dark Forest</button>' +
            '<button class="btn btn-action" onclick="game.openFishing(\'millbrook_pond\')">🎣 Go Fishing</button>' +
            '<button class="btn btn-action" onclick="game.openGambling(\'millbrook_tavern\')">🎲 Visit Tavern (Gambling)</button>' +
            '<button class="btn btn-action" onclick="game.openShop(\'millbrook\')">🛒 General Store</button>' +
            '<button class="btn btn-action" onclick="game.showQuests()">📜 Quest Log</button>' +
            '<button class="btn btn-action" onclick="game.showInventory()">🎒 Inventory</button>' +
            '<button class="btn btn-action" onclick="game.showCharacter()">👤 Character</button>' +
            '<button class="btn btn-action" onclick="game.rest()">🏕️ Rest & Heal</button>' +
            "</div></div></div></div>"
    );
};

GameUI.prototype.showQuestLog = function (quests) {
    var mq = quests.getActiveQuests("main");
    var sq = quests.getActiveQuests("side");
    var qh = '<div class="quest-list">';

    if (mq.length > 0) {
        qh += "<h3>⚔️ Main Quests</h3>";
        for (var i = 0; i < mq.length; i++) {
            qh += this.renderQuestEntry(mq[i]);
        }
    }

    if (sq.length > 0) {
        qh += "<h3>📌 Side Quests</h3>";
        for (var j = 0; j < sq.length; j++) {
            qh += this.renderQuestEntry(sq[j]);
        }
    }

    if (mq.length === 0 && sq.length === 0) {
        qh += '<p class="no-quests">No active quests.</p>';
    }

    qh += "</div>";

    this.setContent(
        '<div class="quest-screen">' +
            this.renderHeader() +
            "<h2>📜 Quest Log</h2>" +
            qh +
            '<button class="btn btn-secondary" onclick="game.goBack()">Back</button>' +
            "</div>"
    );
};

GameUI.prototype.renderQuestEntry = function (q) {
    var prog = this.game.quests.getQuestProgress(q.id);
    var oh = '<ul class="objectives">';

    for (var i = 0; i < q.objectives.length; i++) {
        var o = q.objectives[i];
        oh +=
            '<li class="' +
            (o.completed ? "completed" : "") +
            '">' +
            (o.completed ? "✅" : "⬜") +
            " " +
            o.text +
            "</li>";
    }

    oh += "</ul>";

    return (
        '<div class="quest-entry ' +
        q.type +
        '">' +
        '<div class="quest-header"><h4>' +
        q.title +
        '</h4><span class="quest-progress">' +
        prog.completed +
        "/" +
        prog.total +
        "</span></div>" +
        '<p class="quest-desc">' +
        q.description +
        "</p>" +
        oh +
        "</div>"
    );
};

GameUI.prototype.showInventory = function (items) {
    var c = this.game.character;

    var eqHtml =
        '<div class="equipment-section"><h3>⚔️ Equipment</h3>' +
        '<div class="equipment-slots">' +
        this.renderEquipSlot("weapon", c.equipment.weapon) +
        this.renderEquipSlot("armor", c.equipment.armor) +
        this.renderEquipSlot("accessory", c.equipment.accessory) +
        "</div></div>";

    var invHtml = '<div class="inventory-grid">';
    for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var icon = it.data ? it.data.icon || "📦" : "📦";
        var name = it.data ? it.data.name : it.id;
        var qty =
            it.quantity > 1
                ? '<span class="item-qty">x' + it.quantity + "</span>"
                : "";
        invHtml +=
            '<div class="inventory-item" onclick="game.ui.showItemOptions(\'' +
            it.id +
            "')\">" +
            '<span class="item-icon">' +
            icon +
            "</span>" +
            '<span class="item-name">' +
            name +
            "</span>" +
            qty +
            "</div>";
    }
    invHtml += "</div>";

    this.setContent(
        '<div class="inventory-screen">' +
            this.renderHeader() +
            "<h2>🎒 Inventory (" +
            items.length +
            "/" +
            c.maxInventory +
            ")</h2>" +
            eqHtml +
            invHtml +
            '<button class="btn btn-secondary" onclick="game.goBack()">Back</button>' +
            "</div>"
    );
};

GameUI.prototype.renderEquipSlot = function (slot, itemId) {
    var it = itemId ? ITEMS[itemId] || WEAPONS[itemId] : null;
    var content = it ? it.icon + " " + it.name : "Empty";

    return (
        '<div class="equip-slot">' +
        '<div class="slot-label">' +
        slot +
        "</div>" +
        '<div class="slot-item ' +
        (it ? "" : "empty") +
        '">' +
        content +
        "</div></div>"
    );
};

GameUI.prototype.showItemOptions = function (itemId) {
    var it = ITEMS[itemId] || WEAPONS[itemId];
    if (it) {
        alert(
            it.name +
                "\n" +
                (it.description || "") +
                "\nValue: " +
                (it.value || 0) +
                " gold"
        );
    }
};

GameUI.prototype.showCharacterSheet = function (c) {
    var stats = ["strength", "intelligence", "agility", "vitality", "luck"];
    var sh = '<div class="stats-grid">';

    for (var i = 0; i < stats.length; i++) {
        var s = stats[i];
        var v = c.getEffectiveStat(s);
        var addBtn =
            c.statPoints > 0
                ? '<button class="btn-tiny" onclick="game.allocateStat(\'' +
                  s +
                  "')\">+</button>"
                : "";
        sh +=
            '<div class="stat-row"><span class="stat-name">' +
            s.toUpperCase() +
            "</span>" +
            '<span class="stat-value">' +
            v +
            "</span>" +
            addBtn +
            "</div>";
    }
    sh += "</div>";

    var sph =
        c.statPoints > 0
            ? '<p class="stat-points">🔵 ' +
              c.statPoints +
              " points available!</p>"
            : "";

    this.setContent(
        '<div class="character-screen">' +
            this.renderHeader() +
            "<h2>👤 " +
            c.name +
            "</h2>" +
            '<div class="char-overview">' +
            '<span class="class-badge">' +
            c.characterClass +
            "</span>" +
            "<p>Level " +
            c.level +
            " | " +
            c.xp +
            "/" +
            c.xpToLevel +
            " XP</p>" +
            sph +
            "</div>" +
            "<h3>📊 Stats</h3>" +
            sh +
            "<h3>⚡ Skills</h3>" +
            '<div class="skills-list">' +
            '<div class="skill-entry"><strong>' +
            c.skills.active.name +
            "</strong><p>" +
            c.skills.active.description +
            "</p></div>" +
            '<div class="skill-entry passive"><strong>' +
            c.skills.passive.name +
            "</strong><p>" +
            c.skills.passive.description +
            "</p></div>" +
            "</div>" +
            "<p>Kills: " +
            c.totalKills +
            " | Deaths: " +
            c.deaths +
            " | Karma: " +
            c.karma +
            "</p>" +
            '<button class="btn btn-secondary" onclick="game.goBack()">Back</button>' +
            "</div>"
    );
};

GameUI.prototype.showShop = function (shop) {
    var c = this.game.character;
    var ih = '<div class="shop-items">';

    for (var i = 0; i < shop.items.length; i++) {
        var si = shop.items[i];
        var it = ITEMS[si.id] || WEAPONS[si.id];
        if (!it) continue;

        var canAfford = c.gold >= si.price;

        ih +=
            '<div class="shop-item ' +
            (canAfford ? "" : "unaffordable") +
            '">' +
            '<span class="item-icon">' +
            (it.icon || "📦") +
            "</span>" +
            '<div class="item-info"><span class="item-name">' +
            it.name +
            "</span></div>" +
            '<div class="item-price">💰 ' +
            si.price +
            "</div>" +
            '<button class="btn btn-small btn-primary" onclick="game.buyItem(\'' +
            si.id +
            "', " +
            si.price +
            ')" ' +
            (canAfford ? "" : "disabled") +
            ">Buy</button></div>";
    }

    ih += "</div>";

    this.setContent(
        '<div class="shop-screen">' +
            this.renderHeader() +
            "<h2>🛒 " +
            shop.name +
            "</h2>" +
            ih +
            '<button class="btn btn-secondary" onclick="game.goBack()">Leave</button>' +
            "</div>"
    );
};

GameUI.prototype.showFishingInterface = function (loc) {
    var f = this.game.fishing;
    var st = f.getStats();
    var rod = FISHING_EQUIPMENT[f.equipped.rod];

    this.setContent(
        '<div class="fishing-screen">' +
            this.renderHeader() +
            "<h2>🎣 " +
            loc.name +
            "</h2>" +
            '<p class="location-desc">' +
            loc.description +
            "</p>" +
            '<div class="fishing-stats">' +
            "<span>Rod: " +
            rod.name +
            " (+" +
            rod.bonus +
            ")</span>" +
            "<span>Fish Caught: " +
            st.totalCatches +
            "</span>" +
            "<span>Collection: " +
            st.uniqueFish +
            "/" +
            st.totalFishTypes +
            " (" +
            st.completionPercent +
            "%)</span>" +
            "</div>" +
            '<div class="fishing-area">' +
            '<div class="water-animation">🌊 ~ ~ 🌊 ~ ~ 🌊</div>' +
            '<button class="btn btn-primary btn-large" onclick="game.castLine()">🎣 Cast Line</button>' +
            "</div>" +
            '<div class="fishing-actions">' +
            '<button class="btn btn-secondary" onclick="game.ui.showFishingInventory()">🐟 Fish Caught</button>' +
            '<button class="btn btn-secondary" onclick="game.ui.showFishingEquipment()">🎣 Equipment</button>' +
            '<button class="btn btn-secondary" onclick="game.goBack()">🚶 Leave</button>' +
            "</div></div>"
    );
};

GameUI.prototype.showFishingResult = function (r) {
    var html = '<div class="fishing-result">';

    if (r.success) {
        var rc = r.fish.rarity || "common";
        html +=
            '<div class="catch-display ' +
            rc +
            '"><span class="fish-icon">' +
            r.fish.icon +
            "</span>" +
            "<h3>" +
            r.fish.name +
            "</h3>" +
            '<p class="fish-rarity">' +
            r.fish.rarity.toUpperCase() +
            "</p>" +
            "<p>" +
            r.fish.description +
            "</p>" +
            '<p class="fish-value">Value: ' +
            r.fish.value +
            " gold</p>" +
            (r.isNew ? '<p class="new-catch">✨ NEW CATCH!</p>' : "") +
            "</div>";

        if (r.legendary)
            html +=
                '<p class="legendary-warning">⚠️ A legendary creature! Prepare for battle!</p>';
    } else {
        html += '<p class="no-catch">' + r.message + "</p>";
    }

    html +=
        '<button class="btn btn-primary" onclick="game.continueFishing()">Continue Fishing</button></div>';

    document.querySelector(".fishing-area").innerHTML = html;
};

GameUI.prototype.showFishingInventory = function () {
    var f = this.game.fishing;
    var html =
        '<div class="fish-inventory"><h3>🐟 Your Catches</h3><div class="fish-list">';

    for (var name in f.fishCaught) {
        if (f.fishCaught[name] > 0) {
            var fish = null;
            for (var id in FISH) {
                if (FISH[id].name === name) {
                    fish = FISH[id];
                    break;
                }
            }
            if (fish) {
                html +=
                    '<div class="fish-entry"><span>' +
                    fish.icon +
                    " " +
                    name +
                    " x" +
                    f.fishCaught[name] +
                    "</span>" +
                    '<button class="btn btn-small" onclick="game.sellFish(\'' +
                    name +
                    "', 1)\">Sell (" +
                    fish.value +
                    "g)</button></div>";
            }
        }
    }

    html +=
        '</div><button class="btn btn-secondary" onclick="game.continueFishing()">Back</button></div>';

    document.querySelector(".fishing-area").innerHTML = html;
};

GameUI.prototype.showFishingEquipment = function () {
    var html =
        '<div class="fishing-equipment"><h3>🎣 Equipment</h3><h4>Rods</h4>';

    for (var rodId in FISHING_EQUIPMENT) {
        var rod = FISHING_EQUIPMENT[rodId];
        if (rod.consumable) continue;

        var owned =
            this.game.fishing.equipped.rod === rodId ||
            this.game.inventory.hasItem(rodId);
        var equipped = this.game.fishing.equipped.rod === rodId;

        html +=
            '<div class="equip-option"><span>' +
            rod.name +
            " (+" +
            rod.bonus +
            ")</span>" +
            (equipped
                ? '<span class="equipped">EQUIPPED</span>'
                : owned
                ? '<button class="btn btn-small" onclick="game.equipRod(\'' +
                  rodId +
                  "')\">Equip</button>"
                : '<span class="not-owned">Not Owned</span>') +
            "</div>";
    }

    html +=
        '<button class="btn btn-secondary" onclick="game.continueFishing()">Back</button></div>';

    document.querySelector(".fishing-area").innerHTML = html;
};

GameUI.prototype.showGamblingLocation = function (loc) {
    var html =
        '<div class="gambling-screen">' +
        this.renderHeader() +
        "<h2>🎲 " +
        loc.name +
        "</h2>" +
        '<div class="gambling-games">';

    for (var i = 0; i < loc.games.length; i++) {
        var gid = loc.games[i];
        var gd = GAMBLING_GAMES[gid];
        if (gd) {
            html +=
                '<div class="game-option" onclick="game.selectGamblingGame(\'' +
                gid +
                "')\">" +
                '<span class="game-icon">' +
                gd.icon +
                "</span>" +
                '<div class="game-info"><h4>' +
                gd.name +
                "</h4>" +
                "<p>" +
                gd.description +
                "</p>" +
                '<p class="bet-range">Bet: ' +
                gd.minBet +
                " - " +
                gd.maxBet +
                " gold</p></div></div>";
        }
    }

    var st = this.game.gambling.getStats();
    html +=
        "</div>" +
        '<div class="gambling-stats"><p>Games Played: ' +
        st.gamesPlayed +
        "</p><p>Net: " +
        (st.netProfit >= 0 ? "+" : "") +
        st.netProfit +
        " gold</p></div>" +
        '<button class="btn btn-secondary" onclick="game.goBack()">Leave</button></div>';

    this.setContent(html);
};

GameUI.prototype.showGamblingGame = function (gd) {
    var c = this.game.character;

    this.setContent(
        '<div class="gambling-game">' +
            this.renderHeader() +
            "<h2>" +
            gd.icon +
            " " +
            gd.name +
            "</h2>" +
            "<p>" +
            gd.rules +
            "</p>" +
            '<div class="bet-controls">' +
            "<label>Your Gold: " +
            c.gold +
            "</label>" +
            '<input type="number" id="bet-amount" min="' +
            gd.minBet +
            '" max="' +
            Math.min(gd.maxBet, c.gold) +
            '" value="' +
            gd.minBet +
            '">' +
            "</div>" +
            '<div class="game-area" id="game-area">' +
            '<button class="btn btn-primary btn-large" onclick="game.playGamblingGame()">Play!</button>' +
            "</div>" +
            '<button class="btn btn-secondary" onclick="game.openGambling(game.currentGamblingLocation)">Back to Games</button>' +
            "</div>"
    );
};

GameUI.prototype.showGamblingResult = function (r) {
    var html =
        '<div class="gambling-result ' +
        (r.won ? "win" : "lose") +
        '">';

    if (r.cheatCaught) {
        html += "<h3>🕵️ Caught Cheating!</h3><p>" + r.message + "</p>";
    } else if (r.cursed) {
        html += "<h3>☠️ CURSED!</h3><p>" + r.message + "</p>";
    } else if (r.tie) {
        html += "<h3>⚔️ TIE!</h3><p>" + r.message + "</p>";
        if (r.damage) {
            html +=
                '<p class="damage">You took ' +
                r.damage +
                " damage!</p>";
        }
    } else {
        html +=
            "<h3>" +
            (r.won ? "🎉 You Win!" : "😢 You Lose") +
            "</h3><p>" +
            r.message +
            "</p>" +
            '<p class="result-amount">' +
            (r.won ? "+" : "-") +
            r.amount +
            " gold</p>";
    }

    html +=
        '<button class="btn btn-primary" onclick="game.playGamblingGame()">Play Again</button>' +
        '<button class="btn btn-secondary" onclick="game.openGambling(game.currentGamblingLocation)">Other Games</button></div>';

    document.getElementById("game-area").innerHTML = html;
};

GameUI.prototype.showFatesHandUI = function (s) {
    var html =
        '<div class="fates-hand"><div class="hand dealer-hand"><h4>Dealer</h4><div class="cards">';

    for (var i = 0; i < s.dealerHand.length; i++) {
        html += '<span class="card">' + (s.dealerHand[i] || "?") + "</span>";
    }

    html +=
        "</div><p>Total: " +
        s.dealerTotal +
        "</p></div>" +
        '<div class="hand player-hand"><h4>Your Hand</h4><div class="cards">';

    for (var j = 0; j < s.playerHand.length; j++) {
        html += '<span class="card">' + s.playerHand[j] + "</span>";
    }

    html +=
        "</div><p>Total: " +
        s.playerTotal +
        "</p></div>" +
        '<div class="fates-actions">' +
        '<button class="btn btn-primary" onclick="game.fatesHandAction(\'hit\')">Hit</button>' +
        '<button class="btn btn-secondary" onclick="game.fatesHandAction(\'stand\')">Stand</button>' +
        "</div></div>";

    document.getElementById("game-area").innerHTML = html;
};

GameUI.prototype.showMessage = function (msg) {
    alert(msg);
};

GameUI.prototype.showNotification = function (msg) {
    var notif = document.createElement("div");
    notif.className = "notification";
    notif.textContent = msg;
    document.body.appendChild(notif);

    setTimeout(function () {
        notif.classList.add("fade-out");
        setTimeout(function () {
            if (notif.parentNode) notif.parentNode.removeChild(notif);
        }, 500);
    }, 3000);
};
