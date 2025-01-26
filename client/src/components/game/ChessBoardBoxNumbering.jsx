/* eslint-disable react/prop-types */

import { useCallback } from "react";
import { colors } from "../../constants.js";

function ChessBoardBoxNumbering({
  allMoves = [],
  row,
  col,
  currPiece,
  color,
  playerColor,
  chessboard,
}) {
  const isValidPositionToColor = useCallback(() => {
    if (!allMoves.length) return false;

    const lastMove = allMoves.slice(-1)[0]; // Get the most recent move
    const { from, to } = lastMove;

    let givenRow1 = from.row,
      givenCol1 = from.col;
    let givenRow2 = to.row,
      givenCol2 = to.col;

    // If the move count is odd and the player is white, reverse the coordinates
    if (
      (allMoves.length % 2 == 0 && playerColor === colors.white) ||
      (allMoves.length % 2 != 0 && playerColor === colors.black)
    ) {
      givenRow1 = 7 - givenRow1;
      givenCol1 = 7 - givenCol1;
      givenRow2 = 7 - givenRow2;
      givenCol2 = 7 - givenCol2;
    }

    // Check if the current position matches the from or to positions
    return (
      (givenRow1 === row && givenCol1 === col) ||
      (givenRow2 === row && givenCol2 === col)
    );
  }, [allMoves, col, playerColor, row]);

  return (
    <>
      {/* recent piece move mark */}
      {allMoves.length && isValidPositionToColor() ? (
        <div className="absolute h-full w-full bg-[#f2ff007e]"></div>
      ) : (
        ""
      )}

      {currPiece.moves?.some(([row1, col1]) => row === row1 && col === col1) ? (
        chessboard[row][col] != " " ? (
          <div
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[95%] h-[95%] rounded-full border-[5px]"
            style={{ borderColor: "rgba(8, 7, 6, 0.2)" }}
          ></div>
        ) : (
          <div
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full max-w-[35%] max-h-[35%] rounded-full"
            style={{ backgroundColor: "rgba(8, 7, 6, 0.2)" }}
          ></div>
        )
      ) : (
        ""
      )}

      {/* numbering */}
      {col == 0 && (
        <span
          className="absolute left-[2px] top-1 font-semibold text-[11px]"
          style={{
            color:
              color == "rgb(115,149,82)"
                ? "rgb(234,237,208)"
                : "rgb(115,149,82)",
          }}
        >
          {playerColor == colors.white ? 8 - row : row + 1}
        </span>
      )}
      {row == 7 && (
        <span
          className="absolute right-[1px] bottom-[-2px] font-semibold text-[11px]"
          style={{
            color:
              color == "rgb(115,149,82)"
                ? "rgb(234,237,208)"
                : "rgb(115,149,82)",
          }}
        >
          {playerColor == colors.white
            ? String.fromCharCode(97 + col)
            : String.fromCharCode(104 - col)}
        </span>
      )}
    </>
  );
}

export default ChessBoardBoxNumbering;
