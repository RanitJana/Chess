/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChessBoardBox from "./ChessBoardBox.jsx";
import { gameMove, gameSingle } from "../api/game.js";
import { useParams } from "react-router";
import { socket } from "../socket.js";

function convertTo2DArray(chessString) {
  const rows = [];
  const rowLength = 8; // Each row has 8 characters

  for (let i = 0; i < chessString.length; i += rowLength) {
    const row = chessString.slice(i, i + rowLength).split("");
    rows.push(row);
  }

  return rows;
}

export default function ChessBoard() {
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
          if (color == "white" && game.userMove == 0) setUserMove(true);
          else if (color == "black" && game.userMove == 1) setUserMove(true);
          else setUserMove(false);
        }
        socket.emit("join-game", gameId);
      } catch (error) {
        console.error("Error fetching game info:", error);
      }
    }

    fetchGameInfo();
  }, [gameId]);

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
      if (response.data.board) {
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

      setChessboard(convertTo2DArray(updatedBoard));
      setUserMove(true);

      setMovingPiece({ from: { row: 7 - move.from.row, col: 7 - move.from.col }, to: { row: 7 - move.to.row, col: 7 - move.to.col } });

      //delay a little to show animation
      setTimeout(() => {
        setCurrPiece({ row: null, col: null, moves: null });
        setMovingPiece(null);
      }, 100);

    });

    return () => {
      socket.off("opponent-move");
    };
  }, [playerColor]);


  // Append new move when movingPiece changes
  useEffect(() => {
    if (!movingPiece) return;

    setAllMoves((prevMoves) => [...prevMoves, movingPiece]);
  }, [movingPiece]);

  return (
    <div className="relative w-[100dvw] shadow-inner max-w-[35rem]">
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
                  setMovingPiece={setMovingPiece}
                  movingPiece={movingPiece}
                  movePossible={movePossible}
                  setMovePossible={setMovePossible}
                  allMoves={allMoves}
                  chessboard={chessboard}
                  setChessboard={setChessboard}
                  currPiece={currPiece}
                  setCurrPiece={setCurrPiece}
                  playerColor={playerColor}
                  row={rowIdx}
                  col={pieceIdx}
                  color={color}
                  piece={piece}
                  isUserMove={isUserMove}
                  setUserMove={setUserMove}
                  updateMoves={updateMoves}
                />
              );
            })}
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
