/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import ChessBoardBox from "./ChessBoardBox.jsx";
import { gameEnd, gameMove } from "../api/game.js";
import { socket } from "../socket.js";
import EmptyBoard from "./EmptyBoard.jsx";
import { useGameContext, convertTo2DArray } from "../pages/Game.jsx";
import { kingCheckMate } from "../utils/KingCheck.js";

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

  const navigate = useNavigate();
  console.log(players);

  // Handle move updates
  async function updateMoves(clearedBoard, info) {
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
  }, [playerColor]);

  const boardRef = useRef(null);

  return (
    <div className="flex flex-col h-fit">
      <div className="flex justify-between items-center">
        <div className="flex py-2 gap-4">
          <div className="h-10 aspect-square rounded-sm bg-white overflow-hidden">
            <img src="/images/user-pawn.gif" alt="" />
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
        className="relative w-[100dvw] max-w-[35rem] aspect-square h-fit"
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
          <div className="relative w-[100dvw] max-w-[35rem] h-[100dvh] max-h-[35rem]">
            {<EmptyBoard />}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex py-2 gap-4">
          <div className="h-10 aspect-square rounded-sm bg-white overflow-hidden">
            <img src="/images/user-pawn.gif" alt="" />
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
