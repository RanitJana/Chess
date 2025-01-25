/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ChessBoardPreview from "./ChessBoardPreview.jsx";
import { useCallback, useEffect, useState } from "react";
import { gameOngoing, gameSingle } from "../../api/game.js";
import toast from "react-hot-toast";
import { socket } from "../../socket.js";
import GetAvatar from "../../utils/GetAvatar.js";
import MemoEmptyDailyGames from "./EmptyDailyGames.jsx";
import { useSocketContext } from "../../context/SocketContext.jsx";
import MemoDailyGamesLoading from "./DailyGamesLoading.jsx";
import WaitingForOpponent from "./WaitingForOpponent.jsx";

function CurrentGamePreview({ userId, addNewGame = null, setAddNewGame }) {
  const navigate = useNavigate();
  const { onlineUsers } = useSocketContext();

  const [games, setGames] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (addNewGame != null) {
      setGames((prev) => [addNewGame, ...prev]);
      setAddNewGame(null);
    }
  }, [addNewGame, setAddNewGame]);

  const fetchOngoingGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await gameOngoing(userId);

      const { success, info } = response?.data || {};
      if (success) {
        setGames(info);
      } else {
        toast.error("Please try to login again");
      }
    } catch {
      toast.error("Something went wrong while fetching games.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOngoingGames();
  }, [fetchOngoingGames]);

  useEffect(() => {
    const handleUpdateGamePreview = async (gameId) => {
      try {
        const response = await gameSingle(gameId);
        const { success, info } = response?.data || {};
        if (success) {
          setGames((prev) =>
            prev.map((game) =>
              game._id === gameId
                ? { ...game, moves: info.game.moves, board: info.game.board }
                : game
            )
          );
        } else {
          toast.error("Failed to fetch game updates.");
        }
      } catch {
        toast.error("Something went wrong while updating game preview.");
      }
    };
    socket.on("update-game-preview", handleUpdateGamePreview);

    return () => socket.off("update-game-preview", handleUpdateGamePreview);
  }, [userId]);

  return (
    <div className="w-full max-w-[970px] bg-blackDark rounded-md">
      <div className="flex gap-2 p-4 border-b-[2px] border-blackLight">
        <img
          src="/images/sun.png"
          alt=""
          className="invert w-6 aspect-square"
        />
        <p className="text-white font-bold">
          Ongoing Games ({games?.length || 0})
        </p>
      </div>
      {isLoading ? (
        <MemoDailyGamesLoading />
      ) : games?.length ? (
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 p-4">
          {games?.map((game) => {
            const player = game.player1 || game.player2;
            return (
              <div
                key={game._id}
                className="group relative rounded-md overflow-hidden cursor-pointer shadow-[0_5px_0px_0px_rgb(29,28,26)]"
                onClick={() => player && navigate(`/game/${game._id}`)}
              >
                {/* new game */}
                <WaitingForOpponent player={player} />
                {player &&
                  ((!game.player1 && parseInt(game.moves[0]) % 2 != 0) ||
                    (!game.player2 && parseInt(game.moves[0]) % 2 == 0)) && (
                    <div className="absolute inset-0 bg-black opacity-40 flex justify-center items-center z-10"></div>
                  )}
                <ChessBoardPreview
                  boardString={game.board}
                  playerColor={game.player1 ? "black" : "white"}
                />
                <div className="flex items-center p-2 bg-blackDark transition-all group-hover:bg-[rgb(58,56,54)]">
                  <div className="h-10 aspect-square rounded-xl bg-white overflow-hidden relative">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: GetAvatar(player?.name),
                      }}
                    />
                    {onlineUsers[player?._id] && (
                      <div className="absolute right-0 bottom-0 w-3 aspect-square bg-green-600"></div>
                    )}
                  </div>

                  <div className="pl-2 text-white">
                    <p className="font-bold">{player?.name || " waiting..."}</p>
                    <p className="text-sm text-gray-400">
                      {player ? "3 days" : "...."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <MemoEmptyDailyGames />
      )}
    </div>
  );
}

export default CurrentGamePreview;
