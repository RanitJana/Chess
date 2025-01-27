/* eslint-disable react/prop-types */
import ChessBoardPreview from "./ChessBoardPreview.jsx";
import { colors } from "../../constants";
import GetAvatar from "../../utils/GetAvatar.js";
import { useState } from "react";
import { gameChallangeAccept, gameChallangeReject } from "../../api/game.js";
import Toast from "../../utils/Toast.js";
import Loader from "../Loader.jsx";

function CurrentOngoingChallange({
  game,
  setGames,
  player,
  challanger,
  setAddNewGame,
}) {
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    try {
      setLoading(true);
      const response = await gameChallangeReject(game._id);
      const { success, message } = response.data;
      if (success) {
        setGames((prev) => prev.filter((value) => value._id != game._id));
        Toast.success(message);
      } else Toast.error(message);
    } catch {
      Toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleAccept = async () => {
    try {
      setLoading(true);
      const response = await gameChallangeAccept(game._id);
      const { success, message } = response.data;
      if (success) {
        if (challanger) game.player1 = null;
        else game.player2 = null;
        setAddNewGame(game);
        setGames((prev) => prev.filter((value) => value._id != game._id));
        Toast.success(message);
      } else Toast.error(message);
    } catch {
      Toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      key={game._id}
      className="group relative rounded-md overflow-hidden cursor-pointer shadow-[0_5px_0px_0px_rgb(29,28,26)]"
    >
      {loading && <Loader />}
      <div className="relative">
        <div className="absolute h-full w-full inset-0 bg-black opacity-80 flex justify-center items-center"></div>
        <ChessBoardPreview
          boardString={game.board}
          playerColor={challanger ? colors.white : colors.black}
        />
        <div className="absolute w-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center gap-1">
          <div className="h-10 aspect-square rounded-xl bg-white overflow-hidden relative">
            <div
              dangerouslySetInnerHTML={{
                __html: GetAvatar(player?.name),
              }}
            />
          </div>
          <span className="text-white font-semibold text-xs max-w-[80%] overflow-hidden line-clamp-1 break-words">
            {player.name}
          </span>
        </div>
      </div>
      <div className="bg-blackDark transition-all flex w-full h-14 items-center justify-center p-2">
        <div
          className={`grid ${challanger ? "" : "grid-cols-2"} gap-2 w-full h-full items-center `}
        >
          <button
            className="bg-red-600 h-full flex justify-center items-center rounded-md "
            onClick={handleReject}
          >
            <img
              src="/images/cross.png"
              alt=""
              className="w-6 invert brightness-0"
            />
          </button>
          {!challanger && (
            <button
              className="bg-green-600 h-full flex justify-center items-center rounded-md "
              onClick={handleAccept}
            >
              <img
                src="/images/tick.png"
                alt=""
                className="w-6 invert brightness-0"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrentOngoingChallange;
