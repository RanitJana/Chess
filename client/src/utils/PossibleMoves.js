export default function possibleMoves(chessboard, moves, setChessboard) {
  // Create a new board to ensure immutability
  const newChessboard = chessboard.map((row) => [...row]);

  moves?.forEach(([row, col]) => {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      newChessboard[row][col] = "-";
    }
  });

  setChessboard(newChessboard);
}
