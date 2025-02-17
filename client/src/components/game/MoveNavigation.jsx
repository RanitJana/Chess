import { useGameContext } from "../../pages/Game.jsx";
import { useEffect, useCallback, useRef } from "react";

function MoveNavigation() {
  const { setMoveIndex, moves, moveIndex, handleSeePreviousState } =
    useGameContext();

  useEffect(() => {
    setMoveIndex(moves?.length - 1);
  }, [moves?.length, setMoveIndex]);

  // Debounce function using setTimeout
  const debounceRef = useRef(null);

  const debouncedSetMoveIndex = useCallback(
    (newIndex) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        handleSeePreviousState(newIndex);
      }, 150);
    },
    [handleSeePreviousState]
  );

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-1">
        <button
          className={`bg-[rgb(71,70,71)] flex items-center justify-center transition-all p-2 rounded-md w-[4rem] h-[2rem] text-white ${
            moveIndex <= -1
              ? "hover:cursor-not-allowed brightness-50"
              : "hover:cursor-pointer active:brightness-75"
          } `}
          onClick={() => debouncedSetMoveIndex(-1)}
        >
          <img
            src="/images/first.png"
            alt=""
            className="w-4 invert brightness-0"
          />
        </button>
        <button
          className={`bg-[rgb(71,70,71)] flex items-center justify-center transition-all p-2 rounded-md w-[4rem] h-[2rem] text-white ${
            moveIndex <= -1
              ? "hover:cursor-not-allowed brightness-50"
              : "hover:cursor-pointer active:brightness-75"
          } `}
          onClick={() => debouncedSetMoveIndex(Math.max(moveIndex - 1, -1))}
        >
          <img
            src="/images/arrow.png"
            alt=""
            className="w-4 invert brightness-0 rotate-180"
          />
        </button>
      </div>
      <div className="flex gap-1">
        <button
          className={`bg-[rgb(71,70,71)] flex items-center justify-center transition-all p-2 rounded-md w-[4rem] h-[2rem] text-white ${
            moveIndex >= moves.length - 1
              ? "hover:cursor-not-allowed brightness-50"
              : "hover:cursor-pointer active:brightness-75"
          } `}
          onClick={() =>
            debouncedSetMoveIndex(Math.min(moveIndex + 1, moves.length - 1))
          }
          disabled={moveIndex >= moves.length - 1}
        >
          <img
            src="/images/arrow.png"
            alt=""
            className="w-4 invert brightness-0"
          />
        </button>
        <button
          className={`bg-[rgb(71,70,71)] flex items-center justify-center transition-all p-2 rounded-md w-[4rem] h-[2rem] text-white ${
            moveIndex >= moves.length - 1
              ? "hover:cursor-not-allowed brightness-50"
              : "hover:cursor-pointer active:brightness-75"
          } `}
          onClick={() => debouncedSetMoveIndex(moves.length - 1)}
          disabled={moveIndex >= moves.length - 1}
        >
          <img
            src="/images/first.png"
            alt=""
            className="w-4 invert brightness-0 rotate-180"
          />
        </button>
      </div>
    </div>
  );
}

export default MoveNavigation;
