/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import ChessBoardBox from "./ChessBoardBox.jsx";
import { gameEnd, gameMove } from "../api/game.js";
import { socket } from "../socket.js";
import EmptyBoard from "./EmptyBoard.jsx";
import { useGameContext, convertTo2DArray } from "../pages/Game.jsx";
import { kingCheckMate } from "../utils/KingCheck.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";

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

  const isViewer = () => {
    if (
      playerInfo._id != players.player1._id &&
      playerInfo._id != players.player2._id
    )
      return true;
  };

  const navigate = useNavigate();

  // Handle move updates
  async function updateMoves(clearedBoard, info) {
    if (isViewer()) return;
    let boardString = clearedBoard
      .map((row) => row.join("")) // Use join to avoid commas
      .join("");

    if (playerColor == "black")
      boardString = boardString.split("").reverse().join("");

    try {
      const response = await gameMove({
        moves: [...allMoves, info],
        gameId,
        board: boardString,
      });
      socket.emit("game-move", gameId);

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
      setAllMoves((prevMoves) => [...prevMoves, info]);

      socket.emit("move-done", [boardString, info]);
    } catch (error) {
      console.error("Error updating moves:", error);
    }
  }

  useEffect(() => {
    socket.on("opponent-move", (val) => {
      if (isViewer()) return;
      console.log("Your Turn");
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
      // Delay to show animation
      setTimeout(() => {
        setCurrPiece({ row: null, col: null, moves: null });
        setMovingPiece(null);
        setChessboard(updatedBoard);
      }, 100);
    });

    return () => {
      socket.off("opponent-move");
    };
  }, []);

  const boardRef = useRef(null);

  const { onlineUsers } = useSocketContext();

  return (
    <div className="grid grid-cols-1 gap-0 md:w-full w-[min(100%,80dvh)] h-fit">
      <div className="flex justify-between items-center">
        <div className="flex py-2 gap-4">
          <div className=" relative h-10 aspect-square rounded-sm bg-white overflow-hidden">
            <img src="/images/user-pawn.gif" alt="" />
            {playerColor == "white" && onlineUsers[players.player2._id] && (
              <div className="absolute right-0 bottom-0 w-3 aspect-square bg-green-600"></div>
            )}
            {playerColor == "black" && onlineUsers[players.player1._id] && (
              <div className="absolute right-0 bottom-0 w-3 aspect-square bg-green-600"></div>
            )}
          </div>
          <p>
            {playerColor == "white" ? (
              <>
                <span
                  onClick={() => navigate(`/member/${players.player2._id}`)}
                  className="text-white font-semibold mr-1 hover:cursor-pointer"
                >
                  {players.player2?.name}
                </span>
                <span className="text-gray-400">
                  ({players.player2?.rating})
                </span>
              </>
            ) : (
              <>
                <span
                  onClick={() => navigate(`/member/${players.player1._id}`)}
                  className="text-white font-semibold mr-1 hover:cursor-pointer"
                >
                  {players.player1?.name}
                </span>
                <span className="text-gray-400">
                  ({players.player1?.rating})
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center justify-evenly gap-1 w-full max-w-[7rem] bg-white p-2 rounded-md">
          <img src="/images/time.gif" alt="" />
          <span>3 days</span>
        </div>
      </div>
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
          <div className="relative w-full h-fit">
            {<EmptyBoard />}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex py-2 gap-4">
          <div className="relative h-10 aspect-square rounded-sm bg-white overflow-hidden">
            <img src="/images/user-pawn.gif" alt="" />
            {playerColor == "white" && onlineUsers[players.player2._id] && (
              <div className="absolute right-0 bottom-0 w-3 aspect-square bg-green-600"></div>
            )}
            {playerColor == "black" && onlineUsers[players.player1._id] && (
              <div className="absolute right-0 bottom-0 w-3 aspect-square bg-green-600"></div>
            )}
          </div>
          <p>
            {playerColor == "black" ? (
              <>
                <span
                  onClick={() => navigate(`/member/${players.player2._id}`)}
                  className="text-white font-semibold mr-1 hover:cursor-pointer"
                >
                  {players.player2?.name}
                </span>
                <span className="text-gray-400">
                  ({players.player2?.rating})
                </span>
              </>
            ) : (
              <>
                <span
                  onClick={() => navigate(`/member/${players.player1._id}`)}
                  className="text-white font-semibold mr-1 hover:cursor-pointer"
                >
                  {players.player1?.name}
                </span>
                <span className="text-gray-400">
                  ({players.player1?.rating})
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center justify-evenly gap-1 w-full max-w-[7rem] bg-white p-2 rounded-md">
          <img src="/images/time.gif" alt="" />
          <span>3 days</span>
        </div>
      </div>
    </div>
  );
}
