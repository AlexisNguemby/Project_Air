// CardLoader.js
// Transforme les données JSON en instances de Card

import Card from "../models/Card.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cardsData = JSON.parse(readFileSync(join(__dirname, "../data/cards.json"), "utf-8"));

class CardLoader {

    // Charge toutes les cartes du jeu
    loadAllCards() {
        return cardsData.map(data => this.createCard(data));
    }

    // Crée une instance Card à partir des données JSON
    createCard(data) {
        return new Card(
            data.name,
            data.faction,
            data.power,
            data.attack,
            data.description,
            data.image || ""
        );
    }

    // Trouve une carte par son ID
    getCardById(id) {
        const data = cardsData.find(card => card.id === id);
        if (!data) return null;
        return this.createCard(data);
    }

    // Récupère toutes les cartes d'une faction
    getCardsByFaction(faction) {
        return cardsData
            .filter(card => card.faction === faction)
            .map(data => this.createCard(data));
    }
}

export default CardLoader;
