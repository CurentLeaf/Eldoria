function GamblingEngine(game) {
    this.game = game;
    this.currentGame = null;
    this.currentBet = 0;
    this.gamesPlayed = 0;
    this.totalWon = 0;
    this.totalLost = 0;
    this.fatesHandState = null;
}

GamblingEngine.prototype.startGame = function(gameId, opponent, bet) {
    var gameData = GAMBLING_GAMES[gameId];
    if (!gameData) return { success: false, message: "Unknown game." };
    if (bet < gameData.minBet || bet > gameData.maxBet) return { success: false, message: "Invalid bet amount." };
    if (this.game.character.gold < bet) return { success: false, message: "Not enough gold!" };
    this.currentGame = gameData;
    this.currentBet = bet;
    this.game.character.gold -= bet;
    return { success: true };
};

GamblingEngine.prototype.playLiarsDice = function(bid, callLiar) {
    this.gamesPlayed++;
    var playerRoll = [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];
    var opponentRoll = [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];
    var won = Math.random() < 0.45 + (this.game.character.getEffectiveStat("luck") * 0.02);
    if (won) { var winnings = this.currentBet * 2; this.game.character.gold += winnings; this.totalWon += this.currentBet;
        return { won: true, amount: this.currentBet, message: "You called their bluff!" }; }
    else { this.totalLost += this.currentBet; return { won: false, amount: this.currentBet, message: "They saw through your bluff!" }; }
};

GamblingEngine.prototype.playFatesHand = function(action) {
    if (!this.fatesHandState) {
        this.fatesHandState = { playerHand: [this.drawCard(), this.drawCard()], dealerHand: [this.drawCard()], playerTotal: 0, dealerTotal: 0 };
        this.fatesHandState.playerTotal = this.calculateHand(this.fatesHandState.playerHand);
        this.fatesHandState.dealerTotal = this.calculateHand(this.fatesHandState.dealerHand);
    }
    if (action === "hit") {
        this.fatesHandState.playerHand.push(this.drawCard());
        this.fatesHandState.playerTotal = this.calculateHand(this.fatesHandState.playerHand);
        if (this.fatesHandState.playerTotal > 21) { this.gamesPlayed++; this.totalLost += this.currentBet; this.fatesHandState = null;
            return { won: false, amount: this.currentBet, message: "Bust! You went over 21." }; }
        return { continue: true, state: this.fatesHandState };
    } else if (action === "stand") {
        while (this.fatesHandState.dealerTotal < 17) {
            this.fatesHandState.dealerHand.push(this.drawCard());
            this.fatesHandState.dealerTotal = this.calculateHand(this.fatesHandState.dealerHand);
        }
        this.gamesPlayed++;
        var result;
        if (this.fatesHandState.dealerTotal > 21 || this.fatesHandState.playerTotal > this.fatesHandState.dealerTotal) {
            var winnings = this.currentBet * 2; this.game.character.gold += winnings; this.totalWon += this.currentBet;
            result = { won: true, amount: this.currentBet, message: "You win with " + this.fatesHandState.playerTotal + " vs dealer's " + this.fatesHandState.dealerTotal + "!" };
        } else if (this.fatesHandState.playerTotal === this.fatesHandState.dealerTotal) {
            this.game.character.gold += this.currentBet;
            result = { won: false, tie: true, amount: 0, message: "Push! Tie at " + this.fatesHandState.playerTotal + "." };
        } else {
            this.totalLost += this.currentBet;
            result = { won: false, amount: this.currentBet, message: "Dealer wins with " + this.fatesHandState.dealerTotal + " vs your " + this.fatesHandState.playerTotal + "." };
        }
        this.fatesHandState = null;
        return result;
    }
};

GamblingEngine.prototype.drawCard = function() { return Math.min(10, Math.ceil(Math.random() * 13)); };
GamblingEngine.prototype.calculateHand = function(hand) { var total = 0; for (var i = 0; i < hand.length; i++) total += hand[i]; return total; };

GamblingEngine.prototype.spinWheel = function() {
    this.gamesPlayed++;
    var totalWeight = 0;
    for (var i = 0; i < WHEEL_SEGMENTS.length; i++) totalWeight += WHEEL_SEGMENTS[i].weight;
    var roll = Math.random() * totalWeight, cumulative = 0, segment = WHEEL_SEGMENTS[0];
    for (var j = 0; j < WHEEL_SEGMENTS.length; j++) {
        cumulative += WHEEL_SEGMENTS[j].weight;
        if (roll <= cumulative) { segment = WHEEL_SEGMENTS[j]; break; }
    }
    var result = { segment: segment, message: "" };
    switch (segment.type) {
        case "win":
            var winnings = this.currentBet * segment.multiplier;
            this.game.character.gold += winnings + this.currentBet;
            this.totalWon += winnings;
            result.won = true; result.amount = winnings; result.message = "You won " + winnings + " gold!";
            break;
        case "lose":
            this.totalLost += this.currentBet;
            result.won = false; result.amount = this.currentBet; result.message = "You lost your bet.";
            break;
        case "push":
            this.game.character.gold += this.currentBet;
            result.won = false; result.amount = 0; result.message = "Your bet is returned.";
            break;
        case "special":
            this.game.character.gold += this.currentBet;
            if (segment.effect === "heal") { this.game.character.heal(segment.value); result.message = "Free drink! Restored " + segment.value + " HP."; }
            else { result.message = "You received a mystery prize!"; }
            result.won = true; result.amount = 0;
            break;
        case "curse":
            result.won = false; result.amount = this.currentBet; result.cursed = true; result.message = "The wheel curses you! Bad luck follows...";
            break;
        case "death":
            this.game.character.takeDamage(segment.damage);
            result.won = false; result.amount = this.currentBet; result.death = true; result.message = "The wheel demands blood! You take " + segment.damage + " damage!";
            break;
        default:
            this.game.character.gold += this.currentBet;
            result.message = segment.label;
    }
    return result;
};

GamblingEngine.prototype.playDeathDealer = function() {
    this.gamesPlayed++;
    var playerCard = Math.ceil(Math.random() * 13), dealerCard = Math.ceil(Math.random() * 13);
    if (playerCard > dealerCard) {
        var winnings = this.currentBet * 2; this.game.character.gold += winnings; this.totalWon += this.currentBet;
        return { won: true, amount: this.currentBet, message: "Your " + playerCard + " beats their " + dealerCard + "!" };
    } else if (playerCard < dealerCard) {
        this.totalLost += this.currentBet;
        return { won: false, amount: this.currentBet, message: "Their " + dealerCard + " beats your " + playerCard + "." };
    } else {
        var damage = Math.floor(this.currentBet / 10);
        this.game.character.takeDamage(damage);
        this.game.character.gold += this.currentBet;
        return { won: false, tie: true, amount: 0, damage: damage, message: "Tie at " + playerCard + "! Both take " + damage + " damage!" };
    }
};

GamblingEngine.prototype.getStats = function() {
    return { gamesPlayed: this.gamesPlayed, totalWon: this.totalWon, totalLost: this.totalLost, netProfit: this.totalWon - this.totalLost };
};
