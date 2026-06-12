import Card from "./Card.js";
class Deck {
    cards;
    constructor(cards) {
        if (cards.length !== 4) {
            throw new Error("Un deck doit contenir exactement 4 cartes");
        }
        this.cards = cards;
    }
}
export default Deck;
//# sourceMappingURL=Deck.js.map