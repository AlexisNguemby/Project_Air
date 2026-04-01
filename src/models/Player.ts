class Player {
  id: string;
  hp: number;
  stars: number;
  maxStars: number;
  credits: number;
  decks: any[];
  collection: any[];
  avatar: any;

  constructor(id: string) {
    this.id = id;
    this.hp = 12;
    this.stars = 12;
    this.maxStars = 12;
    this.credits = 100;
    this.decks = [];
    this.collection = [];
    this.avatar = null;
  }

  takeDamage(amount: number): number {
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
    return this.hp;
  }

  isAlive(): boolean {
    return this.hp > 0;
  }

  gainStar(): number {
    if (this.stars < this.maxStars) {
      this.stars++;
    }
    return this.stars;
  }

  useStars(amount: number): boolean {
    if (this.stars >= amount) {
      this.stars -= amount;
      return true;
    }
    return false;
  }

  canUseResonance(): boolean {
    return this.stars >= 3;
  }

  activateResonance(): boolean {
    return this.useStars(3);
  }

  getPowerMultiplier(starsSpent: number): number {
    if (starsSpent <= 0) return 1;
    return Math.pow(2, starsSpent);
  }
}

export default Player;