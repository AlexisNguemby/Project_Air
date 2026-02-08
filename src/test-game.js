// test-game.js
// Test du systeme de combat avec etoiles et resonance

import Player from "./models/Player.js";
import Game from "./models/Game.js";
import CardLoader from "./services/CardLoader.js";
import GameService from "./services/GameService.js";

const loader = new CardLoader();
const gameService = new GameService();

// Creer les joueurs
const player1 = new Player("Alice");
const player2 = new Player("Bob");

console.log("=== ETAT INITIAL ===");
console.log(`${player1.id}: ${player1.hp} HP, ${player1.stars} etoiles`);
console.log(`${player2.id}: ${player2.hp} HP, ${player2.stars} etoiles`);
console.log("");

// Creer la partie
const game = new Game(player1, player2);

// Decks de chaque joueur (4 cartes chacun)
const deckAlice = [
  loader.getCardById("HUMAN_001"), // Garde Royal - Power: 2, Attack: 2
  loader.getCardById("HUMAN_002"), // Chevalier - Power: 4, Attack: 1
  loader.getCardById("HUMAN_003"), // Mage de Guerre - Power: 1, Attack: 3
  loader.getCardById("HUMAN_004"), // Champion - Power: 3, Attack: 2
];

const deckBob = [
  loader.getCardById("DEMON_001"), // Diablotin - Power: 1, Attack: 2
  loader.getCardById("DEMON_002"), // Molosse - Power: 5, Attack: 0
  loader.getCardById("DEMON_003"), // Succube - Power: 2, Attack: 3
  loader.getCardById("DEMON_004"), // Seigneur - Power: 6, Attack: 2
];

// Boucle de jeu jusqu'a la victoire
while (game.isOngoing()) {
  // Debut du tour : chaque joueur gagne 1 etoile
  gameService.startTurn(game);
  
  console.log(`\n========== TOUR ${game.currentTurn} ==========`);
  console.log(`Etoiles: ${player1.id}=${player1.stars}, ${player2.id}=${player2.stars}`);

  // Placer les 4 cartes de chaque joueur
  for (let i = 0; i < 4; i++) {
    game.board.playerSlots[i] = loader.getCardById(
      deckAlice[i].name === "Garde Royal" ? "HUMAN_001" : 
      deckAlice[i].name === "Chevalier Errant" ? "HUMAN_002" :
      deckAlice[i].name === "Mage de Guerre" ? "HUMAN_003" : "HUMAN_004"
    );
    game.board.opponentSlots[i] = loader.getCardById(
      deckBob[i].name === "Diablotin" ? "DEMON_001" :
      deckBob[i].name === "Molosse des Enfers" ? "DEMON_002" :
      deckBob[i].name === "Succube" ? "DEMON_003" : "DEMON_004"
    );
  }

  // Afficher le plateau
  console.log("\n--- Plateau ---");
  for (let i = 0; i < 4; i++) {
    const p1Card = game.board.playerSlots[i];
    const p2Card = game.board.opponentSlots[i];
    console.log(`Slot ${i}: ${p1Card.name} (P:${p1Card.power}) vs ${p2Card.name} (P:${p2Card.power})`);
  }

  // === STRATEGIE DES JOUEURS ===
  const aliceChoices = {
    starsPerSlot: [0, 2, 0, 0],  // 2 etoiles sur slot 1
    resonanceSlots: [true, true, false, false]
  };
  
  const bobChoices = {
    starsPerSlot: [0, 0, 0, 1],  // 1 etoile sur slot 3
    resonanceSlots: [false, false, true, true]
  };

  // Resoudre les combats via GameService
  console.log("\n--- Combats ---");
  const results = gameService.resolveAllCombats(game, aliceChoices, bobChoices);

  results.forEach(r => {
    if (r.type === "combat") {
      if (r.result.winner) {
        const resonanceText = r.result.resonanceUsed ? " [RESONANCE +2]" : "";
        console.log(`Slot ${r.slot}: ${r.result.winner.name} (${r.result.winnerPower}) bat ${r.result.loser.name} (${r.result.loserPower}) -> ${r.result.finalDamage} degats${resonanceText}`);
      } else {
        console.log(`Slot ${r.slot}: Egalite! (${r.result.winnerPower} vs ${r.result.loserPower})`);
      }
    } else if (r.type === "direct") {
      const target = r.attacker === "player" ? player2.id : player1.id;
      const resonanceText = r.resonanceUsed ? " [RESONANCE +2]" : "";
      console.log(`Slot ${r.slot}: Attaque directe sur ${target} -> ${r.damage} degats${resonanceText}`);
    }
  });

  // Afficher les HP et etoiles
  console.log(`\n${player1.id}: ${player1.hp} HP, ${player1.stars} etoiles | ${player2.id}: ${player2.hp} HP, ${player2.stars} etoiles`);
  
  // Securite anti-boucle infinie
  if (game.currentTurn > 10) {
    console.log("\n-- Limite de tours atteinte !");
    break;
  }
}

// Resultat final
console.log("\n\n===== FIN DE LA PARTIE =====");
console.log(`${player1.id}: ${player1.hp} HP ${!player1.isAlive() ? "MORT" : ""}`);
console.log(`${player2.id}: ${player2.hp} HP ${!player2.isAlive() ? "MORT" : ""}`);

const winner = game.getWinner();
if (winner) {
  console.log(`\n${winner.id} GAGNE !`);
}
