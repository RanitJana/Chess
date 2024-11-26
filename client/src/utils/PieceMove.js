/* eslint-disable no-unused-vars */
//a function to get a piece's color where capitals are white and small are black otherwise null
const getColor = function (chessboard, row, col) {
    if (row < 0 || row > 8 || col < 0 || col > 8) return null;
    let piece = chessboard[row][col];

    if (piece >= 'A' && piece <= 'Z') return "white";
    if (piece >= 'a' && piece <= 'z') return "black";

    return null;
}

export { getColor }

//function to calculate the paws's possible move
//en passant move is not written in this logic***********
const pawn = function (chessboard, row, col) {

    //get the color of the pawn to decide to take opposite color piece if possible
    let pawnColor = getColor(chessboard, row, col);

    let move1 = [row - 1, col];//single step
    let move2 = [row - 2, col];//initial double step;
    let move3 = [row - 1, col + 1];//takes
    let move4 = [row - 1, col - 1];//takes

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
}

const knight = function (chessboard, row, col) {


}

const queen = function (chessboard, row, col) {

}

const bishop = function (chessboard, row, col) {

}

const rook = function (chessboard, row, col) {

}

const king = function (chessboard, row, col) {

}

//this function will return an array of positions
export default function pieceMove(chessboard, row, col) {

    //no need to check if row and col is out of bound
    let piece = chessboard[row][col];

    if (piece == 'p' || piece == 'P') return pawn(chessboard, row, col);
    if (piece == 'q' || piece == 'Q') return queen(chessboard, row, col);
    if (piece == 'n' || piece == 'N') return knight(chessboard, row, col);
    if (piece == 'b' || piece == 'B') return bishop(chessboard, row, col);
    if (piece == 'r' || piece == 'R') return rook(chessboard, row, col);
    if (piece == 'k' || piece == 'K') return king(chessboard, row, col);

    return [];
}