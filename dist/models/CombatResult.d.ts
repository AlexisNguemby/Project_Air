import Card from "./Card.js";
declare class CombatResult {
    winner: Card | null;
    loser: Card | null;
    directDamage: number;
    winnerPower: number;
    loserPower: number;
    resonanceUsed: boolean;
    finalDamage: number;
    constructor(winner: Card | null, loser: Card | null, directDamage: number, winnerPower?: number, loserPower?: number);
    applyResonance(): void;
}
export default CombatResult;
//# sourceMappingURL=CombatResult.d.ts.map