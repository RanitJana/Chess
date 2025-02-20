/* eslint-disable react/prop-types */
import { colors, getPieceImagePath, getThemeColor } from "../../constants.js";
import { Chess } from "chess.js";
import getHighlightColor from "../../utils/game/getHighlightedColor.js";
import { getSquareName } from "../../utils/game/getSquareNames.js";

function ChessBoardPreview({ board, playerColor, moves }) {
  const themeColor = getThemeColor();
  moves = moves?.length > 0 ? JSON.parse(moves) : {};

  return (
    <div
      className="grid grid-cols-8 grid-rows-8 w-full aspect-square"
      style={{
        transform:
          playerColor == colors.black ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      {new Chess(board).board().map((row, rowIdx) => {
        return row.map((piece, colIdx) => {
          piece = piece
            ? piece.color == "w"
              ? piece.type.toUpperCase()
              : piece.type
            : null;
          return (
            <div
              key={rowIdx + colIdx}
              style={{
                backgroundColor:
                  (rowIdx + colIdx) & 1 ? themeColor.dark : themeColor.light,
              }}
              className="aspect-square relative"
            >
              {(moves?.from == getSquareName(rowIdx, colIdx) ||
                moves?.to == getSquareName(rowIdx, colIdx)) && (
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    backgroundColor: getHighlightColor(themeColor.dark, 0.7),
                  }}
                ></div>
              )}
              <img
                src={getPieceImagePath(piece)}
                style={{
                  userSelect: "none",
                  transform:
                    playerColor == colors.black
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
                className=""
                draggable={false}
                alt=""
              />
            </div>
          );
        });
      })}
    </div>
  );
}

export default ChessBoardPreview;
