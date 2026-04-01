import Card from "./Card.js";

class Deck {
  cards: Card[];

  constructor(cards: Card[]) {
    if (cards.length !== 4) {
      throw new Error("Un deck doit contenir exactement 4 cartes");
    }
    this.cards = cards;
  }
}

export default Deck;
