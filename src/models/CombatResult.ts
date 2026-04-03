import Card from "./Card.js";

class CombatResult {
  winner: Card | null;
  loser: Card | null;
  directDamage: number;
  winnerPower: number;
  loserPower: number;
  resonanceUsed: boolean;
  finalDamage: number;

  constructor(
    winner: Card | null,
    loser: Card | null,
    directDamage: number,
    winnerPower: number = 0,
    loserPower: number = 0
  ) {
    this.winner = winner;
    this.loser = loser;
    this.directDamage = directDamage;
    this.winnerPower = winnerPower;
    this.loserPower = loserPower;
    this.resonanceUsed = false;
    this.finalDamage = directDamage;
  }

  applyResonance(): void {
    this.resonanceUsed = true;
    this.finalDamage = this.directDamage + 2;
  }
}

export default CombatResult;
