/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import pieceMove, { getColor } from "../utils/PieceMove.js";
import clearPieceMove from "../utils/ClearPieceMove.js";
import ChessBoardBoxNumbering from "./ChessBoardBoxNumbering.jsx";
import { captureSound, moveSound } from "../utils/Sounds.js";

function ChessBoardBox({
  color,
  piece,
  chessboard,
  setChessboard,
  currPiece,
  setCurrPiece,
  allMoves,
  row,
  col,
  playerColor,
  movePossible,
  setMovePossible,
  movingPiece,
  setMovingPiece,
}) {
  //set the image of pieces
  const [imgPath, setImgPath] = useState("");

  //promotion pawn's possible pieces
  const [pawnUpdatePieces, setPawnUpdatePieces] = useState([
    "queen-w",
    "rook-w",
    "bishop-w",
    "knight-w",
  ]);

  //active transition
  const [moveInfo, setMoveInfo] = useState(null);

  //is dragging
  const [isDragging, setDragging] = useState(false);

  useEffect(() => {
    //assign image path and must use default to set the path to empty to remove previous path
    const assignValue = () => {
      switch (piece) {
        //black pices
        case "r":
          setImgPath("/images/rook-b.png");
          break;
        case "p":
          setImgPath("/images/pawn-b.png");
          break;
        case "n":
          setImgPath("/images/knight-b.png");
          break;
        case "b":
          setImgPath("/images/bishop-b.png");
          break;
        case "q":
          setImgPath("/images/queen-b.png");
          break;
        case "k":
          setImgPath("/images/nrking-b.png");
          break;

        //white pices
        case "R":
          setImgPath("/images/rook-w.png");
          break;
        case "P":
          setImgPath("/images/pawn-w.png");
          break;
        case "N":
          setImgPath("/images/knight-w.png");
          break;
        case "B":
          setImgPath("/images/bishop-w.png");
          break;
        case "Q":
          setImgPath("/images/queen-w.png");
          break;
        case "K":
          setImgPath("/images/nrking-w.png");
          break;

        //default
        default:
          setImgPath("");
      }

      //Change the image name for black as white color was default
      if (playerColor == "black") {
        setPawnUpdatePieces((prev) =>
          prev.map((val) => val.replace("-w", "-b"))
        );
      }
    };

    assignValue();
  }, [piece, chessboard, currPiece, playerColor]);

  //a hook that will invoke a function to calculate moving position of a piece
  useEffect(() => {
    function movePiece() {
      //if any piece is not moving or not the desired cell where the animation will occur, then return
      if (
        !movingPiece ||
        movingPiece.from.row != row ||
        movingPiece.from.col != col
      )
        return;

      //get the delta x and delta y
      let x = (movingPiece.to.col - movingPiece.from.col) * 100;
      let y = (movingPiece.to.row - movingPiece.from.row) * 100;

      //set the value
      setMoveInfo({ x, y });

      //reset the value after a dealy to give user a better animation
      setTimeout(() => {
        setMoveInfo(null);
      }, 300);
    }

    movePiece();
  }, [movingPiece]);

  //a function to handle the piece movement and update chessboard
  function handlePlacePiece() {
    // if (!currPiece.row || !currPiece.col) return;
    setMovingPiece({
      from: { row: currPiece.row, col: currPiece.col },
      to: { row, col },
    });

    //decide sound type
    const color = getColor(chessboard, row, col);
    let sound = "move";
    if (color && color != playerColor) sound = "capture";

    //clear the showed possible places from the ui
    const clearedBoard = clearPieceMove(chessboard);

    //move the piece
    clearedBoard[currPiece.row][currPiece.col] = " ";

    //delay a little to show animation
    setTimeout(() => {
      clearedBoard[row][col] = chessboard[currPiece.row][currPiece.col];

      //check if pawn promotion
      if (
        row == 0 &&
        (clearedBoard[row][col] == "p" || clearedBoard[row][col] == "P")
      ) {
        setMovePossible(false);
      }

      //set the current choosed piece's info as nothing
      setCurrPiece({ row: null, col: null, moves: null });

      //render the new chessboard
      setChessboard(clearedBoard);

      //play audio
      switch (sound) {
        case "move":
          moveSound();
          break;
        case "capture":
          captureSound();
      }

      setMovingPiece(null);
    }, 100);
  }

  //a function to get info about a piece's possible movement paths
  function handleDisplayPossibleMoves() {
    //get the color of the clicked place's piece
    //if the place is empty cell then it'll return null
    const color = getColor(chessboard, row, col);

    //if it is null then clicked cell is empty
    //or clicked cell's piece is opponent's color then return
    if (color && playerColor != color) return;

    //clear the board to remove the previous shoewd possible moves
    const clearedBoard = clearPieceMove(chessboard);

    //get the possible moves
    const moves = pieceMove(clearedBoard, row, col, true);

    //if no move is possible then nothing to desplay in ui
    if (moves.length == 0) return;

    //set the current piece with possible moves
    setCurrPiece(() => ({ row, col, moves }));
  }

  //handle piece related operation
  const handlePieceMove = () => {
    //if pawn needs promotion
    if (movePossible == false) return;

    //if the clicked cell is a possible movement of a piece which must present in the currPiece state then user is trying to move the piece to that location
    //otherwise if the cell is occupied by user's piece then user is trying to get info about possible movements of that piece
    if (currPiece.moves?.some(([row1, col1]) => row == row1 && col == col1))
      return handlePlacePiece();
    else return handleDisplayPossibleMoves();
  };

  //function to handle pawn promotion
  const handlePawnPromotion = (e, idx) => {
    //create a new chess board to change reference which is needed for useState
    let newChessBoard = chessboard.map((row) => [...row]);

    //based on the value change the pawn to its promotion
    if (idx == 0) {
      newChessBoard[row][col] = playerColor == "white" ? "Q" : "q";
    } else if (idx == 1) {
      newChessBoard[row][col] = playerColor == "white" ? "R" : "r";
    } else if (idx == 2) {
      newChessBoard[row][col] = playerColor == "white" ? "B" : "b";
    } else {
      newChessBoard[row][col] = playerColor == "white" ? "N" : "n";
    }

    //set the new chessboard
    setChessboard(newChessBoard);

    //give permission to move other pieces
    setMovePossible(true);
  };

  const handleDragStart = (e) => {

    const { width, height } = e.target.getBoundingClientRect();

    // Create a new image element for the drag image
    let newImg = document.createElement("img");
    newImg.src = imgPath;

    newImg.style.width = `${width}px`;
    newImg.style.height = `${height}px`;
    newImg.style.pointerEvents = 'none'; // Ensure it doesn’t interfere with drag
    newImg.style.position = 'absolute';  // Avoid layout interference
    newImg.style.top = '-100px';
    newImg.style.opacity = '1';          // Make sure it's fully visible

    // Append the image to the document body temporarily
    document.body.appendChild(newImg);

    // Set the drag image to the newly created image
    e.dataTransfer.setDragImage(newImg, width / 2, height / 2);

    // Set dragging state
    setDragging(() => true);
    handleDisplayPossibleMoves();

    setTimeout(() => {
      document.body.removeChild(newImg);
    }, 100)

  };

  return (
    <span
      style={{ backgroundColor: color }}
      className="relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]"
      onClick={handlePieceMove}
      //below is necessarry to allow drop
      onDragOver={(e) => e.preventDefault()}
      onDrop={handlePieceMove}
    >
      {/* piece images */}
      <img
        src={imgPath}
        alt=""
        className="max-w-full absolute z-10"
        onDragStart={handleDragStart}
        onDragEnd={() => setDragging(false)}
        style={{
          ...(moveInfo
            ? {
              transform: `translate(${moveInfo.x}% ,${moveInfo.y}%)`,
              transition: "transform 0.1s linear",
            }
            : {}),
          opacity: isDragging ? "0" : "1",
        }}
      />

      {/* numbering with pawn promotion */}
      <ChessBoardBoxNumbering
        allMoves={allMoves}
        row={row}
        col={col}
        currPiece={currPiece}
        color={color}
        playerColor={playerColor}
        chessboard={chessboard}
      />

      {/* pawn promotion logic */}
      {row == 0 &&
        (chessboard[row][col] == "p" || chessboard[row][col] == "P") && (
          <ul className="absolute w-full left-0 top-0 z-20 box shadow-lg shadow-black">
            {pawnUpdatePieces.map((val, idx) => {
              return (
                <li
                  onClick={(e) => handlePawnPromotion(e, idx)}
                  key={idx}
                  style={{
                    backgroundColor:
                      idx & 1 ? "rgb(115,149,82)" : "rgb(234,237,208)",
                  }}
                  className="relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]"
                >
                  <img src={"/images/" + val + ".png"} alt="" />
                </li>
              );
            })}
          </ul>
        )}
    </span>
  );
}

export default ChessBoardBox;
