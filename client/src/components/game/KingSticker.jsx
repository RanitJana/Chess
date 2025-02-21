/* eslint-disable react/prop-types */
import { winner } from "../../constants.js";
import { useGameContext } from "../../pages/Game.jsx";

function KingSticker({ piece = "k", pieceColor }) {
  const { rotateBoard, isCheckMate, moveIndex, moves } = useGameContext();

  if (!isCheckMate || piece?.toLowerCase() !== "k") return null;

  const isDraw = isCheckMate === winner.draw;
  const isWinner = isCheckMate[0] === pieceColor;
  const positionClass =
    rotateBoard === "rotate(180deg)"
      ? "bottom-0 left-0 "
      : "top-0 right-0 ";

  return (
    <div
      className={`absolute w-6 h-6 flex justify-center transition-all items-center p-1 rounded-full z-20 ${positionClass}`}
      style={{
        backgroundColor: isDraw ? "gray" : isWinner ? "green" : "red",
        opacity: moveIndex == moves.length - 1 ? "1" : "0",
      }}
    >
      {isDraw ? (
        <div
          className="text-white font-bold"
          style={{ transform: rotateBoard }}
        >
          ½
        </div>
      ) : (
        <img
          src={
            isWinner ? "/images/king-win.png" : "/images/themes/classic/wk.png"
          }
          alt="k"
          className={`w-4 ${isWinner && "invert brightness-0"}`}
          style={{
            transform: isWinner
              ? rotateBoard
              : rotateBoard === "rotate(180deg)"
                ? "rotate(90deg)"
                : "rotate(-90deg)",
          }}
        />
      )}
    </div>
  );
}

export default KingSticker;
