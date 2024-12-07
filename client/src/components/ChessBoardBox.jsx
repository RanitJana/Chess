/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import pieceMove, { getColor } from "../utils/PieceMove.js";
import clearPieceMove from "../utils/ClearPieceMove.js";
import ChessBoardBoxNumbering from "./ChessBoardBoxNumbering.jsx";
import { captureSound, moveSound } from "../utils/Sounds.js";

function ChessBoardBox({
  color,
  piece,
  chessboard,
  setChessboard,
  currPiece,
  setCurrPiece,
  allMoves,
  row,
  col,
  playerColor,
  movePossible,
  setMovePossible,
  movingPiece,
  setMovingPiece,
  isUserMove,
  setUserMove,
  updateMoves,
}) {
  const [imgPath, setImgPath] = useState("");
  const pawnUpdatePieces = useMemo(() => {
    if (playerColor === "black") {
      return ["queen-b", "rook-b", "bishop-b", "knight-b"];
    }
    return ["queen-w", "rook-w", "bishop-w", "knight-w"];
  }, [playerColor]);

  const [moveInfo, setMoveInfo] = useState(null);
  const [isDragging, setDragging] = useState(false);

  const [dragImg, setDragImg] = useState(null);

  useEffect(() => {
    const assignValue = () => {
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
      setImgPath(pieceMapping[piece] || "");
    };
    assignValue();
  }, [piece]);

  useEffect(() => {
    if (
      !movingPiece ||
      movingPiece.from.row !== row ||
      movingPiece.from.col !== col
    )
      return;
    const x = (movingPiece.to.col - movingPiece.from.col) * 100;
    const y = (movingPiece.to.row - movingPiece.from.row) * 100;
    setMoveInfo({ x, y });

    setTimeout(() => setMoveInfo(null), 300);
  }, [movingPiece, row, col]);

  useEffect(() => {
    const img = new Image();
    img.src = imgPath;
    img.style.pointerEvents = "none";
    img.style.position = "absolute";
    img.style.opacity = "1";
    setDragImg(img);
  }, [imgPath]);

  const handlePlacePiece = useCallback(() => {
    setMovingPiece({
      from: { row: currPiece.row, col: currPiece.col },
      to: { row, col },
    });

    const color = getColor(chessboard, row, col);
    const sound = color && color !== playerColor ? "capture" : "move";

    const clearedBoard = clearPieceMove(chessboard);
    clearedBoard[currPiece.row][currPiece.col] = " ";

    setTimeout(() => {
      clearedBoard[row][col] = chessboard[currPiece.row][currPiece.col];
      // if (
      //   row === 0 &&
      //   (clearedBoard[row][col] === "p" || clearedBoard[row][col] === "P")
      // ) {
      //   setMovePossible(false);
      // }

      setCurrPiece({ row: null, col: null, moves: null });
      setChessboard(clearedBoard);

      switch (sound) {
        case "move":
          moveSound();
          break;
        case "capture":
          captureSound();
          break;
      }

      setMovingPiece(null);
      setUserMove(false);
      updateMoves(clearedBoard, {
        from: { row: currPiece.row, col: currPiece.col },
        to: { row, col },
      });
    }, 100);
  }, [
    currPiece,
    chessboard,
    row,
    col,
    playerColor,
    setMovePossible,
    setChessboard,
    setCurrPiece,
    setMovingPiece,
    updateMoves,
  ]);

  const handleDisplayPossibleMoves = useCallback(() => {
    const color = getColor(chessboard, row, col);
    if (color && playerColor !== color) return;

    const clearedBoard = clearPieceMove(chessboard);
    const moves = pieceMove(clearedBoard, row, col, true);
    if (moves.length === 0) return;

    setCurrPiece({ row, col, moves });
  }, [chessboard, row, col, playerColor, piece]);

  const handlePieceMove = useCallback(() => {
    if (movePossible === false || !isUserMove) return;
    if (currPiece.moves?.some(([r, c]) => r === row && c === col)) {
      return handlePlacePiece();
    } else {
      return handleDisplayPossibleMoves();
    }
  }, [
    currPiece,
    row,
    col,
    movePossible,
    isUserMove,
    handlePlacePiece,
    handleDisplayPossibleMoves,
  ]);

  const handlePawnPromotion = (_, idx) => {
    if (!isUserMove) return;
    setCurrPiece({ row, col });
    const newChessBoard = chessboard.map((row) => [...row]);

    const promotionPieces = ["Q", "R", "B", "N"];
    const piece = promotionPieces[idx];
    newChessBoard[row][col] =
      playerColor === "white" ? piece : piece.toLowerCase();

    setMovePossible(true);
    setChessboard(newChessBoard);
    // handlePlacePiece();
  };

  const handleDragStart = (e) => {
    const { width, height } = e.target.getBoundingClientRect();
    dragImg.style.width = `${width}px`;
    dragImg.style.height = `${height}px`;
    e.dataTransfer.setDragImage(dragImg, width / 2, height / 2);
    setDragging(true);
    handleDisplayPossibleMoves();
  };

  const MemoizedChessBoardBoxNumbering = React.memo(ChessBoardBoxNumbering);

  const promotionItems = useMemo(
    () =>
      pawnUpdatePieces.map((val, idx) => (
        <li
          onClick={(e) => handlePawnPromotion(e, idx)}
          key={idx}
          style={{
            backgroundColor: idx & 1 ? "rgb(115,149,82)" : "rgb(234,237,208)",
          }}
          className="relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]"
        >
          <img src={`/images/${val}.png`} alt="" />
        </li>
      )),
    [pawnUpdatePieces]
  );

  return (
    <span
      style={{ backgroundColor: color }}
      className="relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]"
      onClick={handlePieceMove}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handlePieceMove}
    >
      <img
        src={imgPath}
        alt=""
        className="max-w-full absolute z-10"
        onDragStart={handleDragStart}
        onDragEnd={() => setDragging(false)}
        style={{
          ...(moveInfo
            ? {
                transform: `translate(${moveInfo.x}% ,${moveInfo.y}%)`,
                transition: "transform 0.1s linear",
              }
            : {}),
          opacity: isDragging ? "0" : "1",
        }}
      />

      <MemoizedChessBoardBoxNumbering
        allMoves={allMoves}
        row={row}
        col={col}
        currPiece={currPiece}
        color={color}
        playerColor={playerColor}
        chessboard={chessboard}
      />

      {row === 0 &&
        (chessboard[row][col] === "p" || chessboard[row][col] === "P") && (
          <ul className="absolute w-full left-0 top-0 z-20 box shadow-lg shadow-black">
            {promotionItems}
          </ul>
        )}
    </span>
  );
}

export default ChessBoardBox;
