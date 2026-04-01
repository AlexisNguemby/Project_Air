class Card {
  name: string;
  faction: string;
  power: number;
  attack: number;
  description: string;
  image: string;

  constructor(
    name: string,
    faction: string,
    power: number,
    attack: number,
    description: string,
    image: string = ""
  ) {
    this.name = name;
    this.faction = faction;
    this.power = power;
    this.attack = attack;
    this.description = description;
    this.image = image;
  }

  getEffectivePower(): number {
    return this.power;
  }

  getEffectiveAttack(): number {
    return this.attack;
  }
}

export default Card;