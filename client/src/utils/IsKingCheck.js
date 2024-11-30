import { kingCheck } from "./KingCheck.js";
import getKingPos from "./KingPos.js";
import pieceMove from "./PieceMove.js";

//a function that will return an array of threat
export default function isKingCheck(chessboard, finalMoves, row, col, color) {
  if (chessboard[row][col] == "K" && chessboard[row][col] == "k") return;

  let val = getKingPos(chessboard, color);

  let checks = kingCheck(chessboard, val.row, val.col, color);

  let moves = checks.reduce((prev, [r, c]) => {
    return [...prev, ...pieceMove(chessboard, r, c)];
  }, []);

  if (checks.length) {
    finalMoves = finalMoves.filter(([r1, c1]) => {
      return moves.some(([r2, c2]) => r1 == r2 && c1 == c2);
    });
  }

  return finalMoves;
}
