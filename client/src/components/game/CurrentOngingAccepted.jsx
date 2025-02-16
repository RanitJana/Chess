/* eslint-disable react/prop-types */
import GetAvatar from "../../utils/GetAvatar.js";
import { colors } from "../../constants.js";
import { useNavigate } from "react-router";
import ChessBoardPreview from "./ChessBoardPreview.jsx";
import WaitingForOpponent from "./WaitingForOpponent.jsx";

function CurrentOngingAccepted({ game, player, isOnline }) {
  const navigate = useNavigate();
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
        board={game.board}
        playerColor={game.player1 ? colors.black : colors.white}
      />
      <div className="flex items-center gap-1 p-2 bg-blackDark transition-all group-hover:bg-[rgb(58,56,54)]">
        <div className="relative">
          <div className="h-10 aspect-square rounded-xl bg-white overflow-hidden relative">
            <div
              dangerouslySetInnerHTML={{
                __html: GetAvatar(player?.name || "guest"),
              }}
            />
          </div>
          {isOnline && (
            <div className="absolute right-0 translate-x-[50%] bottom-0 w-3 aspect-square rounded-full bg-green-600"></div>
          )}
        </div>

        <div className="pl-2 text-white text-sm">
          <p className="font-bold line-clamp-1">
            {player?.name || " waiting..."}
          </p>
          <p className="text-gray-400 line-clamp-1">3 days</p>
        </div>
      </div>
    </div>
  );
}

export default CurrentOngingAccepted;
