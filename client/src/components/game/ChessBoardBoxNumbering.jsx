/* eslint-disable react/prop-types */
import { useCallback } from "react";
import { colors } from "../../constants.js";

const getHighlightColor = (rgbString, alpha = 0.6) => {
  const rgbValues = rgbString.match(/\d+/g);
  if (!rgbValues) return rgbString; // Return original if invalid

  let [r, g, b] = rgbValues.map(Number);

  // Lighten the color and push towards warm tones
  r = Math.min(r + 60, 255); // Increase Red significantly
  g = Math.min(g + 50, 255); // Increase Green
  b = Math.max(b - 40, 0); // Decrease Blue to make it warmer

  return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Add transparency
};

function ChessBoardBoxNumbering({
  allMoves = [],
  row,
  col,
  currPiece,
  color,
  themeColor,
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
        <div
          className="absolute h-full w-full"
          style={{ backgroundColor: getHighlightColor(themeColor.dark, 0.6) }}
        ></div>
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
              color == themeColor.dark ? themeColor.light : themeColor.dark,
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
              color == themeColor.dark ? themeColor.light : themeColor.dark,
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
