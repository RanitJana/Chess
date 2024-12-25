/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ChessBoardPreview from "./ChessBoardPreview.jsx";
import { useEffect, useState } from "react";
import { gameOngoing, gameSingle } from "../api/game.js";
import toast from "react-hot-toast";
import { socket } from "../socket.js";

function CurrentGamePreview({ userId, addNewGame = null, setAddNewGame }) {
  const [games, setGames] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (addNewGame != null) {
      setGames((prev) => [addNewGame, ...prev]);
      setAddNewGame(null);
    }
  }, [addNewGame, setAddNewGame]);

  useEffect(() => {
    const fetchOngoingGames = async () => {
      try {
        setLoading(true);
        const response = await gameOngoing(userId);

        const { success, info } = response?.data || {};
        if (success) {
          setGames(info);
        } else {
          toast.error("Failed to fetch games.");
          toast.error("Please try to login again");
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        toast.error("Something went wrong while fetching games.");
      } finally {
        setLoading(false);
      }
    };

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
      } catch (error) {
        console.error("Error updating game preview:", error);
        toast.error("Something went wrong while updating game preview.");
      }
    };

    fetchOngoingGames();
    socket.on("update-game-preview", handleUpdateGamePreview);

    return () => {
      socket.off("update-game-preview", handleUpdateGamePreview);
    };
  }, [userId]);

  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[970px] bg-blackDarkest rounded-md">
      <div className="flex gap-2 p-4 border-b-[2px] border-blackLight">
        <img src="/images/sun.png" alt="" className="invert w-6 aspect-square" />
        <p className="text-white font-bold">
          Ongoing Games ({games?.length || 0})
        </p>
      </div>
      {isLoading ? (
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 p-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx}>
              <div className="aspect-square bg-[rgba(0,0,0,0.22)] rounded-md"></div>
              <div className="h-[60px] rounded-md shadow-[0_5px_0px_0px_rgb(29,28,26)] bg-blackDark"></div>
            </div>
          ))}
        </div>
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
                {!player && (
                  <div className="absolute inset-0 bg-black opacity-75 flex justify-center items-center">
                    <p className="text-white font-semibold text-sm text-center">
                      Waiting for an opponent...
                    </p>
                  </div>
                )}
                {player &&
                  ((!game.player1 && parseInt(game.moves[0]) % 2 != 0) ||
                    (!game.player2 && parseInt(game.moves[0]) % 2 == 0)) && (
                    <div className="absolute inset-0 bg-black opacity-40 flex justify-center items-center">
                      {/* <p className="text-white font-semibold text-sm text-center">Waiting for an opponent...</p> */}
                    </div>
                  )}
                <ChessBoardPreview
                  boardString={game.board}
                  playerColor={game.player1 ? "black" : "white"}
                />
                <div className="flex items-center p-2 bg-blackDark transition-all group-hover:bg-[rgb(58,56,54)]">
                  {/* <div className="h-10 w-10 bg-white rounded-full" /> */}
                  <div className="h-10 aspect-square rounded-sm bg-white overflow-hidden">
                    <img src="/images/user-pawn.gif" alt="" />
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
        <div className="flex flex-col items-center justify-center p-4">
          <img src="/images/no-game.png" alt="" className="w-[5rem]" />
          <span className="text-white font-semibold">
            Play Your First Game!
          </span>
        </div>
      )}
    </div>
  );
}

export default CurrentGamePreview;
