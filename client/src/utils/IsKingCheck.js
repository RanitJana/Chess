import { kingCheck } from "./KingCheck.js";
import getKingPos from "./KingPos.js";
import pieceMove from "./PieceMove.js";

//a function that will return an array of threat-blocking moves for current piece
export default function isKingCheck(chessboard, finalMoves, row, col, color) {
  //return if current piece is the king
  if (chessboard[row][col] == "K" && chessboard[row][col] == "k")
    return finalMoves;

  //get king's position
  let val = getKingPos(chessboard, color);

  //get all threat pieces
  let checks = kingCheck(chessboard, val.row, val.col, color);

  //the any threat is present
  if (checks.length) {
    //collect all moves for the threat pieces
    let moves = checks.reduce((prev, [r, c]) => {
      return [...prev, ...pieceMove(chessboard, r, c)];
    }, checks);

    //common moves are threat-blocking moves
    finalMoves = finalMoves.filter(([r1, c1]) => {
      return moves.some(([r2, c2]) => r1 == r2 && c1 == c2);
    });
  }

  return finalMoves;
}
