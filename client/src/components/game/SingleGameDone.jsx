/* eslint-disable react/prop-types */
import { colors } from "../../constants.js";
import { useNavigate } from "react-router";

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

function SingleGameDone({
  lastElement,
  gameId,
  player1,
  player2,
  winner,
  isUserCurrentGameWinner,
  totalMoves,
  updatedAt,
  withRandom,
}) {
  const navigate = useNavigate();

  return (
    <tr
      style={{
        borderBottom: !lastElement ? "1px solid rgb(80,80,80)" : "",
      }}
      onClick={() => navigate(`/game/${gameId}`)}
      className="text-center hover:cursor-pointer hover:bg-[rgb(27,27,27)] bg-blackDarkest transition-colors"
    >
      <td className="flex justify-center py-3">
        <div className="flex  items-center gap-4">
          <img
            src={withRandom ? "/images/sun.png" : "/images/versus.png"}
            alt=""
            className="w-6"
            style={{
              filter: "invert(50%) sepia(100%) saturate(400%) brightness(200%)",
            }}
          />
          <div className="flex flex-col justify-start text-start">
            <NamePlate
              name={player1.name}
              rating={player1.rating}
              winner={winner == colors.white}
            />
            <NamePlate
              name={player2.name}
              rating={player2.rating}
              winner={winner == colors.black}
            />
          </div>
        </div>
      </td>
      <td>
        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col">
            <span>{winner == colors.white ? 1 : 0}</span>
            <span>{winner == colors.black ? 1 : 0}</span>
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
      <td>{totalMoves}</td>
      <td>
        {new Date(updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
    </tr>
  );
}

export default SingleGameDone;
