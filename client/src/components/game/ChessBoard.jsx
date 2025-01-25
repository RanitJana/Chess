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
import toast from "react-hot-toast";

export default function ChessBoard() {
  const {
    playerColor,
    allMoves,
    gameId,
    setChessboard,
    setUserMove,
    setAllMoves,
    setMovingPiece,
    setCurrPiece,
    chessboard,
    players,
    setCheckMate,
  } = useGameContext();

  const { playerInfo } = useAuthContext();
  const { onlineUsers } = useSocketContext();
  const boardRef = useRef(null);
  const userId = playerInfo._id;

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
    let boardString = clearedBoard
      .map((row) => row.join("")) // Use join to avoid commas
      .join("");

    if (playerColor == "black")
      boardString = boardString.split("").reverse().join("");

    try {
      socket.emit("game-move", gameId);
      socket.emit("move-done", [boardString, info]);

      setAllMoves((prevMoves) => [...prevMoves, info]);

      const response = await gameMove({
        moves: [...allMoves, info],
        gameId,
        board: boardString,
      });

      if (
        kingCheckMate(
          convertTo2DArray(boardString),
          playerColor == "white" ? "black" : "white"
        )
      ) {
        const winner = playerColor == "white" ? 1 : 2;
        setCheckMate(winner);
        await gameEnd({ winner, gameId });
      }

      if (response?.data.board) {
        setChessboard(convertTo2DArray(response.data.board));
      }

      if (response) {
        if (playerColor == "white" && response.data.info.game.userMove == 0)
          setUserMove(true);
        else if (
          playerColor == "black" &&
          response.data.info.game.userMove == 1
        )
          setUserMove(true);
        else setUserMove(false);
      }
    } catch (error) {
      toast.error("Error updating moves.. Please try to refresh the page");
      console.error("Error updating moves:", error);
    }
  }

  useEffect(() => {
    function handleOpponentMove(val) {
      if (isViewer()) return;

      let updatedBoard = val[0];
      let move = val[1];

      if (playerColor === "black") {
        updatedBoard = updatedBoard.split("").reverse().join(""); // Reverse only when displaying
      }

      updatedBoard = convertTo2DArray(updatedBoard);

      if (kingCheckMate(updatedBoard, playerColor))
        setCheckMate(playerColor == "white" ? 2 : 1);

      setUserMove(true);

      const opponentMove = {
        from: { row: 7 - move.from.row, col: 7 - move.from.col },
        to: { row: 7 - move.to.row, col: 7 - move.to.col },
      };

      // Update the moving piece for animations
      setMovingPiece(opponentMove);

      // Update the allMoves array directly
      setAllMoves((prevMoves) => [...prevMoves, move]);
      setCurrPiece({ row: null, col: null, moves: null });

      // Delay to show animation
      setTimeout(() => {
        setMovingPiece(null);
        setChessboard(updatedBoard);
      }, 100);
    }

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
      />
      <div
        ref={boardRef}
        className="relative w-full h-fit items-center justify-center flex flex-col"
      >
        {chessboard ? (
          chessboard.map((row, rowIdx) => (
            <div className="grid grid-cols-8 w-full" key={rowIdx}>
              {row.map((piece, pieceIdx) => {
                const color =
                  (pieceIdx + rowIdx) % 2 === 0
                    ? "rgb(234,237,208)"
                    : "rgb(115,149,82)";

                return (
                  <ChessBoardBox
                    isViewer={isViewer}
                    key={pieceIdx}
                    row={rowIdx}
                    col={pieceIdx}
                    color={color}
                    piece={piece}
                    updateMoves={updateMoves}
                    boardDetails={boardRef.current?.getBoundingClientRect()}
                  />
                );
              })}
            </div>
          ))
        ) : (
          <div className="relative w-full h-fit">{<EmptyBoard />}</div>
        )}
      </div>
      {/* user info */}
      <PlayerInfoInGame
        player={playerInfo}
        isOnline={onlineUsers[playerInfo._id]}
      />
    </div>
  );
}
