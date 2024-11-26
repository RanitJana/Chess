/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import pieceMove, { getColor } from '../utils/PieceMove.js';
import clearPieceMove from '../utils/ClearPieceMove.js';

function ChessBoardBox({ color, piece, chessboard, setChessboard, currPiece, setCurrPiece, row, col, playerColor, movePossible, setMovePossible }) {

    //set the image of pieces
    const [imgPath, setImgPath] = useState("");

    //promotion pawn's possible pieces
    const [pawnUpdatePieces, setPawnUpdatePieces] = useState(['queen-w', 'rook-w', 'bishop-w', 'knight-w']);

    useEffect(() => {

        //assign image path and must use default to set the path to empty to remove previous path
        const assignValue = () => {
            switch (piece) {
                //black pices
                case 'r': setImgPath("/images/rook-b.svg"); break;
                case 'p': setImgPath("/images/pawn-b.svg"); break;
                case 'n': setImgPath("/images/knight-b.svg"); break;
                case 'b': setImgPath("/images/bishop-b.svg"); break;
                case 'q': setImgPath("/images/queen-b.svg"); break;
                case 'k': setImgPath("/images/nrking-b.svg"); break;

                //white pices
                case 'R': setImgPath("/images/rook-w.svg"); break;
                case 'P': setImgPath("/images/pawn-w.svg"); break;
                case 'N': setImgPath("/images/knight-w.svg"); break;
                case 'B': setImgPath("/images/bishop-w.svg"); break;
                case 'Q': setImgPath("/images/queen-w.svg"); break;
                case 'K': setImgPath("/images/nrking-w.svg"); break;

                //default
                default: setImgPath("");

            }

            //Change the image name for black as white color was default
            if (playerColor == "black") {
                setPawnUpdatePieces(prev => prev.map(val => val.replace("-w", "-b")))
            }
        }

        assignValue();

    }, [piece, chessboard, currPiece, playerColor]);


    //a function to handle the piece movement and update chessboard
    function handlePlacePiece() {
        // if (!currPiece.row || !currPiece.col) return;

        //clear the showed possible places from the ui
        const clearedBoard = clearPieceMove(chessboard);

        //move the piece
        clearedBoard[row][col] = chessboard[currPiece.row][currPiece.col];
        clearedBoard[currPiece.row][currPiece.col] = ' ';

        //check if pawn promotion
        if (row == 0 && (clearedBoard[row][col] == 'p' || clearedBoard[row][col] == "P")) {
            setMovePossible(false);
        }

        //set the current choosed piece's info as nothing
        setCurrPiece({ row: null, col: null, moves: null });

        //render the new chessboard
        setChessboard(clearedBoard);
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
        const moves = pieceMove(clearedBoard, row, col);

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
        if (currPiece.moves?.some(([row1, col1]) => row == row1 && col == col1)) return handlePlacePiece();
        else return handleDisplayPossibleMoves();

    };

    const handlePawnPromotion = (e, idx) => {

        //create a new chess board to change reference which is needed for useState 
        let newChessBoard = chessboard.map(row => [...row]);

        //based on the value change the pawn to its promotion
        if (idx == 0) {
            newChessBoard[row][col] = playerColor == 'white' ? 'Q' : 'q';
        }
        else if (idx == 1) {
            newChessBoard[row][col] = playerColor == 'white' ? 'R' : 'r';
        }
        else if (idx == 2) {
            newChessBoard[row][col] = playerColor == 'white' ? 'B' : 'b';
        }
        else {
            newChessBoard[row][col] = playerColor == 'white' ? 'N' : 'n';
        }

        //set the new chessboard
        setChessboard(newChessBoard);

        //give permission to move other pieces
        setMovePossible(true);
    }

    return (
        <span
            style={{ backgroundColor: color }}
            className="relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]"
            onClick={handlePieceMove}
        >
            <img src={imgPath} alt="" className="max-w-full" />
            {
                currPiece.moves?.some(([row1, col1]) => row === row1 && col === col1) ? (
                    chessboard[row][col] != ' ' ?
                        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-full border-[6px]"
                            style={{ borderColor: "rgba(8, 7, 6, 0.33)" }}
                        ></div>
                        :
                        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-5 h-5 rounded-full"
                            style={{ backgroundColor: "rgba(8, 7, 6, 0.33)" }}
                        ></div>
                )
                    : ""
            }
            {
                row == 0 && (chessboard[row][col] == 'p' || chessboard[row][col] == 'P') && (
                    <ul className='absolute w-full left-0 top-0 z-10 box shadow-lg shadow-black' >
                        {
                            pawnUpdatePieces.map((val, idx) => {
                                return (
                                    <li
                                        onClick={(e) => handlePawnPromotion(e, idx)}
                                        key={idx}
                                        style={{ backgroundColor: idx & 1 ? "rgb(119,151,86)" : "rgb(239,238,211)" }}
                                        className='relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]'
                                    >
                                        <img src={"/images/" + val + ".svg"} alt="" />
                                    </li>
                                )
                            })
                        }
                    </ul>
                )
            }
        </span>

    )
}

export default ChessBoardBox;