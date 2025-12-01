function QuestManager(game) {
    this.game = game;
    this.activeQuests = {};
    this.completedQuests = [];
}

QuestManager.prototype.startQuest = function(questId) {
    var questData = QUESTS[questId];
    if (!questData) {
        console.error("Quest not found:", questId);
        return false;
    }

    if (this.activeQuests[questId] || this.completedQuests.indexOf(questId) !== -1) {
        return false;
    }

    var objectives = [];
    for (var i = 0; i < questData.objectives.length; i++) {
        var obj = questData.objectives[i];
        objectives.push({
            id: obj.id,
            text: obj.text,
            completed: false,
            count: obj.count || 0,
            target: obj.target || 1
        });
    }

    this.activeQuests[questId] = {
        id: questId,
        title: questData.title,
        type: questData.type,
        description: questData.description,
        objectives: objectives,
        rewards: questData.rewards,
        nextQuest: questData.nextQuest
    };

    return true;
};

QuestManager.prototype.updateObjective = function(questId, objectiveId, increment) {
    var quest = this.activeQuests[questId];
    if (!quest) return false;

    for (var i = 0; i < quest.objectives.length; i++) {
        var obj = quest.objectives[i];
        if (obj.id === objectiveId) {
            if (obj.target > 1) {
                obj.count = (obj.count || 0) + (increment || 1);
                if (obj.count >= obj.target) {
                    obj.completed = true;
                }
            } else {
                obj.completed = true;
            }
            break;
        }
    }

    // Check if all objectives complete
    var allComplete = true;
    for (var j = 0; j < quest.objectives.length; j++) {
        if (!quest.objectives[j].completed) {
            allComplete = false;
            break;
        }
    }

    if (allComplete) {
        this.completeQuest(questId);
    }

    return true;
};

QuestManager.prototype.completeQuest = function(questId) {
    var quest = this.activeQuests[questId];
    if (!quest) return false;

    if (quest.rewards) {
        if (quest.rewards.xp) {
            this.game.character.addXP(quest.rewards.xp);
        }
        if (quest.rewards.gold) {
            this.game.character.gold += quest.rewards.gold;
        }
        if (quest.rewards.karma) {
            this.game.character.karma += quest.rewards.karma;
        }
        if (quest.rewards.items) {
            for (var i = 0; i < quest.rewards.items.length; i++) {
                this.game.inventory.addItem(quest.rewards.items[i]);
            }
        }
    }

    this.completedQuests.push(questId);
    delete this.activeQuests[questId];

    if (quest.nextQuest) {
        this.startQuest(quest.nextQuest);
    }

    return true;
};

QuestManager.prototype.getActiveQuests = function(type) {
    var quests = [];
    for (var id in this.activeQuests) {
        var quest = this.activeQuests[id];
        if (!type || quest.type === type) {
            quests.push(quest);
        }
    }
    return quests;
};

QuestManager.prototype.getQuestProgress = function(questId) {
    var quest = this.activeQuests[questId];
    if (!quest) return null;

    var completed = 0;
    for (var i = 0; i < quest.objectives.length; i++) {
        if (quest.objectives[i].completed) completed++;
    }

    return {
        quest: quest,
        completed: completed,
        total: quest.objectives.length
    };
};

QuestManager.prototype.isQuestCompleted = function(questId) {
    return this.completedQuests.indexOf(questId) !== -1;
};

QuestManager.prototype.isQuestActive = function(questId) {
    return this.activeQuests[questId] !== undefined;
};
