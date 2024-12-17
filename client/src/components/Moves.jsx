import { useGameContext } from "../pages/Game.jsx";
import convertToChessNotation from "../utils/ChessNotation.js";

function Moves() {
  const { allMoves } = useGameContext();

  return (
    <div className="relative w-full h-full">
      <p className="w-full text-white px-4 py-2 border-b border-b-[rgba(255,255,255,0.19)]">
        Starting moves
      </p>
      <div className="flex flex-col w-full">
        {(() => {
          let ans = [];
          for (let idx = 0; idx < allMoves?.length || 0; idx += 2) {
            let row = Math.ceil((idx + 1) / 2);
            ans.push(
              <div
                key={idx}
                className={`flex gap-5 ${row & 1 ? "bg-[rgb(38,37,34)]" : "bg-[rgb(43,41,39)]"} w-full text-[rgba(255,255,255,0.69)] px-4 py-1`}
              >
                <span className="w-8 mr-4 text-center">{row}.</span>
                <div className={`grid grid-cols-2 gap-4 w-[50%] font-semibold`}>
                  <span
                    className={`w-fit px-1 rounded-sm text-center ${idx == allMoves.length - 1 ? "bg-[rgb(72,70,68)] shadow-[0px_2px_0px_0px_white]" : ""}`}
                  >
                    {convertToChessNotation(allMoves[idx])}
                  </span>
                  {idx + 1 < allMoves.length ? (
                    <span
                      className={`w-fit px-1 rounded-sm text-center ${idx + 1 == allMoves.length - 1 ? "bg-[rgb(72,70,68)] shadow-[0px_2px_0px_0px_white]" : ""}`}
                    >
                      {convertToChessNotation(allMoves[idx + 1])}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          }
          return ans;
        })()}
      </div>
    </div>
  );
}

export default Moves;
