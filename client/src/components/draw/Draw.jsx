/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { winReason, winner } from "../../constants.js";
import { useGameContext } from "../../pages/Game.jsx";
import { gameEnd } from "../../api/game.js";
import Toast from "../../utils/Toast.js";
import { getScore } from "../../constants.js";
import { socket } from "../../socket.js";
import { useAuthContext } from "../../context/AuthContext.jsx";

function Draw({ isOpen = false, setOpen, opponent }) {
  const { playerInfo } = useAuthContext();
  const { gameId, setCheckMate, setWinnerReason, setScore } = useGameContext();

  const [left, setLeft] = useState(-100);
  const [isDrawSubmit, setIsDrawSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLeft(0);
    } else setLeft(-100);
  }, [isOpen]);

  const handleDraw = async () => {
    if (isDrawSubmit) return;
    try {
      setIsDrawSubmit(true);
      const whoWon = winner.draw;
      const winnerReason = winReason.byDraw;

      const score = getScore(playerInfo.rating, opponent.rating, 0.5);

      const response = await gameEnd({
        gameId,
        winner: whoWon,
        reason: winnerReason,
        score,
      });

      const { success, message } = response.data;
      if (success) {
        socket.emit("send-resign", {
          gameId,
          info: {
            winner: whoWon,
            reason: winnerReason,
            score,
          },
        });
        setScore(score);
        setCheckMate(whoWon);
        setWinnerReason(winnerReason);
      } else Toast.error(message);
    } catch (error) {
      Toast.error(error.message || "Please try again");
    } finally {
      setIsDrawSubmit(false);
    }
  };

  return (
    <div
      className={`z-50 bg-blackDarkest rounded-md p-2 shadow-md transition-all`}
      style={{
        position: "fixed",
        left: `${left}%`,
        bottom: "25%",
      }}
    >
      <p className="text-white pb-2 text-center text-sm">
        <span className="text-gray-400">Your opponent</span>
        <br />
        <span className="text-xs">Offers a draw!!</span>
      </p>
      <div className="flex gap-2">
        <button
          className={`bg-red-500 px-8 py-2 rounded-full transition-all ${isDrawSubmit ? "brightness-50 hover:cursor-not-allowed" : "hover:bg-red-600"}`}
          onClick={() => setOpen(false)}
          disabled={isDrawSubmit}
        >
          <img
            src="/images/cross.png"
            alt=""
            className="w-5 invert brightness-0"
          />
        </button>
        <button
          className={`bg-green-500 px-8 py-2 rounded-full transition-all ${isDrawSubmit ? "brightness-50 hover:cursor-not-allowed" : "hover:bg-green-600"}`}
          onClick={handleDraw}
          disabled={isDrawSubmit}
        >
          <img
            src="/images/tick.png"
            alt=""
            className="w-5 invert brightness-0"
          />
        </button>
      </div>
    </div>
  );
}

export default Draw;
