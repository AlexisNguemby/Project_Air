import Card from "./Card.js";
class CombatResult {
    winner;
    loser;
    directDamage;
    winnerPower;
    loserPower;
    resonanceUsed;
    finalDamage;
    constructor(winner, loser, directDamage, winnerPower = 0, loserPower = 0) {
        this.winner = winner;
        this.loser = loser;
        this.directDamage = directDamage;
        this.winnerPower = winnerPower;
        this.loserPower = loserPower;
        this.resonanceUsed = false;
        this.finalDamage = directDamage;
    }
    applyResonance() {
        this.resonanceUsed = true;
        this.finalDamage = this.directDamage + 2;
    }
}
export default CombatResult;
//# sourceMappingURL=CombatResult.js.map