// GameService.js
// Orchestration de la logique de jeu

import CombatService from "./CombatService.js";

class GameService {
  constructor() {
    this.combatService = new CombatService();
  }

  // Debut du tour : chaque joueur gagne 1 etoile
  startTurn(game) {
    game.player1.gainStar();
    game.player2.gainStar();
    game.currentTurn++;
  }

  /**
   * Resout tous les combats du tour (4 slots)
   * @param {Game} game - Instance du jeu
   * @param {Object} player1Choices - Choix du joueur 1
   * @param {Object} player2Choices - Choix du joueur 2
   */
  resolveAllCombats(game, player1Choices = null, player2Choices = null) {
    const results = [];

    // Valeurs par defaut (aucune etoile, pas de resonance)
    const p1Choices = player1Choices || { starsPerSlot: [0,0,0,0], resonanceSlots: [false,false,false,false] };
    const p2Choices = player2Choices || { starsPerSlot: [0,0,0,0], resonanceSlots: [false,false,false,false] };

    for (let i = 0; i < 4; i++) {
      const playerCard = game.board.playerSlots[i];
      const opponentCard = game.board.opponentSlots[i];

      // Cas 1: Les deux slots ont une carte -> combat
      if (playerCard && opponentCard) {
        const result = this.resolveDuel(game, i, playerCard, opponentCard, p1Choices, p2Choices);
        results.push({ slot: i, type: "combat", result });
      }
      // Cas 2: Seul le joueur a une carte -> attaque directe
      else if (playerCard && !opponentCard) {
        const result = this.resolveDirectAttack(game, i, playerCard, game.player1, game.player2, p1Choices);
        results.push({ slot: i, type: "direct", attacker: "player", ...result });
      }
      // Cas 3: Seul l'adversaire a une carte -> attaque directe
      else if (!playerCard && opponentCard) {
        const result = this.resolveDirectAttack(game, i, opponentCard, game.player2, game.player1, p2Choices);
        results.push({ slot: i, type: "direct", attacker: "opponent", ...result });
      }
      // Cas 4: Aucune carte -> rien ne se passe
    }

    this.checkWinner(game);
    return results;
  }

  /**
   * Phase 1 + 2 : Duel entre deux cartes puis degats
   */
  resolveDuel(game, slotIndex, playerCard, opponentCard, p1Choices, p2Choices) {
    // Phase 1: Duel avec etoiles
    const p1Stars = p1Choices.starsPerSlot[slotIndex] || 0;
    const p2Stars = p2Choices.starsPerSlot[slotIndex] || 0;

    // Consommer les etoiles
    if (p1Stars > 0) game.player1.useStars(p1Stars);
    if (p2Stars > 0) game.player2.useStars(p2Stars);

    const result = this.combatService.resolveCombat(playerCard, opponentCard, p1Stars, p2Stars);

    // Phase 2: Resonance et degats directs
    if (result.winner) {
      const isPlayer1Winner = result.winner === playerCard;
      const winnerChoices = isPlayer1Winner ? p1Choices : p2Choices;
      const winnerPlayer = isPlayer1Winner ? game.player1 : game.player2;
      const loserPlayer = isPlayer1Winner ? game.player2 : game.player1;

      // Activer la resonance si demande et possible
      if (winnerChoices.resonanceSlots[slotIndex] && winnerPlayer.canUseResonance()) {
        winnerPlayer.activateResonance();
        result.applyResonance();
      }

      // Appliquer les degats
      loserPlayer.takeDamage(result.finalDamage);

      // Retirer la carte perdante
      if (isPlayer1Winner) {
        game.board.clearSlot(slotIndex, false);
      } else {
        game.board.clearSlot(slotIndex, true);
      }
    } else {
      // Egalite: les deux cartes meurent
      game.board.clearSlot(slotIndex, true);
      game.board.clearSlot(slotIndex, false);
    }

    return result;
  }

  /**
   * Attaque directe (slot adverse vide)
   */
  resolveDirectAttack(game, slotIndex, card, attackerPlayer, targetPlayer, attackerChoices) {
    let damage = card.getEffectiveAttack();
    let resonanceUsed = false;

    if (attackerChoices.resonanceSlots[slotIndex] && attackerPlayer.canUseResonance()) {
      attackerPlayer.activateResonance();
      damage += 2;
      resonanceUsed = true;
    }

    targetPlayer.takeDamage(damage);
    return { damage, resonanceUsed };
  }

  /**
   * Verifie si un joueur a gagne
   */
  checkWinner(game) {
    if (!game.player1.isAlive()) {
      game.state = "player2_wins";
    } else if (!game.player2.isAlive()) {
      game.state = "player1_wins";
    }
  }

  /**
   * Verifie si la partie est terminee
   */
  isGameOver(game) {
    return game.state !== "ongoing";
  }
}

export default GameService;
