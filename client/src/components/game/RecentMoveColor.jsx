/* eslint-disable react/prop-types */
import getHighlightColor from "../../utils/game/getHighlightedColor.js";
import { useGameContext } from "../../pages/Game.jsx";
function RecentMoveColor({ square }) {
  const { moves, themeColor, moveIndex } = useGameContext();
  return (
    <div>
      {moveIndex >= 0 &&
        (moves[moveIndex].from == square || moves[moveIndex].to == square) && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundColor: getHighlightColor(themeColor.dark, 0.7) }}
          ></div>
        )}
    </div>
  );
}

export default RecentMoveColor;
