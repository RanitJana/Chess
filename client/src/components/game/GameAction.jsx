import { useState } from "react";
import { gameEnd } from "../../api/game.js";
import Toast from "../../utils/Toast.js";
import { useGameContext } from "../../pages/Game.jsx";
import { colors, winReason } from "../../constants.js";
import { socket } from "../../socket.js";

function GameAction() {
  const {
    isCheckMate,
    setCheckMate,
    setWinnerReason,
    gameId,
    playerColor,
    opponent,
  } = useGameContext();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleResign = async () => {
    if (isSubmit) return;
    try {
      setIsSubmit(true);
      const whoWon = playerColor == colors.white ? colors.black : colors.white;
      const winnerReason =
        whoWon == colors.white
          ? winReason.byBlackResigns
          : winReason.byWhiteResigns;

      const response = await gameEnd({
        gameId,
        winner: whoWon,
        reason: winnerReason,
      });

      const { success, message } = response.data;
      if (success) {
        socket.emit("accept-draw", {
          gameId,
          info: {
            winner: whoWon,
            reason: winnerReason,
          },
        });
        setCheckMate(whoWon);
        setWinnerReason(winnerReason);
      } else Toast.error(message);
    } catch (error) {
      Toast.error(error.message || "Please try again");
    } finally {
      setIsSubmit(false);
    }
  };

  const sendDrawProposal = async () => {
    socket.emit("send-draw-proposal", { userId: opponent._id });
  };
  return (
    <div className="p-4 flex gap-2">
      <button
        className={`w-[7rem] h-[2.5rem] bg-[rgb(70,70,70)] transition-all px-4 py-2 rounded-md text-white flex justify-center items-center text-sm font-bold ${isSubmit || isCheckMate ? "brightness-50 hover:cursor-not-allowed" : "hover:bg-[rgb(55,55,55)]"} `}
        onClick={sendDrawProposal}
        disabled={isSubmit || isCheckMate}
      >
        <span className="text-xl font-extrabold pr-2">½</span>
        <span>Draw</span>
      </button>
      <button
        className={`w-[7rem] h-[2.5rem] bg-[rgb(70,70,70)]  transition-all px-4 py-2 rounded-md text-white flex justify-center items-center text-sm font-bold ${isSubmit || isCheckMate ? "brightness-50 hover:cursor-not-allowed" : "hover:bg-[rgb(55,55,55)]"} `}
        onClick={handleResign}
        disabled={isSubmit || isCheckMate}
      >
        <img
          src="/images/resign.png"
          alt=""
          className="invert brightness-0 w-5"
        />
        <span>Resign</span>
      </button>
    </div>
  );
}

export default GameAction;
