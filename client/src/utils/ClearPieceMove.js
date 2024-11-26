export default function clearPieceMove(chessboard) {
    // Create a new board with '-' replaced by ' ' or any default cell value
    return chessboard.map((row) =>
        row.map((cell) => (cell === '-' ? ' ' : cell))
    );
}
