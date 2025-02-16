import { useCallback, useEffect } from "react";
import { useGameContext } from "../../pages/Game.jsx";
import { Chess } from "chess.js";

const pieceSymbols = {
  p: "♙",
  P: "♟",
  n: "♘",
  N: "♞",
  b: "♗",
  B: "♝",
  r: "♖",
  R: "♜",
  q: "♕",
  Q: "♛",
  k: "♔",
  K: "♚",
};

function Moves() {
  const { moves, setBoardStates, setMoveIndex, moveIndex } = useGameContext();

  const handleSeePreviousState = useCallback(
    (move, moveIndex) => {
      if (!move) return;
      const boardState = moveIndex === -1 ? moves[0].before : move.after;
      const boardInfo = boardState.split(" ");

      setBoardStates({
        board: new Chess(boardState), // Creates a fresh instance
        turn: boardInfo[1] === "w" ? "w" : "b",
        castling: boardInfo[2],
        enPassant: boardInfo[3],
        move: {
          half: parseInt(boardInfo[4]),
          full: parseInt(boardInfo[5]),
        },
      });
    },
    [moves, setBoardStates]
  );

  useEffect(() => {
    setMoveIndex(moves?.length - 1);
  }, [moves?.length, setMoveIndex]);

  useEffect(() => {
    if (moveIndex >= -1) {
      handleSeePreviousState(
        moveIndex === -1 ? moves[0] : moves[moveIndex],
        moveIndex
      );
    }
  }, [handleSeePreviousState, moveIndex, moves]);

  return (
    <div className="relative w-full h-full text-sm flex flex-col justify-between">
      <div>
        <p className="w-full text-white px-4 py-2 border-b border-b-[rgba(255,255,255,0.19)]">
          Starting moves
        </p>
        <div className="flex flex-col w-full">
          {(() => {
            let ans = [];
            for (let idx = 0; idx < moves?.length || 0; idx += 2) {
              let row = Math.ceil((idx + 1) / 2);

              const move1 = moves[idx];
              const move2 = moves[idx + 1];

              ans.push(
                <div
                  key={idx}
                  className={`flex gap-5 ${
                    row % 2 === 1 ? "bg-[rgb(38,37,34)]" : "bg-[rgb(43,41,39)]"
                  } w-full text-[rgba(255,255,255,0.69)] px-4 py-1`}
                >
                  <span className="w-8 mr-4 text-center">{row}.</span>
                  <div className="grid grid-cols-2 gap-4 w-[50%] font-semibold">
                    {/* Move 1 */}
                    {move1 && (
                      <span
                        className={`w-fit px-1 hover:cursor-pointer hover:bg-blackLight rounded-sm text-center ${
                          idx === moveIndex
                            ? "bg-[rgb(72,70,68)] shadow-[0px_2px_0px_0px_white]"
                            : ""
                        }`}
                        onClick={() => setMoveIndex(idx)}
                      >
                        {pieceSymbols[
                          move1.color === "w"
                            ? move1.piece.toUpperCase()
                            : move1.piece
                        ] || ""}{" "}
                        {move1.san}
                      </span>
                    )}
                    {/* Move 2 (if exists) */}
                    {move2 && (
                      <span
                        className={`w-fit px-1 hover:cursor-pointer hover:bg-blackLight rounded-sm text-center ${
                          idx + 1 === moveIndex
                            ? "bg-[rgb(72,70,68)] shadow-[0px_2px_0px_0px_white]"
                            : ""
                        }`}
                        onClick={() => setMoveIndex(idx + 1)}
                      >
                        {pieceSymbols[move2.piece] || ""} {move2.san}
                      </span>
                    )}
                  </div>
                </div>
              );
            }
            return ans;
          })()}
        </div>
      </div>

      {/* Previous / Next Buttons */}
      <div className="flex justify-between px-4 py-2">
        <button
          className="bg-[rgb(71,70,71)] p-2 rounded-md w-[5rem] text-white"
          onClick={() => setMoveIndex((prev) => Math.max(prev - 1, -1))}
        >
          Previous
        </button>
        <button
          className="bg-[rgb(71,70,71)] p-2 rounded-md w-[5rem] text-white"
          onClick={() =>
            setMoveIndex((prev) => Math.min(prev + 1, moves.length - 1))
          }
          disabled={moveIndex >= moves.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Moves;
