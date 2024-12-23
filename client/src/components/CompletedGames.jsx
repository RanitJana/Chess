/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./GameDone.css";
import { useNavigate } from "react-router-dom";

function NamePlate({ name, winner, rating }) {
  return (
    <div>
      <input
        type="checkbox"
        checked={winner}
        disabled
        className={`custom-checkbox ${winner ? "true" : "false"} mr-2`}
      />
      <span className="font-semibold text-gray-200">{name}</span>
      <span className="text-gray-400"> ({rating})</span>
    </div>
  );
}

function CompletedGames({
  games = [],
  fetchDoneGames,
  totalDoneGames,
  fetchingDoneGamesAll,
}) {

  function isUserWinner(game) {
    return game.youWon;
  }

  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[970px] bg-blackDarkest rounded-md">
      <p className="text-white p-4 border-b-[2px] border-blackLight flex items-center justify-between">
        <span className="font-bold">
          Completed Games ({totalDoneGames || 0})
        </span>
        <span className="mr-6">
          {games.length < totalDoneGames ? (
            <button onClick={() => fetchDoneGames()}>See all</button>
          ) : (
            ""
          )}
        </span>
      </p>
      {games?.length ? (
        <table className="w-full text-gray-300 h-fit bg-gray-700">
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
              let isUserCurrentGameWinner = isUserWinner(game);
              return (
                <tr
                  key={game._id}
                  style={{
                    borderBottom:
                      idx < games.length - 1 ? "1px solid rgb(80,80,80)" : "",
                  }}
                  onClick={(_) => navigate(`/game/${game._id}`)}
                  className="text-center hover:cursor-pointer hover:bg-[rgb(27,27,27)] bg-blackDarkest transition-colors"
                >
                  <td className="flex justify-center px-2 py-3">
                    <div className="flex flex-col justify-start text-start">
                      <NamePlate
                        name={game.player1.name}
                        rating={game.player1.rating}
                        winner={game.player1.won}
                      />
                      <NamePlate
                        name={game.player2.name}
                        rating={game.player2.rating}
                        winner={game.player2.won}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center gap-4">
                      <div className="flex flex-col">
                        <span>{game.player1.won ? "1" : "0"}</span>
                        <span>{game.player2.won ? "1" : "0"}</span>
                      </div>
                      <div
                        style={{
                          backgroundColor: isUserCurrentGameWinner
                            ? "rgb(128,183,76)"
                            : "red",
                        }}
                        className="group relative h-4 w-4 font-bold flex items-center justify-center rounded-sm text-blackDarkest text-[17px]"
                      >
                        {isUserCurrentGameWinner ? "+" : "-"}
                        <span className="absolute bottom-[150%] transition-opacity text-white bg-[rgba(0,0,0,0.68)] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 font-normal text-sm">
                          {isUserCurrentGameWinner ? "Won" : "Lost"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{game.totalMoves}</td>
                  <td>
                    {new Date(game.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
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
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-gray-400">No record is found!</span>
        </div>
      )}
    </div>
  );
}

export default CompletedGames;
