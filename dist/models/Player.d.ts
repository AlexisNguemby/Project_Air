declare class Player {
    id: string;
    hp: number;
    stars: number;
    maxStars: number;
    credits: number;
    decks: any[];
    collection: any[];
    avatar: any;
    constructor(id: string);
    takeDamage(amount: number): number;
    isAlive(): boolean;
    gainStar(): number;
    useStars(amount: number): boolean;
    canUseResonance(): boolean;
    activateResonance(): boolean;
    getPowerMultiplier(starsSpent: number): number;
}
export default Player;
//# sourceMappingURL=Player.d.ts.map