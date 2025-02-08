/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { convertTo2DArray } from "../../pages/Game.jsx";
import { colors, getPieceImagePath, getThemeColor } from "../../constants.js";

function ChessBoardPreview({ boardString, playerColor }) {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    if (playerColor == colors.black) {
      boardString = boardString.split("").reverse().join("");
    }

    setBoard(convertTo2DArray(boardString));
  }, [playerColor]);

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full aspect-square">
      {board?.map((row, rowIdx) => {
        return row.map((piece, pieceIdx) => {
          const themeColor = getThemeColor();
          return (
            <div
              key={rowIdx + pieceIdx}
              style={{
                backgroundColor:
                  (rowIdx + pieceIdx) & 1 ? themeColor.dark : themeColor.light,
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
