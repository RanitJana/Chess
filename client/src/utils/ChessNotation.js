import { colors } from "../constants.js";

export default function convertToChessNotation(move) {
  // Map row and column to chessboard coordinates
  function toChessCoord(row, col, color) {
    // Adjust for black perspective (0-based indexing assumed)
    if (color === colors.black) {
      row = 7 - row;
      col = 7 - col;
    }
    const file = String.fromCharCode(97 + col); // Convert 0-based column to letter ('a' = 0, 'b' = 1, ...)
    const rank = 8 - row; // Convert 0-based row to chess rank ('8' = 0, '7' = 1, ...)
    return `${file}${rank}`;
  }

  // Extract details from the move object
  const { from, to, piece, takes, color, check, checkMate } = move;

  // Get source and destination coordinates
  const fromCoord = toChessCoord(from.row, from.col, color);
  const toCoord = toChessCoord(to.row, to.col, color);

  // Determine if the piece is a pawn ("p" for black, "P" for white, or empty string)
  const isPawn = !piece || piece.toLowerCase() === "p";

  // Build chess notation
  let notation = isPawn ? "" : piece;
  notation =
    color === "white" ? notation.toUpperCase() : notation.toLowerCase(); // Adjust for piece color

  const pieceSymbols = {
    P: "♙",
    p: "♟", // Pawn
    R: "♖",
    r: "♜", // Rook
    N: "♘",
    n: "♞", // Knight
    B: "♗",
    b: "♝", // Bishop
    Q: "♕",
    q: "♛", // Queen
    K: "♔",
    k: "♚", // King
  };

  if (takes && takes.trim() !== "") {
    notation = `${(isPawn ? "" : pieceSymbols[notation]) + fromCoord[0]}x${toCoord}`; // Add capture notation
  } else {
    notation = (isPawn ? "" : pieceSymbols[notation]) + toCoord; // Add destination square
  }

  if (checkMate) notation += "#";
  else if (check) notation += "+";

  return notation;
}
