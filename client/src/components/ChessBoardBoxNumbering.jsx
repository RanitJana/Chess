/* eslint-disable react/prop-types */

function ChessBoardBoxNumbering({
  allMoves = [],
  row,
  col,
  currPiece,
  color,
  playerColor,
  chessboard,
}) {
  return (
    <>
      {/* recent piece move mark */}
      {allMoves.length ? (
        (allMoves.slice(-1)[0].from.row == row &&
          allMoves.slice(-1)[0].from.col == col) ||
        (allMoves.slice(-1)[0].to.row == row &&
          allMoves.slice(-1)[0].to.col == col) ? (
          <div className="absolute h-full w-full bg-[#f2ff007e]"></div>
        ) : (
          ""
        )
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
          {playerColor == "white" ? 8 - row : row + 1}
        </span>
      )}
      {row == 7 && (
        <span
          className="absolute right-[1px] bottom-[-4px] font-semibold text-[11px]"
          style={{
            color:
              color == "rgb(115,149,82)"
                ? "rgb(234,237,208)"
                : "rgb(115,149,82)",
          }}
        >
          {playerColor == "white"
            ? String.fromCharCode(97 + col)
            : String.fromCharCode(104 - col)}
        </span>
      )}
    </>
  );
}

export default ChessBoardBoxNumbering;
