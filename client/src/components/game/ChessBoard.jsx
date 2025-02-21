import { useState, useEffect, useRef } from "react";
import PlayerInfoInGame from "./PlayerInfoInGame.jsx";
import ChessBoardBox from "./ChessBoardBox.jsx";
import EmptyBoard from "./EmptyBoard.jsx";
import {
  colors,
  winReason,
  getScore,
  makeSound,
  winner,
} from "../../constants.js";
import { useGameContext } from "../../pages/Game.jsx";
import {
  getSquareName,
  getSquareFromMove,
} from "../../utils/game/getSquareNames.js";
import { socket } from "../../socket.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { gameMove } from "../../api/game.js";
import MoveNavigation from "./MoveNavigation.jsx";

const getEvalBarPercentage = (evalScore, isWhiteToMove) => {
  // console.log(evalScore);

  if (typeof evalScore === "string" && evalScore.includes("Mate")) {
    const mateInMoves = parseInt(evalScore.match(/-?\d+/)[0], 10);

    if (mateInMoves > 0) {
      return isWhiteToMove ? 100 : 0; // White to move → White wins → 100%. Black to move → Black wins → 0%.
    } else {
      return isWhiteToMove ? 0 : 100; // White to move → White gets mated → 0%. Black to move → Black gets mated → 100%.
    }
  }

  const maxEval = 10; // Cap at ±10 pawns for better scaling
  let normalized = Math.max(-maxEval, Math.min(maxEval, evalScore));

  // Sigmoid-like transformation for better scaling
  const percentage = 50 + (50 * Math.atan(normalized) * 2) / Math.PI;

  return Math.round(percentage);
};

const getEvaluationFromFEN = (fen, callback) => {
  const engine = new Worker("/stockfish.js");

  engine.onmessage = (event) => {
    if (event.data.startsWith("info depth")) {
      const match = event.data.match(/score (cp|mate) (-?\d+)/);
      if (match) {
        let evalScore;
        if (match[1] === "cp") {
          evalScore = parseInt(match[2], 10) / 100; // Convert centipawns to pawn units
        } else {
          evalScore =
            match[2] > 0 ? "Mate in " + match[2] : "Mated in " + -match[2];
        }
        callback(evalScore);
        engine.terminate();
      }
    }
  };

  engine.postMessage("uci");
  setTimeout(() => {
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage("go depth 15"); // Adjust depth as needed
  }, 500);
};

function ChessBoard() {
  const {
    boardStates,
    setBoardStates,
    users,
    opponent,
    moves,
    setMoves,
    themeColor,
    rotateBoard,
    gameId,
    isCheckMate,
    moveIndex,
    gameInfo,
    handleGameOver,
  } = useGameContext();
  const { onlineUsers } = useSocketContext();

  const [possibleMoves, setPossibleMoves] = useState([]);
  const [points, setPoints] = useState(0);
  const [pawnPromotion, setPawnPromotion] = useState(false);
  const [pawnPieceDisplay, setPawnPieceDisplay] = useState(false);

  const navigationRef = useRef(null);

  const [selectedSquare, setSelectedSquare] = useState("");

  const updatePieceNewLocation = async (from, to, promotion) => {
    if (!selectedSquare) return;

    try {
      boardStates.board.move({ from, to, promotion });
    } catch {
      return;
    }
    setPossibleMoves([]);
    setSelectedSquare("");
    const boardInfo = boardStates.board.fen().split(" ");
    const history = boardStates.board?.history({ verbose: true }) || [];

    makeSound(history[history.length - 1]);
    gameMove({
      gameId,
      board: boardStates.board.fen(),
      moves: [...moves, history[history.length - 1]],
    });
    if (boardStates.board.isCheckmate()) {
      const whoWon = users.you?.color;
      const winnerReason = winReason.byCheckmate;
      const score = getScore(
        gameInfo.player1?.rating,
        gameInfo.player2?.rating,
        whoWon == colors.white
      );
      handleGameOver(whoWon, winnerReason, score);
    } else if (boardStates.board.isInsufficientMaterial()) {
      const whoWon = winner.draw;
      const winnerReason = winReason.byInsufficientMaterial;
      const score = getScore(
        gameInfo.player1?.rating,
        gameInfo.player2?.rating,
        0.5
      );
      handleGameOver(whoWon, winnerReason, score);
    } else if (boardStates.board.isStalemate()) {
      const whoWon = winner.draw;
      const winnerReason = winReason.byStalemate;
      const score = getScore(
        gameInfo.player1?.rating,
        gameInfo.player2?.rating,
        0.5
      );
      handleGameOver(whoWon, winnerReason, score);
    } else if (boardStates.board.isThreefoldRepetition()) {
      const whoWon = winner.draw;
      const winnerReason = winReason.byThreefoldRepetition;
      const score = getScore(
        gameInfo.player1?.rating,
        gameInfo.player2?.rating,
        0.5
      );
      handleGameOver(whoWon, winnerReason, score);
    }

    setMoves((prev) => [...prev, history[history.length - 1]]);

    setBoardStates((prev) => ({
      board: prev.board,
      turn: boardInfo[1] == "w" ? colors.white : colors.black,
      castling: boardInfo[2],
      enPassant: boardInfo[3],
      move: {
        half: parseInt(boardInfo[4]),
        full: parseInt(boardInfo[5]),
      },
    }));

    socket.emit("move-done", {
      fen: boardStates.board.fen(),
      lastMove: JSON.stringify(history[history.length - 1]),
    });
    socket.emit("game-move", {
      gameId,
      board: boardStates.board.fen(),
      moves: JSON.stringify(history[history.length - 1]),
    });
  };

  const handleChessBoxClick = (square) => {
    if (
      users.you?.color[0] != boardStates.turn[0] ||
      isCheckMate ||
      moveIndex < moves?.length - 1
    )
      return;

    const pieceMoveLocation = possibleMoves.filter((val) => {
      return getSquareFromMove(val, users.you?.color) == square;
    });

    if (possibleMoves.length && pieceMoveLocation.length) {
      if (pawnPromotion && !pawnPieceDisplay)
        return setPawnPieceDisplay(square);

      if (selectedSquare != "")
        updatePieceNewLocation(selectedSquare, square, undefined);
    } else {
      setSelectedSquare(square);
      const tempMoves = boardStates.board?.moves({ square });
      if (tempMoves.length && tempMoves[0].indexOf("=") != -1)
        setPawnPromotion(true);
      setPossibleMoves(tempMoves);
    }
  };

  const apprearance = () => {
    const reference = navigationRef.current;
    if (!reference) return;
    if (window.innerWidth < 767) {
      reference.style.transform = "scale(1)";
    } else reference.style.transform = "scale(0)";
  };

  useEffect(() => {
    window.addEventListener("resize", apprearance);
    return () => window.removeEventListener("resize", apprearance);
  }, []);

  useEffect(() => {
    apprearance();
  }, [navigationRef]);

  const [evaluation, setEvaluation] = useState(50); // Start at neutral

  const timeRef = useRef(null);
  useEffect(() => {
    const fen = boardStates.board?.fen();
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(
      getEvaluationFromFEN(fen, (evalScore) => {
        const evalPercentage = getEvalBarPercentage(
          evalScore,
          fen?.split(" ")[1] === "w"
        );
        setEvaluation(evalPercentage);
      }),
      500
    );
  }, [boardStates.board]);

  return (
    <div className=" w-full flex items-center justify-center h-fit">
      <div className="grid grid-cols-1 gap-0 md:w-full w-[min(100%,80dvh)] h-fit">
        <PlayerInfoInGame
          player={users.opponent || {}}
          isOnline={onlineUsers[opponent?._id]}
          opponentColor={users.you?.color}
          allMoves={moves}
          points={points}
          setPoints={setPoints}
        />
        <div className="flex gap-1">
          <div className="w-3 h-full bg-gray-700 relative rounded-sm overflow-hidden">
            <div
              className="absolute bottom-0 w-full bg-white"
              style={{
                transition: "height 0.3s ease",
                height: `${evaluation}%`,
              }}
            />
          </div>
          <div
            className="relative w-full h-fit items-center justify-center flex flex-col"
            style={{ transform: rotateBoard }}
          >
            {/* empty chessboard */}
            {!boardStates.board && (
              <div className="relative w-full h-fit">
                <EmptyBoard />
              </div>
            )}
            {boardStates.board?.board().map((row, rowIdx) => (
              <div className="grid grid-cols-8 w-full gap-0" key={rowIdx}>
                {row.map((piece, colIdx) => {
                  const pieceColor = piece?.color;
                  const key = colIdx + rowIdx;
                  const color = key & 1 ? themeColor.dark : themeColor.light;
                  const square = piece
                    ? piece.square
                    : getSquareName(rowIdx, colIdx);
                  piece = piece
                    ? piece.color == "w"
                      ? piece.type.toUpperCase()
                      : piece.type
                    : null;
                  return (
                    <ChessBoardBox
                      key={key}
                      rowIdx={rowIdx}
                      colIdx={colIdx}
                      color={color}
                      piece={piece}
                      pieceColor={pieceColor}
                      square={square}
                      possibleMoves={possibleMoves}
                      handleChessBoxClick={handleChessBoxClick}
                      pawnPieceDisplay={pawnPieceDisplay}
                      setPawnPieceDisplay={setPawnPieceDisplay}
                      setPawnPromotion={setPawnPromotion}
                      selectedSquare={selectedSquare}
                      updatePieceNewLocation={updatePieceNewLocation}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <PlayerInfoInGame
          player={users.you || {}}
          isOnline={onlineUsers[users.you?._id]}
          opponentColor={users.opponent?.color}
          allMoves={moves}
          points={points}
          setPoints={setPoints}
        />
        <div ref={navigationRef} className="flex justify-between py-2">
          <MoveNavigation />
        </div>
      </div>
    </div>
  );
}

export default ChessBoard;
