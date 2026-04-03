// CombatService.js

// calcul des degats

// victoire / defaite d'une carte

// attaque directe

import CombatResult from "../models/CombatResult.js";

class CombatService {

  /**
   * Phase 1: Duel entre deux cartes
   * @param {Card} attackerCard 
   * @param {Card} defenderCard 
   * @param {number} attackerStarsUsed - Etoiles utilisees par l'attaquant (multiplie puissance)
   * @param {number} defenderStarsUsed - Etoiles utilisees par le defenseur (multiplie puissance)
   * @returns {CombatResult}
   */
  resolveCombat(attackerCard, defenderCard, attackerStarsUsed = 0, defenderStarsUsed = 0) {
    if (!attackerCard || !defenderCard) {
      return null; // slot vide, pas de combat
    }

    // Calcul des multiplicateurs (2^etoiles)
    const attackerMultiplier = attackerStarsUsed > 0 ? Math.pow(2, attackerStarsUsed) : 1;
    const defenderMultiplier = defenderStarsUsed > 0 ? Math.pow(2, defenderStarsUsed) : 1;

    // 1. Calcul de la puissance finale (base * multiplicateur)
    const attackerPower = attackerCard.getEffectivePower() * attackerMultiplier;
    const defenderPower = defenderCard.getEffectivePower() * defenderMultiplier;

    // 2. Determination du gagnant
    if (attackerPower > defenderPower) {
      return this.createResult(attackerCard, defenderCard, attackerPower, defenderPower);
    }

    if (defenderPower > attackerPower) {
      return this.createResult(defenderCard, attackerCard, defenderPower, attackerPower);
    }

    // Egalite -> les deux cartes meurent, pas de degats directs
    return new CombatResult(null, null, 0, attackerPower, defenderPower);
  }

  /**
   * Cree le resultat du duel (sans resonance - degats de base)
   */
  createResult(winner, loser, winnerPower, loserPower) {
    const directDamage = winner.getEffectiveAttack();

    return new CombatResult(
      winner,
      loser,
      directDamage,
      winnerPower,
      loserPower
    );
  }

  /**
   * Phase 2: Calcule les degats directs avec resonance optionnelle
   * @param {Card} winnerCard - La carte gagnante du duel
   * @param {boolean} useResonance - Active la resonance (+2 degats)
   * @returns {number} - Degats finaux
   */
  calculateDirectDamage(winnerCard, useResonance = false) {
    const baseDamage = winnerCard.getEffectiveAttack();
    const resonanceBonus = useResonance ? 2 : 0;
    return baseDamage + resonanceBonus;
  }
}

export default CombatService;
