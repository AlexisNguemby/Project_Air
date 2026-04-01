// Board.js

// terrain 4v4

// cartes en jeu
class Board {
  constructor() {
    this.playerSlots = Array(4).fill(null);
    this.opponentSlots = Array(4).fill(null);
  }

  placeCard(card, slotIndex, isPlayer) {
    if (slotIndex < 0 || slotIndex > 3) return false;
    const slots = isPlayer ? this.playerSlots : this.opponentSlots;
    if (slots[slotIndex] !== null) return false; // slot occupé
    slots[slotIndex] = card;
    return true;
  }

  clearSlot(slotIndex, isPlayer) {
    const slots = isPlayer ? this.playerSlots : this.opponentSlots;
    slots[slotIndex] = null;
  }
}

export default Board;
