import { useEffect, useRef } from "react";
import { useGameContext } from "../../pages/Game.jsx";
import MoveNavigation from "./MoveNavigation.jsx";

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
  const { moves, handleSeePreviousState, moveIndex } = useGameContext();
  const navigationRef = useRef(null);

  const apprearance = () => {
    const reference = navigationRef.current;
    if (!reference) return;
    if (window.innerWidth >= 767) {
      reference.style.transform = "scale(1)";
    } else reference.style.transform = "scale(0)";
  };

  useEffect(() => {
    window.addEventListener("resize", apprearance);
    return () => window.removeEventListener("resize", apprearance);
  }, []);

  useEffect(() => {
    apprearance();
  }, [navigationRef]);

  return (
    <div className="relative w-full h-full text-sm flex flex-col justify-between">
      <div className="flex flex-col overflow-y-scroll">
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
                        onClick={() => handleSeePreviousState(idx)}
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
                        onClick={() => handleSeePreviousState(idx + 1)}
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
      <div
        ref={navigationRef}
        className="flex w-full justify-between px-4 py-2"
      >
        <MoveNavigation />
      </div>
    </div>
  );
}

export default Moves;
