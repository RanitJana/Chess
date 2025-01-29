/* eslint-disable react/prop-types */
import ChessBoardPreview from "./ChessBoardPreview.jsx";
import { colors } from "../../constants";
import GetAvatar from "../../utils/GetAvatar.js";
import { useCallback, useState } from "react";
import { gameChallangeAccept, gameChallangeReject } from "../../api/game.js";
import Toast from "../../utils/Toast.js";
import { socket } from "../../socket.js";

function CurrentOngoingChallange({
  game,
  setGames,
  player,
  challanger,
  setAddNewGame,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const updateGanes = useCallback(
    (gameId) => {
      setGames((prev) => prev.filter((value) => value._id != gameId));
    },
    [setGames]
  );

  const handleReject = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const { data } = await gameChallangeReject(game._id);
      if (data?.success) {
        updateGanes(game._id);
        socket.emit("reject-challange", {
          gameId: game._id,
          userId: player._id,
        });
        Toast.success(data.message);
      } else Toast.error(data?.message || "Try again");
    } catch {
      Toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const { data } = await gameChallangeAccept(game._id);
      if (data?.success) {
        game.moves = ["0"];
        socket.emit("accept-challange", {
          game: challanger
            ? { ...game, player2: null, isGameStarted: true }
            : { ...game, player1: null, isGameStarted: true },
          userId: player._id,
        });
        if (challanger) game.player1 = null;
        else game.player2 = null;
        setAddNewGame(game);
        updateGanes(game._id);
        Toast.success(data.message);
      } else Toast.error(data?.message || "Try again");
    } catch {
      Toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      key={game._id}
      className="group relative rounded-md overflow-hidden cursor-pointer shadow-[0_5px_0px_0px_rgb(29,28,26)]"
    >
      <div className="relative">
        <div className="absolute h-full w-full inset-0 bg-black opacity-80 flex justify-center items-center"></div>
        <ChessBoardPreview
          boardString={game.board}
          playerColor={challanger ? colors.white : colors.black}
        />
        <div className="absolute w-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center gap-1">
          <div className="h-14 p-1 aspect-square rounded-xl bg-white overflow-hidden relative">
            <div
              dangerouslySetInnerHTML={{
                __html: GetAvatar(player?.name),
              }}
              className=" rounded-xl overflow-hidden"
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
            disabled={isLoading}
            className={`bg-red-600 ${isLoading ? "brightness-50 cursor-not-allowed" : "hover:bg-red-700 "} transition-all h-full flex justify-center items-center rounded-md`}
            onClick={handleReject}
          >
            <img
              src="/images/reject.png"
              alt=""
              className="w-6 invert brightness-0"
            />
          </button>
          {!challanger && (
            <button
              disabled={isLoading}
              className={`bg-green-600 ${isLoading ? "brightness-50 cursor-not-allowed" : "hover:bg-green-700 "} transition-all h-full flex justify-center items-center rounded-md`}
              onClick={handleAccept}
            >
              <img
                src="/images/accept.png"
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
