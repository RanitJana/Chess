/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, createContext, useContext } from "react";
import ChessBoard from "../components/ChessBoard.jsx";
import { useParams } from "react-router";
import { gameSingle } from "../api/game.js";
import { socket } from "../socket.js";
import GameSideSection from "../components/GameSideSection.jsx";
import WinnerBoard from "../components/WinnerBoard.jsx";

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
  const [opponent, setOpponent] = useState(null);
  const { gameId } = useParams();

  const colors = Object.freeze({
    white: "white",
    black: "black",
  });

  const [chessboard, setChessboard] = useState(null);
  const [playerColor, setPlayerColor] = useState(colors.black);
  const [allMoves, setAllMoves] = useState([]);
  const [movingPiece, setMovingPiece] = useState(null);
  const [movePossible, setMovePossible] = useState(true);
  const [isUserMove, setUserMove] = useState(false);
  const [currPiece, setCurrPiece] = useState({
    row: null,
    col: null,
    moves: null,
  });
  const [players, setPlayers] = useState({
    player1: { name: "Loading..", rating: 0 },
    player2: { name: "Loading..", rating: 0 },
  });

  const [isCheckMate, setCheckMate] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch initial game state
  useEffect(() => {
    async function fetchGameInfo() {
      try {
        const response = await gameSingle(gameId);

        if (response?.data.info) {
          let { color, game, board } = response.data.info;
          board = convertTo2DArray(board);

          let moves = game.moves.map((val) => JSON.parse(val));

          setPlayerColor(color);
          setChessboard(board);
          setAllMoves(moves);
          //0 for no one, 1for white, 2 for black, 3 for draw
          setCheckMate(game.winner);

          if (color == "white" && game.userMove == 0) setUserMove(true);
          else if (color == "black" && game.userMove == 1) setUserMove(true);
          else setUserMove(false);

          setPlayers({
            player1: response.data.info.game.player1,
            player2: response.data.info.game.player2,
          });

          if (color == "white") setOpponent(response.data.info.game.player2);
          else setOpponent(response.data.info.game.player1);
        }
        socket.emit("join-game", gameId);
      } catch (error) {
        console.error("Error fetching game info:", error);
      }
    }

    fetchGameInfo();
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
        setUserMove,
        currPiece,
        setCurrPiece,
        isCheckMate,
        setCheckMate,
      }}
    >
      <div className="relative w-full h-[100dvh] min-h-fit overflow-scroll flex items-center justify-center gap-4 flex-wrap">
        <WinnerBoard
          playerColor={playerColor}
          isCheckMate={isCheckMate}
          setCheckMate={setCheckMate}
        />
        <ChessBoard />
        <GameSideSection
          userId={
            players?.player1._id == opponent?._id
              ? players.player2._id
              : players.player1._id
          }
        />
      </div>
    </GameContext.Provider>
  );
}
