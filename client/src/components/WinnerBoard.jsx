/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import MoveType from "./MoveType";

function WinnerBoard({ playerColor, isCheckMate, setCheckMate }) {
  function isYourWin() {
    return (
      (playerColor == "white" && isCheckMate == 1) ||
      (playerColor == "black" && isCheckMate == 2)
    );
  }

  if (isCheckMate == 0) return;

  return (
    <div className="flex justify-center items-center w-dvw h-dvh fixed top-0 left-0 z-[999] bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-blackDarkest rounded-md text-white w-[min(100dvw,20rem)] flex flex-col items-center justify-center shadow-lg">
        <div className="flex justify-center items-center bg-blackLight p-4 w-[min(100dvw,20rem)] rounded-tl-md rounded-tr-md">
          <img
            src="/images/cross.png"
            onClick={(e) => setCheckMate(0)}
            alt=""
            className="z-50 absolute hover:cursor-pointer right-0 top-0 rounded-md w-8"
          />
          {isYourWin() ? (
            <>
              <img
                src="/images/win.gif"
                alt=""
                className="absolute w-[15rem] top-0 left-0 translate-y-[-50%] translate-x-[20%]"
              />
              <img src="/images/trophy.png" alt="" className="mr-4" />
              <div className="flex flex-col items-center justify-center">
                <p className="font-bold text-2xl">You Won!</p>
                <span className="text-sm text-gray-300">By checkmate</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="font-bold text-2xl">You Lost!</p>
              <span className="text-sm text-gray-300">By checkmate</span>
            </div>
          )}
        </div>
        <div className="w-full p-4 z-10">
          <ul className="grid grid-cols-3 justify-between items-center">
            <li className="flex flex-col justify-center items-center">
              <span className="flex items-center gap-2 text-orange-300 font-bold">
                {<MoveType bgColor={"#fdba74"} value={"?"} />}
                {1}
              </span>
              <span className="font-bold text-orange-300">Mistake</span>
            </li>
            <li className="flex flex-col justify-center items-center">
              <span className="flex items-center gap-2 text-[#FF0000] font-bold">
                {<MoveType bgColor={"red"} value={"??"} />}
                {1}
              </span>
              <span className="font-bold text-[#FF0000]">Blunders</span>
            </li>
            <li className="flex flex-col justify-center items-center">
              <span className="flex items-center gap-2 text-rose-400 font-bold">
                {<MoveType bgColor={"#fb7185"} value={"x"} />}
                {1}
              </span>
              <span className="font-bold text-rose-400">Misses</span>
            </li>
          </ul>
          <button className="bg-buttonLight w-full rounded-lg h-12 p-4 py-3 hover:cursor-pointer min-h-fit flex justify-center items-center gap-5 font-extrabold text-[1.3rem] text-white shadow-[0_5px_0px_0px_rgb(69,116,61)] mt-4 }">
            Game Review
          </button>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button className="rounded-md bg-blackLight px-4 py-2">
              New 3 days
            </button>
            <button className="rounded-md bg-blackLight px-4 py-2">
              Rematch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinnerBoard;
