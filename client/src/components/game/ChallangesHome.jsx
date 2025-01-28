/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import { gameChallanges } from "../../api/game.js";
import MemoEmptyDailyGames from "./EmptyDailyGames.jsx";
import MemoDailyGamesLoading from "./DailyGamesLoading.jsx";
import Toast from "../../utils/Toast.js";
import CurrentOngoingChallange from "./CurrentOngoingChallange.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";

function ChallangesHeadline({ length = 0 }) {
  return (
    <div className="flex gap-2 p-4 border-b-[2px] border-blackLight">
      <img
        src="/images/versus.png"
        alt=""
        className="invert w-6 aspect-square"
      />
      <p className="text-white font-bold">Challanges ({length})</p>
    </div>
  );
}

function ChallangesHome({ setAddNewGame, games, setGames }) {
  const { playerInfo } = useAuthContext();
  const userId = playerInfo?._id;

  const [isLoading, setLoading] = useState(true);

  const fetchOngoingChallanges = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await gameChallanges(userId);
      if (data?.success) setGames(data.info);
      else Toast.error("Please try to login again");
    } catch {
      Toast.error("Something went wrong while fetching games.");
    } finally {
      setLoading(false);
    }
  }, [setGames, userId]);

  useEffect(() => {
    fetchOngoingChallanges();
  }, [fetchOngoingChallanges]);

  const content = useMemo(() => {
    if (isLoading) return <MemoDailyGamesLoading />;
    if (games.length === 0) return <MemoEmptyDailyGames />;

    return (
      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 p-4">
        {games?.map((game) => {
          const challanger = game.player1._id.toString() == userId;
          const player = challanger ? game.player2 : game.player1;

          return (
            <CurrentOngoingChallange
              key={game._id}
              setGames={setGames}
              game={game}
              player={player}
              challanger={challanger}
              setAddNewGame={setAddNewGame}
            />
          );
        })}
      </div>
    );
  }, [isLoading, games, setGames, setAddNewGame, userId]);

  return (
    <div className="w-full max-w-[970px] bg-blackDark rounded-md">
      <ChallangesHeadline length={games?.length} />
      {content}
    </div>
  );
}

export default ChallangesHome;
