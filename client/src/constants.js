import { moveSound, captureSound } from "./utils/Sounds.js";

const colors = Object.freeze({
  white: "white",
  black: "black",
});

const soundType = Object.freeze({
  capture: "capture",
  move: "move",
});

const makeSound = (playerColor, targetPieceColor) => {
  const sound =
    targetPieceColor && targetPieceColor !== playerColor
      ? soundType.capture
      : soundType.move;
  switch (sound) {
    case "move":
      moveSound();
      break;
    case "capture":
      captureSound();
      break;
  }
};

const getPieceImagePath = (piece) => {
  const pieceMapping = {
    r: "/images/rook-b.png",
    p: "/images/pawn-b.png",
    n: "/images/knight-b.png",
    b: "/images/bishop-b.png",
    q: "/images/queen-b.png",
    k: "/images/nrking-b.png",
    R: "/images/rook-w.png",
    P: "/images/pawn-w.png",
    N: "/images/knight-w.png",
    B: "/images/bishop-w.png",
    Q: "/images/queen-w.png",
    K: "/images/nrking-w.png",
  };
  return pieceMapping[piece] || "";
};

const movingPieceTime = 100; //ns

export { colors, makeSound, getPieceImagePath, movingPieceTime };
