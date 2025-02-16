/* eslint-disable react/prop-types */
import { colors, getPieceImagePath, getThemeColor } from "../../constants.js";
import { Chess } from "chess.js";

function ChessBoardPreview({ board, playerColor }) {
  const themeColor = getThemeColor();

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full aspect-square">
      {(playerColor == colors.black
        ? new Chess(board).revBoard()
        : new Chess(board).board()
      ).map((row, rowIdx) => {
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
              <img
                src={getPieceImagePath(piece)}
                style={{ userSelect: "none" }}
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
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
