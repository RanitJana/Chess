import { colors, getPieceImagePath } from "../../constants.js";

export default function pawnUpdatePieces(playerColor) {
  if (playerColor === colors.black) {
    return [
      getPieceImagePath("q"),
      getPieceImagePath("r"),
      getPieceImagePath("b"),
      getPieceImagePath("n"),
    ];
  }
  return [
    getPieceImagePath("Q"),
    getPieceImagePath("R"),
    getPieceImagePath("B"),
    getPieceImagePath("N"),
  ];
}
