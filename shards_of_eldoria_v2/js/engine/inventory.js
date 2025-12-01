function InventoryManager(game) {
    this.game = game;
}

InventoryManager.prototype.addItem = function(itemId, quantity) {
    var char = this.game.character;
    var item = ITEMS[itemId] || WEAPONS[itemId];
    quantity = quantity || 1;

    if (!item) {
        console.error("Item not found:", itemId);
        return false;
    }

    if (item.stackable) {
        for (var i = 0; i < char.inventory.length; i++) {
            if (char.inventory[i].id === itemId) {
                char.inventory[i].quantity = (char.inventory[i].quantity || 1) + quantity;
                return true;
            }
        }
    }

    if (char.inventory.length >= char.maxInventory) {
        return false;
    }

    char.inventory.push({ id: itemId, quantity: quantity });
    return true;
};

InventoryManager.prototype.removeItem = function(itemId, quantity) {
    var char = this.game.character;
    quantity = quantity || 1;

    for (var i = 0; i < char.inventory.length; i++) {
        if (char.inventory[i].id === itemId) {
            char.inventory[i].quantity = (char.inventory[i].quantity || 1) - quantity;
            if (char.inventory[i].quantity <= 0) {
                char.inventory.splice(i, 1);
            }
            return true;
        }
    }
    return false;
};

InventoryManager.prototype.hasItem = function(itemId, quantity) {
    var char = this.game.character;
    quantity = quantity || 1;

    for (var i = 0; i < char.inventory.length; i++) {
        if (char.inventory[i].id === itemId) {
            return (char.inventory[i].quantity || 1) >= quantity;
        }
    }
    return false;
};

InventoryManager.prototype.equipItem = function(itemId, slot) {
    var char = this.game.character;
    var item = ITEMS[itemId] || WEAPONS[itemId];

    if (!item) return { success: false };

    // Unequip current item
    if (char.equipment[slot]) {
        this.addItem(char.equipment[slot]);
    }

    char.equipment[slot] = itemId;
    this.removeItem(itemId);

    return { success: true };
};

InventoryManager.prototype.unequipItem = function(slot) {
    var char = this.game.character;

    if (!char.equipment[slot]) return { success: false };

    if (char.inventory.length >= char.maxInventory) {
        return { success: false, message: "Inventory full" };
    }

    this.addItem(char.equipment[slot]);
    char.equipment[slot] = null;

    return { success: true };
};

InventoryManager.prototype.getInventoryDisplay = function() {
    var char = this.game.character;
    var display = [];

    for (var i = 0; i < char.inventory.length; i++) {
        var invItem = char.inventory[i];
        var item = ITEMS[invItem.id] || WEAPONS[invItem.id];
        display.push({
            id: invItem.id,
            quantity: invItem.quantity || 1,
            data: item
        });
    }

    return display;
};

InventoryManager.prototype.useItem = function(itemId) {
    var char = this.game.character;
    var item = ITEMS[itemId];

    if (!item || item.type !== "consumable") return { success: false };
    if (!this.hasItem(itemId)) return { success: false };

    this.removeItem(itemId, 1);

    var result = { success: true, message: "" };

    if (item.effect) {
        if (item.effect.heal) {
            var healed = char.heal(item.effect.heal);
            result.message = "Restored " + healed + " HP.";
        }
    }

    return result;
};
