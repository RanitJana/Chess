/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import "./GameDone.css";
import { useState, useEffect } from "react";
import { gameDone } from "../../api/game.js";
import Toast from "../../utils/Toast.js";
import { colors } from "../../constants.js";
import SingleGameDone from "./SingleGameDone.jsx";

function CompletedGames({ userId }) {
  const [games, setGames] = useState([]);
  const [totalDoneGames, setTotalDoneGames] = useState(0);
  const [fetchingDoneGamesAll, setFetchingDoneGamesAll] = useState(false);

  const fetchDoneGames = async (total = null) => {
    try {
      setFetchingDoneGamesAll(true);
      const response = await gameDone(total, userId);
      const { success, info, totalDocuments } = response?.data || {};
      if (success) {
        setGames(info);
        setTotalDoneGames(totalDocuments);
      } else Toast.error("Failed to fetch games.");
    } catch (error) {
      console.error("Error fetching games:", error);
      Toast.error("Something went wrong while fetching games.");
    } finally {
      setFetchingDoneGamesAll(false);
    }
  };

  useEffect(() => {
    fetchDoneGames(5);
  }, [userId]);

  return (
    <div className="w-full max-w-[970px] bg-blackDark rounded-md">
      <div className="text-white p-4 border-b-[2px] border-blackLight flex items-center justify-between">
        <div className="flex gap-2">
          <img
            src="/images/completed.png"
            alt=""
            className="invert w-6 aspect-square"
          />
          <p className="text-white font-bold">
            Completed Games ({totalDoneGames || 0})
          </p>
        </div>
        <span>
          {games.length < totalDoneGames ? (
            <button
              className=" bg-blackLight px-3 py-1 rounded-sm active:bg-blackDark"
              onClick={() => fetchDoneGames()}
            >
              See all
            </button>
          ) : (
            ""
          )}
        </span>
      </div>

      {/* empty list */}
      {games.length == 0 && (
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-gray-400">No record is found!</span>
        </div>
      )}

      {games.length ? (
        <div className="overflow-x-scroll">
          <table className="w-full min-w-[30rem] text-gray-300 h-fit bg-gray-700">
            <thead className=" bg-[rgb(27,27,27)]">
              <tr>
                <th className="p-2">Players</th>
                <th>Result</th>
                <th>Moves</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="border-separate">
              {games.map((game, idx) => {
                let isUserCurrentGameWinner =
                  (userId == game.player1._id && game.winner == colors.white) ||
                  (userId == game.player2._id && game.winner == colors.black);
                return (
                  <SingleGameDone
                    key={game._id}
                    gameId={game._id}
                    player1={game.player1}
                    player2={game.player2}
                    winner={game.winner}
                    lastElement={idx == games.length - 1}
                    isUserCurrentGameWinner={isUserCurrentGameWinner}
                    totalMoves={game.totalMoves}
                    updatedAt={game.updatedAt}
                    withRandom={game.withRandom}
                  />
                );
              })}

              {fetchingDoneGamesAll ? (
                <tr className=" text-center w-full hover:cursor-pointer hover:bg-[rgb(27,27,27)] bg-blackDarkest transition-colors">
                  <td
                    colSpan={4}
                    style={{ borderTop: "1px solid rgb(80,80,80)" }}
                    className="p-3 "
                  >
                    <span className="loader"></span>
                  </td>
                </tr>
              ) : (
                ""
              )}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default CompletedGames;
