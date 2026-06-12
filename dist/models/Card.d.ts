declare class Card {
    name: string;
    faction: string;
    power: number;
    attack: number;
    description: string;
    image: string;
    constructor(name: string, faction: string, power: number, attack: number, description: string, image?: string);
    getEffectivePower(): number;
    getEffectiveAttack(): number;
}
export default Card;
//# sourceMappingURL=Card.d.ts.map