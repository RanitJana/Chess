/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChessBoardBox from "./ChessBoardBox";
import roateBoard from "../utils/RotateBoard";

export default function ChessBoard() {
  const colors = {
    white: "white",
    black: "black",
  };
  //make sure to freeze the color of the user to prevent undesired change
  Object.freeze(colors);

  //initially the board
  let initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  //hook to store current chessboard state
  const [chessboard, setChessboard] = useState(initialBoard);

  //backend will decide which color user will play
  //for now,assume user is white
  const [playerColor, setPlayerColor] = useState(colors.white);

  //set the color once
  const [colorChangeCount, setColorChangeCount] = useState(1);

  //make false and make unable other move when pawn needs promotion which is pending
  const [movePossible, setMovePossible] = useState(true);

  useEffect(() => {
    //if the user is black then rotate the board for the user
    if (playerColor === colors.black && colorChangeCount) {
      const rotatedBoard = roateBoard([...chessboard]);
      setChessboard(rotatedBoard); // Update state to trigger re-render
      setColorChangeCount(0);
    } else setColorChangeCount(0);
  }, []);

  //keep info of which piece is selected currently and its possible moves;
  const [currPiece, setCurrPiece] = useState({
    row: null,
    col: null,
    moves: null,
  });

  // To store moving piece animation of the user and also for the opponent which will be got using backend
  const [movingPiece, setMovingPiece] = useState(null);
  /*
  e.g.:
   setMovingPiece({
      from: { row: currPiece.row, col: currPiece.col },
      to: { row, col },
    });
  */

  //contain all moves including opponents
  const [allMoves, setAllmoves] = useState([]);

  //a hook that will invoke a function to store the data of moves
  useEffect(() => {
    const appendMoveInfo = () => {
      //for safety, if no moving piece is found then return
      if (!movingPiece) return;

      //create an array to hold the data and set the details
      let newMoveArray = [...allMoves, movingPiece];
      setAllmoves(() => newMoveArray);
    };

    appendMoveInfo();
  }, [movingPiece]);

  return (
    <div
      className="p-4 w-[100dvws] shadow-inner max-w-[35rem]"
      style={{ backgroundImage: "url('/images/wood.jpg')" }}
    >
      {chessboard.map((row, rowIdx) => {
        return (
          <div
            className="grid grid-cols-8 w-full"
            key={rowIdx}
            style={{ backgroundImage: "url('/images/wood.jpg')" }}
          >
            {row.map((piece, pieceIdx) => {
              let color =
                (pieceIdx + rowIdx) & 1
                  ? "rgba(135, 50, 0, .5)"
                  : "rgba(135, 50, 0, .0)";
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
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
