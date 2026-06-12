import Board from "./Board.js";
import Player from "./Player.js";
type GameState = "ongoing" | "player1_wins" | "player2_wins";
declare class Game {
    player1: Player;
    player2: Player;
    board: Board;
    currentTurn: number;
    state: GameState;
    constructor(player1: Player, player2: Player);
    isOngoing(): boolean;
    getWinner(): Player | null;
}
export default Game;
//# sourceMappingURL=Game.d.ts.map