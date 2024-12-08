/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ChessBoardPreview from "./ChessBoardPreview.jsx";

function CurrentGamePreview({ games = [] }) {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[970px]">
      <p className="text-white font-bold mb-4">Daily Games</p>
      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
        {games?.map((game) => {
          const player = game.player1 || game.player2;
          return (
            <div
              key={game._id}
              className="relative bg-blackDarkest rounded-sm overflow-hidden cursor-pointer"
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
                ((!game.player1 && game.moves.length % 2 != 0) ||
                  (!game.player2 && game.moves.length % 2 == 0)) && (
                  <div className="absolute inset-0 bg-black opacity-40 flex justify-center items-center">
                    {/* <p className="text-white font-semibold text-sm text-center">Waiting for an opponent...</p> */}
                  </div>
                )}
              <ChessBoardPreview
                boardString={game.board}
                playerColor={game.player1 ? "black" : "white"}
              />
              <div className="flex items-center p-2 bg-blackDark">
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
    </div>
  );
}

export default CurrentGamePreview;
