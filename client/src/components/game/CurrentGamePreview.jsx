/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import { gameOngoing, gameSingle } from "../../api/game.js";
import { socket } from "../../socket.js";
import MemoEmptyDailyGames from "./EmptyDailyGames.jsx";
import { useSocketContext } from "../../context/SocketContext.jsx";
import MemoDailyGamesLoading from "./DailyGamesLoading.jsx";
import Toast from "../../utils/Toast.js";
import CurrentOngingAccepted from "./CurrentOngingAccepted.jsx";

function OngoingHeadline({ length = 0 }) {
  return (
    <div className="flex gap-2 p-4 border-b-[2px] border-blackLight">
      <img src="/images/sun.png" alt="" className="invert w-6 aspect-square" />
      <p className="text-white font-bold">Ongoing Games ({length})</p>
    </div>
  );
}

function CurrentGamePreview({ userId, addNewGame = null, setAddNewGame }) {
  const { onlineUsers } = useSocketContext();

  const [games, setGames] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchOngoingGames = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await gameOngoing(userId);

      if (data?.success) setGames(data.info);
      else Toast.error("Please try to login again");
    } catch {
      Toast.error("Something went wrong while fetching games.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleUpdateGamePreview = useCallback(
    async (gameId) => {
      try {
        const { data } = await gameSingle(gameId);
        if (data?.success) {
          console.log(data);
          
          setGames((prev) =>
            prev.map((game) =>
              game._id === gameId
                ? {
                    ...game,
                    moves: data.info.game.moves,
                    board: data.info.game.board,
                  }
                : game
            )
          );
        } else {
          Toast.error("Failed to fetch game updates.");
        }
      } catch {
        Toast.error("Something went wrong while updating game preview.");
      }
    },
    [setGames]
  );

  useEffect(() => {
    fetchOngoingGames();
  }, [fetchOngoingGames]);

  useEffect(() => {
    if (addNewGame != null) {
      setGames((prev) => [addNewGame, ...prev]);
      setAddNewGame(null);
    }
  }, [addNewGame, setAddNewGame]);

  useEffect(() => {
    socket.on("update-game-preview", handleUpdateGamePreview);
    return () => socket.off("update-game-preview", handleUpdateGamePreview);
  }, [handleUpdateGamePreview]);

  const content = useMemo(() => {
    if (isLoading) return <MemoDailyGamesLoading />;
    if (games.length === 0) return <MemoEmptyDailyGames />;

    return (
      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 p-4">
        {games.map((game) => {
          const player = game.player1 || game.player2;
          const turn = game.board.split(" ")[1];
          return (
            <CurrentOngingAccepted
              key={game._id}
              game={game}
              blur={
                (turn == "w" && game.player1) || (turn == "b" && game.player2)
              }
              player={player}
              isOnline={onlineUsers[player?._id]}
            />
          );
        })}
      </div>
    );
  }, [isLoading, games, onlineUsers]);

  return (
    <div className="w-full max-w-[970px] bg-blackDark rounded-md">
      <OngoingHeadline length={games?.length} />
      {content}
    </div>
  );
}

export default CurrentGamePreview;
