/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChessBoardBox from "./ChessBoardBox";
import roateBoard from "../utils/RotateBoard";

export default function ChessBoard() {

    const colors = {
        white: "white",
        black: "black"
    }
    //make sure to freeze the color of the user to prevent undesired change
    Object.freeze(colors);

    //initially the board
    let initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
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
        }
        else setColorChangeCount(0);

    }, []);

    //keep info of which piece is selected currently and its possible moves;
    const [currPiece, setCurrPiece] = useState({
        row: null,
        col: null,
        moves: null
    });

    return (
        chessboard.map((row, rowIdx) => {
            return (
                <div className="grid grid-cols-8 max-w-[40rem] w-full" key={rowIdx} >
                    {
                        row.map((piece, pieceIdx) => {
                            let color = ((pieceIdx + rowIdx) & 1) ? "rgb(119,151,86)" : "rgb(239,238,211)";
                            return (
                                <ChessBoardBox
                                    key={pieceIdx}

                                    movePossible={movePossible}
                                    setMovePossible={setMovePossible}

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
                            )
                        })
                    }
                </div>
            )
        })
    )
}
