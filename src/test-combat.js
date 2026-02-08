// test-combat.js
// Test de combat entre deux cartes

import CardLoader from "./services/CardLoader.js";
import CombatService from "./services/CombatService.js";

const loader = new CardLoader();
const combatService = new CombatService();

// Charger deux cartes
const gardeRoyal = loader.getCardById("HUMAN_001");    // Power: 2, Attack: 2
const seigneurAbysses = loader.getCardById("DEMON_004"); // Power: 6, Attack: 2

console.log("=== COMBAT ===");
console.log(`Attaquant: ${gardeRoyal.name} (Power: ${gardeRoyal.power}, Attack: ${gardeRoyal.attack})`);
console.log(`Défenseur: ${seigneurAbysses.name} (Power: ${seigneurAbysses.power}, Attack: ${seigneurAbysses.attack})`);
console.log("");

// Lancer le combat
const resultat = combatService.resolveCombat(gardeRoyal, seigneurAbysses);

// Afficher le résultat
if (resultat.winner) {
    console.log(`🏆 Gagnant: ${resultat.winner.name}`);
    console.log(`💀 Perdant: ${resultat.loser.name}`);
    console.log(`💥 Dégâts directs: ${resultat.directDamage}`);
} else {
    console.log("⚔️ Égalité ! Les deux cartes sont détruites.");
}
