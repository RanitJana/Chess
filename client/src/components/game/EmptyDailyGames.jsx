import React from "react";

function EmptyDailyGames() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <img src="/images/no-game.png" alt="" className="w-[5rem]" />
      <span className="text-white font-semibold">Empty games!</span>
    </div>
  );
}

const MemoEmptyDailyGames = React.memo(EmptyDailyGames);

export default MemoEmptyDailyGames;
