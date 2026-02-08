// Player.js

// points de vie

// étoiles

// crédits

// decks

// collection

class Player{
    constructor(id){
        this.id = id;
        this.hp = 12;
        this.stars = 12;
        this.maxStars = 12;
        this.credits = 100;
        this.decks = [];
        this.collection = [];
        this.avatar = null;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        return this.hp;
    }

    isAlive() {
        return this.hp > 0;
    }

    // === GESTION DES ÉTOILES ===

    // Gagne 1 étoile au début du tour (max 12)
    gainStar() {
        if (this.stars < this.maxStars) {
            this.stars++;
        }
        return this.stars;
    }

    // Dépense des étoiles (retourne true si succès)
    useStars(amount) {
        if (this.stars >= amount) {
            this.stars -= amount;
            return true;
        }
        return false;
    }

    // Vérifie si le joueur peut activer la résonance (coût: 3 étoiles)
    canUseResonance() {
        return this.stars >= 3;
    }

    // Active la résonance (dépense 3 étoiles, retourne true si succès)
    activateResonance() {
        return this.useStars(3);
    }

    // Calcule le multiplicateur de puissance basé sur les étoiles dépensées
    // 1 étoile = x2, 2 étoiles = x4, 3 étoiles = x8, etc.
    getPowerMultiplier(starsSpent) {
        if (starsSpent <= 0) return 1;
        return Math.pow(2, starsSpent);
    }
}

export default Player;