/* eslint-disable no-unused-vars */
//a function to get a piece's color where capitals are white and small are black otherwise null
import { kingCheck, kingCheckMate } from "./KingCheck.js";

const getColor = function (chessboard, row, col) {
  if (row < 0 || row > 7 || col < 0 || col > 7) return null;
  let piece = chessboard[row][col];

  if (piece >= "A" && piece <= "Z") return "white";
  if (piece >= "a" && piece <= "z") return "black";

  return null;
};

//function to calculate a pawns's possible move
//en passant move is not written in this logic***********
const pawn = function (chessboard, row, col, pawnColor) {
  let move1 = [row - 1, col]; //single step
  let move2 = [row - 2, col]; //initial double step;
  let move3 = [row - 1, col + 1]; //takes
  let move4 = [row - 1, col - 1]; //takes

  //array of array->[row,col]
  let finalMoves = [];

  //when single step is valid
  if (getColor(chessboard, move1[0], move1[1]) === null) {
    finalMoves.push(move1);

    //when double step is valid
    if (row === 6 && getColor(chessboard, move2[0], move2[1]) === null) {
      finalMoves.push(move2);
    }
  }

  //takes

  //right side
  let rightTakeColor = getColor(chessboard, move3[0], move3[1]);

  //if the position is valid and the target piece is opponet then it is a move
  if (col + 1 < 8 && rightTakeColor != null && rightTakeColor != pawnColor) {
    finalMoves.push(move3);
  }

  //left side
  let leftTakeColor = getColor(chessboard, move4[0], move4[1]);

  //if the position is valid and the target piece is opponet then it is a move
  if (col - 1 >= 0 && leftTakeColor != null && leftTakeColor != pawnColor) {
    finalMoves.push(move4);
  }

  return finalMoves;
};

//function to calculate a knight's possible move
const knight = function (chessboard, row, col, knightColor) {
  //allmoves
  let moves = [
    [row - 2, col + 1],
    [row - 1, col + 2],
    [row + 1, col + 2],
    [row + 2, col + 1],
    [row + 2, col - 1],
    [row + 1, col - 2],
    [row - 1, col - 2],
    [row - 2, col - 1]
  ]

  let destinationColor;

  //filter out valid moves-> if destination cell is empty of opposite color
  let finalMoves = moves.filter(([r, c]) => {
    destinationColor = getColor(chessboard, r, c);
    return destinationColor != knightColor;
  })

  return finalMoves;
};

//function to calculate a queen's possible move
const queen = function (chessboard, row, col, queenColor) {
  return [
    ...bishop(chessboard, row, col, queenColor),
    ...rook(chessboard, row, col, queenColor),
  ];
};

//function to calculate a bishop's possible move
const bishop = function (chessboard, row, col, bishopColor) {
  let finalMoves = [];

  //top-right corner
  let r = row - 1,
    c = col + 1;
  for (; r >= 0 && c < 8; r--, c++) {
    const posColor = getColor(chessboard, r, c);
    if (posColor == bishopColor) break;
    finalMoves.push([r, c]);
    if (posColor && posColor != bishopColor) break;
  }

  //top-left corner
  (r = row - 1), (c = col - 1);
  for (; r >= 0 && c >= 0; r--, c--) {
    const posColor = getColor(chessboard, r, c);
    if (posColor == bishopColor) break;
    finalMoves.push([r, c]);
    if (posColor && posColor != bishopColor) break;
  }

  //bottom-left corner
  (r = row + 1), (c = col - 1);
  for (; r < 8 && c >= 0; r++, c--) {
    const posColor = getColor(chessboard, r, c);
    if (posColor == bishopColor) break;
    finalMoves.push([r, c]);
    if (posColor && posColor != bishopColor) break;
  }

  //bottom-right corner
  (r = row + 1), (c = col + 1);
  for (; r < 8 && c < 8; r++, c++) {
    const posColor = getColor(chessboard, r, c);
    if (posColor == bishopColor) break;
    finalMoves.push([r, c]);
    if (posColor && posColor != bishopColor) break;
  }

  return finalMoves;
};

//function to calcuate a rook's possible move
const rook = function (chessboard, row, col, rookColor) {
  let finalMoves = [];

  //top
  let r = row - 1,
    c;
  for (; r >= 0; r--) {
    const posColor = getColor(chessboard, r, col);
    if (posColor == rookColor) break;
    finalMoves.push([r, col]);
    if (posColor && posColor != rookColor) break;
  }

  //bottom
  r = row + 1;
  for (; r < 8; r++) {
    const posColor = getColor(chessboard, r, col);
    if (posColor == rookColor) break;
    finalMoves.push([r, col]);
    if (posColor && posColor != rookColor) break;
  }

  //right
  c = col + 1;
  for (; c < 8; c++) {
    const posColor = getColor(chessboard, row, c);
    if (posColor == rookColor) break;
    finalMoves.push([row, c]);
    if (posColor && posColor != rookColor) break;
  }

  //left
  (r = row), (c = col - 1);
  for (; c >= 0; c--) {
    const posColor = getColor(chessboard, row, c);
    if (posColor == rookColor) break;
    finalMoves.push([row, c]);
    if (posColor && posColor != rookColor) break;
  }
  return finalMoves;
};

const king = function (chessboard, row, col, kingColor) {
  let finalMoves = [];
  let posColor;

  //top
  let r = row - 1,
    c = col - 1;
  for (let i = 0; i < 3; i++) {
    posColor = getColor(chessboard, r, c);

    if (posColor != kingColor && r >= 0 && c >= 0 && c < 8) finalMoves.push([r, c]);
    c++;
  }

  //bottom
  r = row + 1,
    c = col - 1;
  for (let i = 0; i < 3; i++) {
    posColor = getColor(chessboard, r, c);
    if (posColor != kingColor && r < 8 && c >= 0 && c < 8) finalMoves.push([r, c]);
    c++;
  }

  //left 
  posColor = getColor(chessboard, row, col - 1);
  if (posColor != kingColor && c >= 0) finalMoves.push([row, col - 1]);

  //right
  posColor = getColor(chessboard, row, col + 1);
  if (posColor != kingColor && c < 8) finalMoves.push([row, col + 1]);

  let newChessBoard = chessboard.map(row => row.slice());

  finalMoves = finalMoves.filter(([r, c]) => {

    newChessBoard[r][c] = chessboard[row][col];
    newChessBoard[row][col] = ' ';

    let checks = kingCheck(newChessBoard, r, c, kingColor);

    newChessBoard[r][c] = ' ';
    newChessBoard[row][col] = chessboard[row][col];

    return checks.length == 0;
  })

  return finalMoves;
};

//this function will return an array of positions
export default function pieceMove(chessboard, row, col) {
  //no need to check if row and col is out of bound
  const piece = chessboard[row][col],
    pieceColor = getColor(chessboard, row, col);

  if (piece == "p" || piece == "P")
    return pawn(chessboard, row, col, pieceColor);
  if (piece == "q" || piece == "Q")
    return queen(chessboard, row, col, pieceColor);
  if (piece == "n" || piece == "N")
    return knight(chessboard, row, col, pieceColor);
  if (piece == "b" || piece == "B")
    return bishop(chessboard, row, col, pieceColor);
  if (piece == "r" || piece == "R")
    return rook(chessboard, row, col, pieceColor);
  if (piece == "k" || piece == "K")
    return king(chessboard, row, col, pieceColor);

  return [];
}

export { getColor, knight, queen };
