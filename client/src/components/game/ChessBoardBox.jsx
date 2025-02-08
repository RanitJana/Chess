/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import pieceMove, { getColor } from "../../utils/PieceMove.js";
import clearPieceMove from "../../utils/ClearPieceMove.js";
import ChessBoardBoxNumbering from "./ChessBoardBoxNumbering.jsx";
import { useGameContext } from "../../pages/Game.jsx";
import { kingCheck, kingCheckMate } from "../../utils/KingCheck.js";
import getKingPos from "../../utils/KingPos.js";
import {
  colors,
  makeSound,
  getPieceImagePath,
  movingPieceTime,
} from "../../constants.js";
import pawnUpdatePieces from "../../utils/PawanUpdatePieces.js";

function ChessBoardBox({
  row,
  col,
  color,
  piece,
  updateMoves,
  boardDetails,
  isViewer,
  isCheckMate,
}) {
  const {
    chessboard,
    setChessboard,
    currPiece,
    setCurrPiece,
    allMoves,
    playerColor,
    movePossible,
    setMovePossible,
    movingPiece,
    setMovingPiece,
    isUserMove,
    setIsUserMove,
  } = useGameContext();

  const imgPath = getPieceImagePath(piece);
  const [moveInfo, setMoveInfo] = useState(null);
  const [isDragging, setDragging] = useState(false);
  const [offsets, setOffsets] = useState({ offsetX: 0, offsetY: 0 });
  const [pawnPieceDisplay, setPawnPieceDisplay] = useState(false);

  const transparentImage = useRef(new Image());
  const dragImg = useRef(null);
  const boxRef = useRef(null);

  const MemoizedChessBoardBoxNumbering = React.memo(ChessBoardBoxNumbering);

  useEffect(() => {
    transparentImage.current.src =
      "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  }, []);

  //set moving piece location
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

  //prepare pawn promotion .. like display all possible pieces to be updated
  const shouldPreparePawnPromotion = (clearedBoard) => {
    const isSelectedPawn =
      clearedBoard[currPiece.row][currPiece.col] === "p" ||
      clearedBoard[currPiece.row][currPiece.col] === "P";

    if (row === 0 && isSelectedPawn) {
      clearedBoard[currPiece.row][currPiece.col] = " ";
      setChessboard(clearedBoard);
      setPawnPieceDisplay(true);
      setMovePossible(false);
      return true;
    }
    return false;
  };

  //final updation of placing a piece
  const mustMovePiece = (clearedBoard, isPawnPromotion = false) => {
    if (isCheckMate || isViewer()) return;
    clearedBoard[currPiece.row][currPiece.col] = " ";

    //delay a litle to show moving animation
    setTimeout(() => {
      //if it is for pawn promotion then skip placing the pawn to the new location
      if (!isPawnPromotion)
        clearedBoard[row][col] = chessboard[currPiece.row][currPiece.col];
      setCurrPiece({ row: null, col: null, moves: null });
      setChessboard(clearedBoard);

      const pieceColor = getColor(chessboard, row, col);
      makeSound(playerColor, pieceColor);

      setMovingPiece(null);
      setIsUserMove(false);

      const opponentColor =
        playerColor == colors.white ? colors.black : colors.white;
      const kingPosition = getKingPos(clearedBoard, opponentColor);

      const isCheck =
        kingCheck(
          clearedBoard,
          kingPosition.row,
          kingPosition.col,
          opponentColor
        ).length > 0;

      const isCheckMate = kingCheckMate(clearedBoard, opponentColor);

      updateMoves(clearedBoard, {
        from: currPiece,
        to: { row, col },
        color: playerColor,
        piece: chessboard[currPiece.row][currPiece.col],
        takes: chessboard[row][col],
        check: isCheck,
        checkMate: isCheckMate,
      });
    }, movingPieceTime);
  };

  //move a piece logic
  const handlePlacePiece = useCallback(() => {
    if (isViewer() || isCheckMate) return;

    setMovingPiece({ from: currPiece, to: { row, col } });
    const clearedBoard = clearPieceMove(chessboard);

    //move a piece
    if (!shouldPreparePawnPromotion(clearedBoard)) mustMovePiece(clearedBoard);
  }, [isViewer, isCheckMate, setMovingPiece, currPiece, row, col, chessboard]);

  const handleDisplayPossibleMoves = useCallback(() => {
    if (isViewer() || isCheckMate) return;

    const pieceColor = getColor(chessboard, row, col);
    if (pieceColor && playerColor !== pieceColor) return;

    const clearedBoard = clearPieceMove(chessboard);
    const moves = pieceMove(clearedBoard, row, col, true);
    setCurrPiece({ row, col, moves });
  }, [isViewer, isCheckMate, chessboard, row, col, playerColor, setCurrPiece]);

  const handlePieceMove = useCallback(() => {
    if (!movePossible || !isUserMove || isViewer() || isCheckMate) return;
    if (currPiece.moves?.some(([r, c]) => r === row && c === col)) {
      return handlePlacePiece();
    } else {
      return handleDisplayPossibleMoves();
    }
  }, [
    movePossible,
    isUserMove,
    isViewer,
    isCheckMate,
    currPiece.moves,
    row,
    col,
    handlePlacePiece,
    handleDisplayPossibleMoves,
  ]);

  //promote the pawn
  const handlePawnPromotion = (idx) => {
    if (!isUserMove || isViewer() || isCheckMate) return;

    const clearedBoard = clearPieceMove(chessboard.map((row) => [...row]));

    const promotionPieces = ["Q", "R", "B", "N"];
    const piece = promotionPieces[idx];
    clearedBoard[row][col] =
      playerColor === colors.white ? piece : piece.toLowerCase();

    setMovePossible(true);
    setPawnPieceDisplay(false);

    mustMovePiece(clearedBoard, true);
  };

  const handleDragStart = useCallback(
    (e) => {
      if (!dragImg.current) return;

      dragImg.current.style.pointerEvents = "none";
      setDragging(true);

      const offsetX = e.clientX;
      const offsetY = e.clientY;

      setOffsets({ offsetX, offsetY });

      if (isUserMove) handleDisplayPossibleMoves();

      e.dataTransfer.setDragImage(transparentImage.current, 0, 0);
    },
    [dragImg, setDragging, handleDisplayPossibleMoves]
  );

  const handleDragging = (() => {
    let animationFrameId = null;
    let currentLeft = 0;
    let currentTop = 0;

    return (e) => {
      if (!isDragging || !dragImg.current || !boardDetails || !boxRef.current)
        return;

      const boardX = boardDetails.x;
      const boardY = boardDetails.y;
      const boardWidth = boardDetails.width;
      const boardHeight = boardDetails.height;
      const cellInfo = boxRef.current?.getBoundingClientRect();

      dragImg.current.style.zIndex = "1000"; // Bring dragged piece to the front
      // Cancel any ongoing frame requests
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      let newLeft = e.clientX - offsets.offsetX;
      let newTop = e.clientY - offsets.offsetY;
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

      animationFrameId = requestAnimationFrame(() => {
        // Clamp values within board boundaries
        currentLeft = clamp(
          newLeft,
          boardX - cellInfo.x,
          boardX + boardWidth - cellInfo.x - dragImg.current.offsetWidth
        );
        currentTop = clamp(
          newTop,
          boardY - cellInfo.y,
          boardY + boardHeight - cellInfo.y - dragImg.current.offsetHeight
        );

        // Update element position
        dragImg.current.style.left = `${currentLeft}px`;
        dragImg.current.style.top = `${currentTop}px`;
      });
    };
  })();

  const handleDragEnd = useCallback(() => {
    setTimeout(() => {
      setDragging(false);
      if (dragImg.current) {
        dragImg.current.style.transition = "all 0.1s linear";
        dragImg.current.style.pointerEvents = "";
        dragImg.current.style.left = "0px";
        dragImg.current.style.top = "0px";
        dragImg.current.style.zIndex = "10";
        setTimeout(() => {
          dragImg.current.style.transition = "all 0s linear";
        }, 120);
      }
    }, 105);
  }, []);

  const promotionItems = useMemo(() => {
    return pawnUpdatePieces(playerColor).map((val, idx) => (
      <li
        onClick={() => handlePawnPromotion(idx)}
        key={idx}
        className={`relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px] ${idx & 1 ? "bg-[rgb(115,149,82)]" : "bg-[rgb(234,237,208)]"}`}
      >
        <img src={`/images/${val}.png`} alt="" decoding="async" />
      </li>
    ));
  }, [pawnUpdatePieces, currPiece]);

  return (
    <div
      style={{ backgroundColor: color }}
      className="relative w-full aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]"
      onClick={handlePieceMove}
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handlePieceMove}
      ref={boxRef}
    >
      <img
        src={imgPath}
        alt=""
        ref={dragImg}
        className="max-w-full absolute z-10"
        style={{
          transform:
            moveInfo && !isDragging
              ? `translate(${moveInfo.x}% ,${moveInfo.y}%)`
              : "",
          transition: `transform ${movingPieceTime}ms linear`,
        }}
      />
      <img
        src={imgPath}
        alt=""
        className="max-w-full absolute z-20 opacity-0"
        onDrag={handleDragging}
        onDragEnd={handleDragEnd}
        decoding="async"
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

      {pawnPieceDisplay && (
        <ul className="absolute w-full left-0 top-0 z-[100] box shadow-lg shadow-black">
          {promotionItems}
        </ul>
      )}
    </div>
  );
}

export default ChessBoardBox;
