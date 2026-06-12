class Player {
    id;
    hp;
    stars;
    maxStars;
    credits;
    decks;
    collection;
    avatar;
    constructor(id) {
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
        if (this.hp < 0)
            this.hp = 0;
        return this.hp;
    }
    isAlive() {
        return this.hp > 0;
    }
    gainStar() {
        if (this.stars < this.maxStars) {
            this.stars++;
        }
        return this.stars;
    }
    useStars(amount) {
        if (this.stars >= amount) {
            this.stars -= amount;
            return true;
        }
        return false;
    }
    canUseResonance() {
        return this.stars >= 3;
    }
    activateResonance() {
        return this.useStars(3);
    }
    getPowerMultiplier(starsSpent) {
        if (starsSpent <= 0)
            return 1;
        return Math.pow(2, starsSpent);
    }
}
export default Player;
//# sourceMappingURL=Player.js.map