//a funciton that'll return the desired king's position
export default function getKingPos(chessboard, kingColor) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (kingColor == "white" && chessboard[i][j] == "K")
        return { row: i, col: j };
      if (kingColor == "black" && chessboard[i][j] == "k")
        return { row: i, col: j };
    }
  }
  return { row: -1, col: -1 };
}
