const getSquareName = (row, col) => {
  const files = "abcdefgh",
    ranks = "87654321";
  return files[col] + ranks[row];
};
const getSquareFromMove = (move, playerColor) => {
  // Normal move extraction
  const matches = move.match(/[a-h][1-8]/g);
  if (matches) return matches[0]; // Return the destination square

  // Handle castling moves
  if (move === "O-O") return playerColor === "white" ? "g1" : "g8"; // King-side castling
  if (move === "O-O-O") return playerColor === "white" ? "c1" : "c8"; // Queen-side castling

  return null; // Not a valid move
};

export { getSquareName, getSquareFromMove };
