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
import { captureSound, moveSound } from "../../utils/Sounds.js";
import { useGameContext } from "../../pages/Game.jsx";
import { kingCheck, kingCheckMate } from "../../utils/KingCheck.js";
import getKingPos from "../../utils/KingPos.js";

function ChessBoardBox({
  row,
  col,
  color,
  piece,
  updateMoves,
  boardDetails,
  isViewer,
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
    setUserMove,
  } = useGameContext();

  const [imgPath, setImgPath] = useState("");
  const pawnUpdatePieces = useMemo(() => {
    if (playerColor === "black") {
      return ["queen-b", "rook-b", "bishop-b", "knight-b"];
    }
    return ["queen-w", "rook-w", "bishop-w", "knight-w"];
  }, [playerColor]);

  const [moveInfo, setMoveInfo] = useState(null);
  const [isDragging, setDragging] = useState(false);

  const [offsets, setOffsets] = useState({ offsetX: 0, offsetY: 0 });

  const transparentImage = useRef(new Image());
  useEffect(() => {
    transparentImage.current.src =
      "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  }, []);

  const dragImg = useRef(null);
  const boxRef = useRef(null);

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

  const [pawnPieceDisplay, setPawnPieceDisplay] = useState(false);

  const handlePlacePiece = useCallback(() => {
    if (isViewer()) return;
    setMovingPiece({
      from: { row: currPiece.row, col: currPiece.col },
      to: { row, col },
    });

    const color = getColor(chessboard, row, col);
    const sound = color && color !== playerColor ? "capture" : "move";

    const clearedBoard = clearPieceMove(chessboard);

    if (
      row === 0 &&
      (clearedBoard[currPiece.row][currPiece.col] === "p" ||
        clearedBoard[currPiece.row][currPiece.col] === "P")
    ) {
      clearedBoard[currPiece.row][currPiece.col] = " ";
      setChessboard(clearedBoard);
      setPawnPieceDisplay(true);
      setMovePossible(false);
    } else {
      clearedBoard[currPiece.row][currPiece.col] = " ";
      setTimeout(() => {
        clearedBoard[row][col] = chessboard[currPiece.row][currPiece.col];

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
        const opponentColor = playerColor == "white" ? "black" : "white";
        const kingPosition = getKingPos(clearedBoard, opponentColor);
        const isCheck = kingCheck(
          clearedBoard,
          kingPosition.row,
          kingPosition.col,
          opponentColor
        );
        const isCheckMate = kingCheckMate(clearedBoard, opponentColor);
        updateMoves(clearedBoard, {
          from: { row: currPiece.row, col: currPiece.col },
          to: { row, col },
          color: playerColor,
          piece: chessboard[currPiece.row][currPiece.col],
          takes: chessboard[row][col],
          check: isCheck.length > 0,
          checkMate: isCheckMate,
        });
      }, 100);
    }
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
    if (isViewer()) return;
    const color = getColor(chessboard, row, col);
    if (color && playerColor !== color) return;

    const clearedBoard = clearPieceMove(chessboard);
    const moves = pieceMove(clearedBoard, row, col, true);
    if (moves.length === 0) return;

    setCurrPiece({ row, col, moves });
  }, [chessboard, row, col, playerColor, piece]);

  const handlePieceMove = useCallback(() => {
    if (movePossible === false || !isUserMove || isViewer()) return;
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
    if (!isUserMove || isViewer()) return;
    const clearedBoard = clearPieceMove(chessboard.map((row) => [...row]));

    const promotionPieces = ["Q", "R", "B", "N"];
    const piece = promotionPieces[idx];
    clearedBoard[row][col] =
      playerColor === "white" ? piece : piece.toLowerCase();

    clearedBoard[currPiece.row][currPiece.col] = " ";

    setMovePossible(true);
    setPawnPieceDisplay(false);

    const sound = color && color !== playerColor ? "capture" : "move";

    setTimeout(() => {
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
        color: playerColor,
        piece: chessboard[currPiece.row][currPiece.col],
        takes: chessboard[row][col],
      });
    }, 100);
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
    [pawnUpdatePieces, currPiece]
  );

  return (
    <span
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
          ...(moveInfo && !isDragging
            ? {
                transform: `translate(${moveInfo.x}% ,${moveInfo.y}%)`,
                transition: "transform 0.1s linear",
              }
            : {}),
          transition: "transform 0.1s linear",
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
    </span>
  );
}

export default ChessBoardBox;
