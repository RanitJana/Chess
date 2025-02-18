import { useGameContext } from "../../pages/Game.jsx";
import { useEffect, useCallback, useRef, useState } from "react";

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

  const timeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (moveIndex >= moves.length - 1) {
      clearInterval(timeRef.current);
      setIsPlaying(false);
    }
  }, [moveIndex, moves.length]);

  const handlePlay = () => {
    if (timeRef.current) clearInterval(timeRef.current);
    setIsPlaying(true);

    setMoveIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, moves.length - 1);
      handleSeePreviousState(newIndex);
      return newIndex;
    });

    timeRef.current = setInterval(() => {
      setMoveIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, moves.length - 1);
        handleSeePreviousState(newIndex);
        return newIndex;
      });
    }, 1000);
  };

  const handleStop = () => {
    if (timeRef.current) clearInterval(timeRef.current);
    setIsPlaying(false);
  };

  return (
    <div className="flex justify-between items-center w-full">
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
            className="w-3 invert brightness-0"
          />
        </button>
      </div>
      <div>
        {isPlaying ? (
          <button
            onClick={handleStop}
            className="transition-all hover:cursor-pointer active:brightness-75 hover:brightness-90 bg-red-500 rounded-full h-[2.5rem] aspect-square flex justify-center items-center"
          >
            <img
              src="/images/stop.png"
              alt=""
              className="w-4 invert brightness-0"
            />
          </button>
        ) : (
          <button
            onClick={handlePlay}
            disabled={moveIndex == moves.length - 1}
            className="transition-all hover:cursor-pointer active:brightness-75 hover:brightness-90 bg-green-500 rounded-full h-[2.5rem] aspect-square flex justify-center items-center"
          >
            <img
              src="/images/play.png"
              alt=""
              className="w-4 invert brightness-0"
            />
          </button>
        )}
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
            className="w-3 invert brightness-0 rotate-180"
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
