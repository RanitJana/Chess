/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
import GetAvatar from "../../utils/GetAvatar.js";

function PlayerInfoInGame({ player = {}, isOnline = false }) {
  const navigate = useNavigate();

  if (!player) return;
  return (
    <div className="flex justify-between items-center">
      <div className="flex py-2 gap-4">
        <div className=" relative h-10 aspect-square rounded-xl bg-white overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: GetAvatar(player?.name) }} />
          {isOnline && (
            <div className="absolute right-0 bottom-0 w-3 aspect-square bg-green-600"></div>
          )}
        </div>
        <p>
          <span
            onClick={() => navigate(`/member/${player._id}`)}
            className="text-white font-semibold mr-1 hover:cursor-pointer"
          >
            {player.name}
          </span>
          <span className="text-gray-400">({player.rating})</span>
        </p>
      </div>
      <div className="flex items-center justify-evenly gap-1 w-full max-w-[7rem] bg-white p-2 rounded-md">
        <img src="/images/time.gif" alt="" />
        <span>3 days</span>
      </div>
    </div>
  );
}

export default PlayerInfoInGame;
