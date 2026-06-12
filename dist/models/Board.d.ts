import Card from "./Card.js";
declare class Board {
    playerSlots: (Card | null)[];
    opponentSlots: (Card | null)[];
    constructor();
    placeCard(card: Card, slotIndex: number, isPlayer: boolean): boolean;
    clearSlot(slotIndex: number, isPlayer: boolean): void;
}
export default Board;
//# sourceMappingURL=Board.d.ts.map