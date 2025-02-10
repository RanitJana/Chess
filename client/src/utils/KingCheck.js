/* eslint-disable no-unused-vars */
import pieceMove, { getColor, queen, knight } from "./PieceMove.js";

//this function will return  true if the position is safe else which piece is threat
const kingCheck = (chessboard, row, col, kingColor) => {
  //estimate all the possible position where threat can come
  let allMoves = [
    ...queen(chessboard, row, col, kingColor),
    ...knight(chessboard, row, col, kingColor),
  ];

  let pieceColor;

  //decide wheather those positions are filled by opponent's any piece
  let threatPositions = allMoves.filter(([r, c]) => {
    pieceColor = getColor(chessboard, r, c);
    return pieceColor && pieceColor != kingColor;
  });

  //now decide wheather the positions are filled by the pieces which cause threat
  let threatPieces = threatPositions.filter(([r, c]) => {
    //when our king found a threate against oppnent's king and we have to see if the position is vaild
    if (
      (kingColor == "white" && chessboard[r][c] == "k") ||
      (kingColor == "black" && chessboard[r][c] == "K")
    ) {
      if (row == r || row == r - 1 || row == r + 1) {
        if (col == c || col == c - 1 || col == c + 1) return true;
      }
      return false;
    }
    //same goes for pawn
    else if (
      (kingColor == "white" && chessboard[r][c] == "p") ||
      (kingColor == "black" && chessboard[r][c] == "P")
    ) {
      return r == row - 1 && (c == col - 1 || c == col + 1);
    }
    //otherwise general case
    else {
      let threatPieceMoves = pieceMove(chessboard, r, c);
      return threatPieceMoves.some(([r, c]) => r == row && c == col);
    }
  });

  return threatPieces;
};

const kingCheckMate = (chessboard, color, isPawnOpponent) => {
  //get all same color pieces
  //fetch possible moves for each pieces
  //if none of them is able to protect the king then this is checkmate

  const allPiecesPositions = [];
  chessboard.forEach((row, rowIdx) =>
    row.forEach((_, colIdx) => {
      if (getColor(chessboard, rowIdx, colIdx) == color)
        allPiecesPositions.push([rowIdx, colIdx]);
    })
  );

  const isCheckMate = allPiecesPositions.reduce((prev, [row, col]) => {
    let moves = pieceMove(chessboard, row, col, color);
    if (isPawnOpponent && chessboard[row][col].toLowerCase() == "p") {
      moves = moves.filter(([r, _]) => r >= row);
    }
    return moves?.length === 0 && prev;
  }, true);

  return isCheckMate;
};

export { kingCheck, kingCheckMate };
