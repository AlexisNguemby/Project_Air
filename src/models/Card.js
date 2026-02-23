
// Card.js

// faction

// puissance

// attaque
// Nom




class Card {
    constructor(name, faction, power, attack,description,image = "") {
        this.name = name;
        this.faction= faction;
        this.power = power;
        this.attack = attack;
        this.description = description;
        this.image = image; 

    }

    getEffectivePower() {
        return this.power;
    }

    getEffectiveAttack() {
        return this.attack;
    }

}

export default Card;