//a function to get a piece's color where capitals are white and small are black otherwise null
import isKingCheck from "./IsKingCheck.js";
import { kingCheck } from "./KingCheck.js";
import filterPieceMovesToPreventCheck from "./KingCheckPrevent.js";
import { colors } from "../constants.js";
import isCastlingPossible from "./Castling.js";

const getColor = function (chessboard, row, col) {
  if (row < 0 || row > 7 || col < 0 || col > 7) return null;
  let piece = chessboard[row][col];

  if (piece >= "A" && piece <= "Z") return colors.white;
  if (piece >= "a" && piece <= "z") return colors.black;

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
    [row - 2, col - 1],
  ];

  let destinationColor;

  //filter out valid moves-> if destination cell is empty of opposite color
  let finalMoves = moves.filter(([r, c]) => {
    destinationColor = getColor(chessboard, r, c);
    return destinationColor != knightColor;
  });

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

  let destinationColor;

  //loop until valid row and col
  for (; r >= 0 && c < 8; r--, c++) {
    //get destination color
    destinationColor = getColor(chessboard, r, c);

    //if both color is same then the current and next position is unreachable, so break the loop
    if (destinationColor == bishopColor) break;

    //valid move
    //if the position is occupied by opponent's piece then add position and break
    //otherwise for empty cell just loop for next position
    finalMoves.push([r, c]);
    if (destinationColor && destinationColor != bishopColor) break;
  }

  //top-left corner
  (r = row - 1), (c = col - 1);
  for (; r >= 0 && c >= 0; r--, c--) {
    destinationColor = getColor(chessboard, r, c);
    if (destinationColor == bishopColor) break;
    finalMoves.push([r, c]);
    if (destinationColor && destinationColor != bishopColor) break;
  }

  //bottom-left corner
  (r = row + 1), (c = col - 1);
  for (; r < 8 && c >= 0; r++, c--) {
    destinationColor = getColor(chessboard, r, c);
    if (destinationColor == bishopColor) break;
    finalMoves.push([r, c]);
    if (destinationColor && destinationColor != bishopColor) break;
  }

  //bottom-right corner
  (r = row + 1), (c = col + 1);
  for (; r < 8 && c < 8; r++, c++) {
    destinationColor = getColor(chessboard, r, c);
    if (destinationColor == bishopColor) break;
    finalMoves.push([r, c]);
    if (destinationColor && destinationColor != bishopColor) break;
  }

  return finalMoves;
};

//function to calcuate a rook's possible move
const rook = function (chessboard, row, col, rookColor) {
  let finalMoves = [];

  //top
  let r = row - 1,
    c;

  let destinationColor;
  for (; r >= 0; r--) {
    destinationColor = getColor(chessboard, r, col);
    if (destinationColor == rookColor) break;
    finalMoves.push([r, col]);
    if (destinationColor && destinationColor != rookColor) break;
  }

  //bottom
  r = row + 1;
  for (; r < 8; r++) {
    destinationColor = getColor(chessboard, r, col);
    if (destinationColor == rookColor) break;
    finalMoves.push([r, col]);
    if (destinationColor && destinationColor != rookColor) break;
  }

  //right
  c = col + 1;
  for (; c < 8; c++) {
    destinationColor = getColor(chessboard, row, c);
    if (destinationColor == rookColor) break;
    finalMoves.push([row, c]);
    if (destinationColor && destinationColor != rookColor) break;
  }

  //left
  (r = row), (c = col - 1);
  for (; c >= 0; c--) {
    destinationColor = getColor(chessboard, row, c);
    if (destinationColor == rookColor) break;
    finalMoves.push([row, c]);
    if (destinationColor && destinationColor != rookColor) break;
  }
  return finalMoves;
};

//function to calculate the king's possible moves
const king = function (chessboard, row, col, kingColor, caslingRights) {
  let finalMoves = [];
  let destinationColor;

  //top
  let r = row - 1,
    c = col - 1;
  for (let i = 0; i < 3; i++) {
    destinationColor = getColor(chessboard, r, c);

    if (destinationColor != kingColor && r >= 0 && c >= 0 && c < 8)
      finalMoves.push([r, c]);
    c++;
  }

  //bottom
  (r = row + 1), (c = col - 1);
  for (let i = 0; i < 3; i++) {
    destinationColor = getColor(chessboard, r, c);

    if (destinationColor != kingColor && r < 8 && c >= 0 && c < 8)
      finalMoves.push([r, c]);
    c++;
  }

  //left
  destinationColor = getColor(chessboard, row, col - 1);
  if (destinationColor != kingColor && col - 1 >= 0)
    finalMoves.push([row, col - 1]);

  //right
  destinationColor = getColor(chessboard, row, col + 1);
  if (destinationColor != kingColor && col + 1 < 8)
    finalMoves.push([row, col + 1]);

  //castling moves
  finalMoves = [
    ...finalMoves,
    ...isCastlingPossible(chessboard, row, col, kingColor, caslingRights),
  ];

  //create a copy of current chessboard which will help us to decide the danger positions
  let newChessBoard = chessboard.map((row) => row.slice());

  //filter out safe positions
  finalMoves = finalMoves.filter(([r, c]) => {
    //place the king's position to valid cell
    newChessBoard[r][c] = chessboard[row][col];
    newChessBoard[row][col] = " ";

    //check if the position is danger free or not
    let checks = kingCheck(newChessBoard, r, c, kingColor);
    //make the board same as previous
    newChessBoard[r][c] = chessboard[r][c];
    newChessBoard[row][col] = chessboard[row][col];

    //return true is the position is danger free
    return checks.length == 0;
  });

  return finalMoves;
};

//this function will return an array of positions
export default function pieceMove(chessboard, row, col, caslingRights = "") {
  //no need to check if row and col is out of bound
  const piece = chessboard[row][col].toLowerCase(),
    pieceColor = getColor(chessboard, row, col);

  let finalMoves = [];

  if (piece == "p") finalMoves = pawn(chessboard, row, col, pieceColor);
  else if (piece == "q") finalMoves = queen(chessboard, row, col, pieceColor);
  else if (piece == "n") finalMoves = knight(chessboard, row, col, pieceColor);
  else if (piece == "b") finalMoves = bishop(chessboard, row, col, pieceColor);
  else if (piece == "r") finalMoves = rook(chessboard, row, col, pieceColor);
  else if (piece == "k")
    finalMoves = king(chessboard, row, col, pieceColor, caslingRights);

  if (piece != "k") {
    //if king is in danger and if current piece is able to protect it or not;
    finalMoves = isKingCheck(chessboard, finalMoves, row, col, pieceColor);

    //check if possible moves can endenger the king
    finalMoves = filterPieceMovesToPreventCheck(
      chessboard,
      finalMoves,
      row,
      col,
      pieceColor
    );
  }

  return finalMoves;
}

export { getColor, knight, queen };
