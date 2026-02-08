class CombatResult {
  constructor(winner, loser, directDamage, winnerPower = 0, loserPower = 0) {
    this.winner = winner;
    this.loser = loser;
    this.directDamage = directDamage;
    this.winnerPower = winnerPower;   // Puissance finale (après étoiles)
    this.loserPower = loserPower;     // Puissance finale (après étoiles)
    this.resonanceUsed = false;       // Sera mis à jour si résonance activée
    this.finalDamage = directDamage;  // Dégâts finaux (après résonance)
  }

  applyResonance() {
    this.resonanceUsed = true;
    this.finalDamage = this.directDamage + 2;
  }
}

export default CombatResult;
