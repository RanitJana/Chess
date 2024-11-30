import { kingCheck } from "./KingCheck.js";
import getKingPos from "./KingPos.js";

//check if possible moves can endenger the king
export default function filterPieceMovesToPreventCheck(
  chessboard,
  finalMoves,
  row,
  col,
  color
) {
  //if the piece is king then just return the possible moves
  if (chessboard[row][col] == "K" && chessboard[row][col] == "k")
    return finalMoves;

  //get king's position
  const kingPos = getKingPos(chessboard, color);

  return finalMoves.filter(([r1, c1]) => {
    //if somehow the location out of range then just return true
    if (r1 < 0 || r1 > 7 || c1 < 0 || c1 > 7) return true;

    //create a copy to get the threat to the king
    const newChessBoard = chessboard.map((row) => [...row]);

    //move the piece
    newChessBoard[row][col] = " ";
    newChessBoard[r1][c1] = chessboard[row][col];

    //get all threat pieces
    //if there are any threat after moving the piece then we must prevent the piece to move
    let moves = kingCheck(newChessBoard, kingPos.row, kingPos.col, color);

    //re-allocate the piece again
    newChessBoard[row][col] = chessboard[row][col];
    newChessBoard[r1][c1] = " ";

    return moves.length == 0;
  });
}
