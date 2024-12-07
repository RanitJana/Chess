/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { convertTo2DArray } from "./ChessBoard.jsx";

function ChessBoardPreview({ boardString, playerColor }) {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    if (playerColor == "black") {
      boardString = boardString.split("").reverse().join("");
    }

    setBoard(convertTo2DArray(boardString));
  }, [playerColor]);

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

  return (
    <div className="grid grid-cols-8 w-full aspect-square">
      {board?.map((row, rowIdx) => {
        return row.map((piece, pieceIdx) => {
          const color =
            (pieceIdx + rowIdx) % 2 === 0
              ? "rgb(234,237,208)"
              : "rgb(115,149,82)";
          return (
            <div
              key={rowIdx + pieceIdx}
              style={{ backgroundColor: color }}
              className="aspect-square"
            >
              <img src={pieceMapping[piece]} alt="" />
            </div>
          );
        });
      })}
    </div>
  );
}

export default ChessBoardPreview;
