import Board from "./Board.js";
import Player from "./Player.js";
class Game {
    player1;
    player2;
    board;
    currentTurn;
    state;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Board();
        this.currentTurn = 0;
        this.state = "ongoing";
    }
    isOngoing() {
        return this.state === "ongoing";
    }
    getWinner() {
        if (this.state === "player1_wins")
            return this.player1;
        if (this.state === "player2_wins")
            return this.player2;
        return null;
    }
}
export default Game;
//# sourceMappingURL=Game.js.map