// Deck.js

// validation : exactement 4 cartes
// ///////////////////



class Deck {
  constructor(cards) {
    if (cards.length !== 4) {
      throw new Error("Un deck doit contenir exactement 4 cartes");
    }
    this.cards = cards;
  }
}
