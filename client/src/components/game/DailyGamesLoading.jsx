import React from "react";

function DailyGamesLoading() {
  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 p-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx}>
          <div className="aspect-square bg-[rgba(0,0,0,0.22)] rounded-md"></div>
          <div className="h-[60px] rounded-md shadow-[0_5px_0px_0px_rgb(29,28,26)] bg-blackDark"></div>
        </div>
      ))}
    </div>
  );
}

const MemoDailyGamesLoading = React.memo(DailyGamesLoading);

export default MemoDailyGamesLoading;
