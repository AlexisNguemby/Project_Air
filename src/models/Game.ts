import Board from "./Board.js";
import Player from "./Player.js";

type GameState = "ongoing" | "player1_wins" | "player2_wins";

class Game {
  player1: Player;
  player2: Player;
  board: Board;
  currentTurn: number;
  state: GameState;

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Board();
    this.currentTurn = 0;
    this.state = "ongoing";
  }

  isOngoing(): boolean {
    return this.state === "ongoing";
  }

  getWinner(): Player | null {
    if (this.state === "player1_wins") return this.player1;
    if (this.state === "player2_wins") return this.player2;
    return null;
  }
}

export default Game;
