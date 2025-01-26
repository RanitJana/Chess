import { colors } from "../constants.js";

export default function pawnUpdatePieces(playerColor) {
  if (playerColor === colors.black) {
    return ["queen-b", "rook-b", "bishop-b", "knight-b"];
  }
  return ["queen-w", "rook-w", "bishop-w", "knight-w"];
}
