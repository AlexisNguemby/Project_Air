// Game.js

// joueurs

// tour actuel

// état de la partie

class Game {
  constructor(player1, player2){
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Board();
    this.currentTurn = 1;
    this.state = "ongoing";
  }
}
