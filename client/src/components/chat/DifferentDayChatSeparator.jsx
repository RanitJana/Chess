/* eslint-disable react/prop-types */
import areDatesSame from "../../utils/DateSame.js";

function DifferentDayChatSeparator({
  previousDate,
  currentDate,
  hasMoreMessages,
}) {
  if (
    !hasMoreMessages ||
    areDatesSame(new Date(previousDate), new Date(currentDate))
  )
    return;

  return (
    <div className="w-full flex items-center justify-center py-4">
      <div className="flex text-[0.7rem] w-fit bg-[rgb(32,44,51)] h-fit px-4 py-1 rounded-lg">
        {(() => {
          const prevDate = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(currentDate));

          const today = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(Date.now()));
          return today == prevDate ? "Today" : prevDate;
        })()}
      </div>
    </div>
  );
}

export default DifferentDayChatSeparator;
