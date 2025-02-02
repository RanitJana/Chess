/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import ChessBoardBox from "./ChessBoardBox.jsx";
import { gameEnd, gameMove } from "../../api/game.js";
import { socket } from "../../socket.js";
import EmptyBoard from "./EmptyBoard.jsx";
import { useGameContext, convertTo2DArray } from "../../pages/Game.jsx";
import { kingCheckMate } from "../../utils/KingCheck.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useSocketContext } from "../../context/SocketContext.jsx";
import PlayerInfoInGame from "./PlayerInfoInGame.jsx";
import {
  colors,
  makeSound,
  movingPieceTime,
  winReason,
} from "../../constants.js";
import { getColor } from "../../utils/PieceMove.js";
import Toast from "../../utils/Toast.js";

export default function ChessBoard() {
  const {
    playerColor,
    allMoves,
    gameId,
    setChessboard,
    setIsUserMove,
    setAllMoves,
    setMovingPiece,
    setCurrPiece,
    chessboard,
    players,
    setCheckMate,
    isCheckMate,
    setWinnerReason,
  } = useGameContext();
  const { playerInfo } = useAuthContext();
  const { onlineUsers } = useSocketContext();

  const userId = playerInfo._id;

  const boardRef = useRef(null);
  const [opponent, setOpponent] = useState(null);

  useEffect(() => {
    if (players)
      setOpponent(() =>
        userId == players.player1._id ? players.player2 : players.player1
      );
  }, [players]);

  const isViewer = () => {
    if (userId != players.player1._id && userId != players.player2._id)
      return true;
  };

  // Handle move updates
  async function updateMoves(clearedBoard, info) {
    if (isViewer()) return;

    let boardString = clearedBoard.map((row) => row.join("")).join("");

    if (playerColor == colors.black)
      boardString = boardString.split("").reverse().join("");

    try {
      socket.emit("game-move", gameId);
      socket.emit("move-done", { boardString, info });

      setAllMoves((prevMoves) => [...prevMoves, info]);

      const response = await gameMove({
        moves: [...allMoves, info],
        gameId,
        board: boardString,
      });

      if (
        kingCheckMate(
          convertTo2DArray(boardString),
          playerColor == colors.white ? colors.black : colors.white
        )
      ) {
        let winner = playerColor;
        const reason = winReason.byCheckmate;

        setCheckMate(winner);
        setWinnerReason(reason);

        await gameEnd({ winner, reason, gameId });
      }

      if (response) {
        const { turn } = response.data.info.game;

        if (turn == playerColor && !isCheckMate) setIsUserMove(true);
        else setIsUserMove(false);
      }
    } catch (error) {
      Toast.error("Error updating moves.. Please try to refresh the page");
      console.error("Error updating moves:", error);
    }
  }

  //hanldle my move after opponent's move
  function handleOpponentMove(val) {
    if (isViewer()) return;

    let updatedBoard = val.boardString;
    let move = val.info;

    if (playerColor === colors.black) {
      updatedBoard = updatedBoard.split("").reverse().join(""); // Reverse only when displaying
    }

    updatedBoard = convertTo2DArray(updatedBoard);

    if (kingCheckMate(updatedBoard, playerColor))
      setCheckMate(playerColor == colors.white ? colors.black : colors.white);

    setIsUserMove(true);

    const opponentMove = {
      from: { row: 7 - move.from.row, col: 7 - move.from.col },
      to: { row: 7 - move.to.row, col: 7 - move.to.col },
    };

    makeSound(
      playerColor,
      getColor(updatedBoard, opponentMove.to.row, opponentMove.to.col)
    );

    // Update the moving piece for animations
    setMovingPiece(opponentMove);

    // Update the allMoves array directly
    setAllMoves((prevMoves) => [...prevMoves, move]);
    setCurrPiece({ row: null, col: null, moves: null });

    // Delay to show animation
    setTimeout(() => {
      setMovingPiece(null);
      setChessboard(updatedBoard);
    }, movingPieceTime);
  }

  useEffect(() => {
    socket.on("opponent-move", handleOpponentMove);
    return () => socket.off("opponent-move", handleOpponentMove);
  }, [allMoves]);

  if (!players || !opponent) return;

  return (
    <div className="grid grid-cols-1 gap-0 md:w-full w-[min(100%,80dvh)] h-fit">
      {/* opponent info */}
      <PlayerInfoInGame
        player={opponent}
        isOnline={onlineUsers[opponent._id]}
        opponentColor={playerColor}
        chessboard={chessboard}
      />
      {/* chessboard */}
      <div
        ref={boardRef}
        className="relative w-full h-fit items-center justify-center flex flex-col"
      >
        {/* empty chessboard */}
        {!chessboard && (
          <div className="relative w-full h-fit">{<EmptyBoard />}</div>
        )}
        {chessboard?.map((row, rowIdx) => (
          <div className="grid grid-cols-8 w-full" key={rowIdx}>
            {row.map((piece, pieceIdx) => {
              const key = pieceIdx + rowIdx;
              const color = key & 1 ? "rgb(115,149,82)" : "rgb(234,237,208)";

              return (
                <ChessBoardBox
                  key={key}
                  row={rowIdx}
                  col={pieceIdx}
                  color={color}
                  piece={piece}
                  updateMoves={updateMoves}
                  boardDetails={boardRef.current?.getBoundingClientRect()}
                  isViewer={isViewer}
                />
              );
            })}
          </div>
        ))}
      </div>
      {/* user info */}
      <PlayerInfoInGame
        player={playerInfo}
        isOnline={onlineUsers[playerInfo._id]}
        opponentColor={
          playerColor == colors.white ? colors.black : colors.white
        }
        chessboard={chessboard}
      />
    </div>
  );
}
