export default function roateBoard(chessBoard) {
    let n = chessBoard.length;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
            let top = chessBoard[row][col];
            chessBoard[row][col] = chessBoard[n - 1 - row][col];
            chessBoard[n - 1 - row][col] = top;
        }
    }
    return chessBoard;

}