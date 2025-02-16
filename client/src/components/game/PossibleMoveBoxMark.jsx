/* eslint-disable react/prop-types */
import { useGameContext } from "../../pages/Game";
import { getSquareFromMove } from "../../utils/game/getSquareNames.js";

function PossibleMoveBoxMark({ possibleMoves, square }) {
  const { boardStates, users } = useGameContext();
  return (
    <div>
      {possibleMoves?.some(
        (val) => getSquareFromMove(val, users.you?.color) == square
      ) &&
        (boardStates.board.get(square) ? (
          <div className="z-10 absolute top-1/2 left-1/2 w-[100%] border-[6px] border-[rgba(0,0,0,0.15)] aspect-square rounded-full translate-x-[-50%] translate-y-[-50%]"></div>
        ) : (
          <div className="z-10 absolute top-1/2 left-1/2 w-[35%] aspect-square bg-[rgba(0,0,0,0.15)] rounded-full translate-x-[-50%] translate-y-[-50%]"></div>
        ))}
    </div>
  );
}

export default PossibleMoveBoxMark;
