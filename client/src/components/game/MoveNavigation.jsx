import { useGameContext } from "../../pages/Game.jsx";
import { useEffect } from "react";

function MoveNavigation() {
  const { setMoveIndex, moves, moveIndex, handleSeePreviousState } =
    useGameContext();

  useEffect(() => {
    if (moveIndex >= -1) {
      handleSeePreviousState(
        moveIndex === -1 ? moves[0] : moves[moveIndex],
        moveIndex
      );
    }
  }, [handleSeePreviousState, moveIndex, moves]);
  useEffect(() => {
    setMoveIndex(moves?.length - 1);
  }, [moves?.length, setMoveIndex]);

  return (
    <div className="flex justify-between w-full">
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
  );
}

export default MoveNavigation;
