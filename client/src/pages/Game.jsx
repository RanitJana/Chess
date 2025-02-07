/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import ChessBoard from "../components/game/ChessBoard.jsx";
import { useParams } from "react-router";
import { gameSingle } from "../api/game.js";
import { socket } from "../socket.js";
import GameSideSection from "../components/game/GameSideSection.jsx";
import WinnerBoard from "../components/game/WinnerBoard.jsx";
import NavBar from "../components/NavBar.jsx";
import { colors } from "../constants.js";

const GameContext = createContext();

function useGameContext() {
  return useContext(GameContext);
}

function convertTo2DArray(chessString) {
  const rows = [];
  const rowLength = 8; // Each row has 8 characters

  for (let i = 0; i < chessString.length; i += rowLength) {
    const row = chessString.slice(i, i + rowLength).split("");
    rows.push(row);
  }

  return rows;
}

export { convertTo2DArray, useGameContext };

export default function Game() {
  const { gameId } = useParams();

  const [opponent, setOpponent] = useState(null);
  const [chessboard, setChessboard] = useState(null);
  const [playerColor, setPlayerColor] = useState(colors.black);
  const [allMoves, setAllMoves] = useState([]);
  const [movingPiece, setMovingPiece] = useState(null);
  const [movePossible, setMovePossible] = useState(true);
  const [isUserMove, setIsUserMove] = useState(false);
  const [currPiece, setCurrPiece] = useState({
    row: null,
    col: null,
    moves: null,
  });
  const [players, setPlayers] = useState({
    player1: {},
    player2: {},
  });
  const [isCheckMate, setCheckMate] = useState(null);
  const [winnerReason, setWinnerReason] = useState("");

  const fetchGameInfo = useCallback(async () => {
    try {
      const response = await gameSingle(gameId);

      if (response?.data) {
        let { color, game } = response.data;

        setPlayerColor(color);
        setIsUserMove(game.turn == color);

        //reverse the board when user is black
        if (color == colors.black)
          game.board = game.board.split("").reverse().join("");

        setChessboard(convertTo2DArray(game.board));

        const moves = game.moves.map((val) => JSON.parse(val));
        setAllMoves(moves);
        setCheckMate(game.winner);
        setWinnerReason(game.winReason);
        setPlayers({
          player1: game.player1,
          player2: game.player2,
        });

        if (color == colors.white) setOpponent(game.player2);
        else setOpponent(game.player1);
      }
      socket.emit("join-game", gameId);
    } catch (error) {
      console.error("Error fetching game info:", error);
    }
  }, [gameId]);

  // Fetch initial game state and
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGameInfo();
  }, [gameId, fetchGameInfo]);

  useEffect(() => {
    const handleResignWin = (info) => {
      setCheckMate(info.winner);
      setWinnerReason(info.reason);
    };
    socket.on("accept-resign", handleResignWin);
    return () => socket.off("accept-resign", handleResignWin);
  }, [gameId]);

  return (
    <GameContext.Provider
      value={{
        gameId,
        players,
        opponent,
        setOpponent,
        chessboard,
        setChessboard,
        playerColor,
        allMoves,
        setAllMoves,
        movingPiece,
        setMovingPiece,
        movePossible,
        setMovePossible,
        isUserMove,
        setIsUserMove,
        currPiece,
        setCurrPiece,
        isCheckMate,
        setCheckMate,
        setWinnerReason,
      }}
    >
      <div className="relative w-full h-dvh overflow-scroll flex flex-col gap-4">
        <WinnerBoard
          playerColor={playerColor}
          isCheckMate={isCheckMate}
          setCheckMate={setCheckMate}
          winnerReason={winnerReason}
          players={players}
        />
        <div className="sm:p-4 p-0 w-full flex justify-center items-center">
          {<NavBar />}
        </div>
        <div className=" flex w-full justify-center items-center">
          <div className="grid grid-cols-1 w-full h-full gap-2 md:grid-cols-2 max-w-[970px]">
            <div className=" w-full flex items-center justify-center h-fit">
              <ChessBoard />
            </div>
            <GameSideSection players={players} />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  );
}
