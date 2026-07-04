import Card from "./Card.js";

class Board {
  playerSlots: (Card | null)[];
  opponentSlots: (Card | null)[];

  constructor() {
    this.playerSlots = Array(4).fill(null);
    this.opponentSlots = Array(4).fill(null);
  }

  placeCard(card: Card, slotIndex: number, isPlayer: boolean): boolean {
    if (slotIndex < 0 || slotIndex > 3) return false;
    const slots = isPlayer ? this.playerSlots : this.opponentSlots;
    if (slots[slotIndex] !== null) return false;
    slots[slotIndex] = card;
    return true;
  }

  clearSlot(slotIndex: number, isPlayer: boolean): void {
    const slots = isPlayer ? this.playerSlots : this.opponentSlots;
    slots[slotIndex] = null;
  }
}

export default Board;
