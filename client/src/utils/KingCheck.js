/* eslint-disable no-unused-vars */
import { getColor, queen, knight } from "./PieceMove.js";

//this function will return  true if the position is safe
const kingCheck = (chessboard, row, col, kingColor) => {
  let allMoves = [
    ...queen(chessboard, row, col, kingColor),
    ...knight(chessboard, row, col, kingColor),
  ];

  let pieceColor;

  let threatPieces = allMoves.filter(([row, col]) => {
    pieceColor = getColor(chessboard, row, col);
    return pieceColor && pieceColor != kingColor;
  });

  return threatPieces;
};

const kingCheckMate = (chessboard, row, col, kingColor) => {};

export { kingCheck, kingCheckMate };
