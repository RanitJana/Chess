/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { colors, winner } from "../../constants.js";
import GetAvatar from "../../utils/GetAvatar.js";
import { useGameContext } from "../../pages/Game.jsx";
import Toast from "../../utils/Toast.js";
import { gameInit } from "../../api/game.js";
import Canvas from "../Canvas.jsx";

function isYourWin(playerColor, isCheckMate) {
  return playerColor == isCheckMate || isCheckMate == winner.draw;
}

function closeContainer(reference, parentContainerRef, delay) {
  if (!reference || !parentContainerRef) return;
  reference.style.opacity = "0";
  parentContainerRef.style.opacity = "0";
  setTimeout(() => {
    reference.style.transform = "scale(0)";
    parentContainerRef.style.transform = "scale(0)";
  }, delay);
}

function WinnerBoard({ winnerReason, score }) {
  const { playerColor, isCheckMate, players } = useGameContext();

  const containerRef = useRef(null);
  const parentContainerRef = useRef(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const handleNewGame = async () => {
    if (isCreatingGame) return;
    try {
      setIsCreatingGame(true);
      const response = await gameInit();
      const { success, info, message } = response?.data || {};
      if (success) {
        Toast.success(message);
      } else {
        Toast.error(message || "Failed to create a game");
      }
    } catch (error) {
      console.error("Error creating a game:", error);
      Toast.error("Something went wrong while creating a game");
    } finally {
      setIsCreatingGame(false);
    }
  };

  useEffect(() => {
    const containerReference = containerRef.current;
    if (containerReference) {
      containerReference.style.transform = "scale(0)";
      parentContainerRef.current.style.opacity = "1";
      setTimeout(() => {
        containerReference.style.opacity = "1";
        containerReference.style.transform = "scale(1)";
      }, 150);
    }
  }, [winnerReason]);

  if (!isCheckMate) return;

  return (
    <div
      ref={parentContainerRef}
      className="flex duration-500 transition-opacity ease-out transform  justify-center items-center w-dvw h-dvh fixed top-0 left-0 z-[9999] bg-[rgba(0,0,0,0.5)]"
    >
      <div
        ref={containerRef}
        className="relative bg-blackDarkest transition-all scale-0 opacity-0 rounded-md text-white w-[min(100dvw,20rem)] flex flex-col items-center justify-center shadow-lg"
      >
        <div className="flex justify-center items-center bg-blackLight p-4 w-[min(100dvw,20rem)] rounded-tl-md rounded-tr-md">
          <img
            src="/images/cross.png"
            onClick={(e) => {
              closeContainer(
                containerRef.current,
                parentContainerRef.current,
                150
              );
            }}
            alt=""
            className="z-50 absolute hover:cursor-pointer right-0 top-0 rounded-md w-8 p-1"
          />
          {isCheckMate == winner.draw ? (
            <div className="flex flex-col items-center justify-center">
              <p className="font-bold text-xl uppercase">Game Draw!</p>
              <span className="text-sm text-gray-300">{winnerReason}</span>
            </div>
          ) : isYourWin(playerColor, isCheckMate) ? (
            <>
              <Canvas />
              <img src="/images/trophy.png" alt="" className="mr-2 w-8" />
              <div className="flex flex-col items-center justify-center">
                <p className="font-bold text-xl uppercase">
                  {playerColor} Won !
                </p>
                <span className="text-sm text-gray-300">{winnerReason}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="font-bold text-xl uppercase">
                {playerColor} Lost !
              </p>
              <span className="text-sm text-gray-300">{winnerReason}</span>
            </div>
          )}
        </div>
        <div className="w-full p-4 z-10">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-1 text-xs font-bold text-gray-400">
              <div
                className={`w-[4rem] rounded-2xl overflow-hidden border-4 ${isCheckMate == colors.white ? "border-green-600" : "border-white"}`}
                dangerouslySetInnerHTML={{
                  __html: GetAvatar(players.player1?.name),
                }}
              />
              <span>{players.player1?.name}</span>
              <div>
                <span className="mr-1">{players.player1?.rating}</span>(
                <span
                  className={`${score.white >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {score.white >= 0 ? "+" : ""}
                  {score.white}
                </span>
                )
              </div>
            </div>
            <span className="text-white font-bold text-[1.5rem] px-3">vs</span>
            <div className="flex flex-col items-center gap-1 text-xs font-bold text-gray-400">
              <div
                className={`w-[4rem] rounded-2xl overflow-hidden border-4 ${isCheckMate == colors.black ? "border-green-600" : "border-white"}`}
                dangerouslySetInnerHTML={{
                  __html: GetAvatar(players.player2?.name),
                }}
              />
              <span>{players.player2?.name}</span>
              <span>
                <span className="mr-1">{players.player2?.rating}</span>(
                <span
                  className={`${score.black >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {score.black >= 0 ? "+" : ""}
                  {score.black}
                </span>
                )
              </span>
            </div>
          </div>
          <button className="bg-buttonLight w-full rounded-lg h-12 p-4 py-3 hover:cursor-pointer min-h-fit flex justify-center items-center gap-5 font-extrabold text-[1.3rem] text-white shadow-[0_5px_0px_0px_rgb(69,116,61)] mt-4 }">
            Game Review
          </button>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              className={`rounded-md bg-blackLight px-4 py-2 hover:bg-blackDark transition-all ${isCreatingGame ? "brightness-50 hover:cursor-not-allowed" : "hover:cursor-pointer"}`}
              onClick={handleNewGame}
              disabled={isCreatingGame}
            >
              New 3 days
            </button>
            <button
              className={`rounded-md bg-blackLight px-4 py-2 hover:bg-blackDark transition-all ${isCreatingGame ? "brightness-50 hover:cursor-not-allowed" : "hover:cursor-pointer"}`}
              disabled={isCreatingGame}
            >
              Rematch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinnerBoard;
