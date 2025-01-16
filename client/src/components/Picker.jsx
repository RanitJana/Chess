import { useEffect } from "react";

/* eslint-disable react/prop-types */
function Picker({
  pickerRef,
  translate,
  handleReaction,
  messageId,
  openReactionBox,
  reactionLocation,
}) {
  const reactionEmojis = [
    "👍",
    "❤️",
    "😂",
    "😮",
    "😢",
    "🙏",
    "👎",
    "😍",
    "🥰",
    "😄",
    "🎉",
    "😡",
    "🤔",
    "🚀",
    "👏",
    "🥳",
    "🔥",
    "😱",
    "💯",
    "✨",
    "👀",
    "🤩",
    "😊",
    "🙌",
    "🌟",
    "😞",
    "💔",
    "🤷",
    "😐",
    "🤨",
  ];

  useEffect(() => {
    const picker = pickerRef.current;
    if (picker) {
      // Get picker dimensions
      const pickerWidth = picker.offsetWidth;
      const pickerHeight = picker.offsetHeight;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate adjusted position
      let adjustedX = reactionLocation.x;
      let adjustedY = reactionLocation.y;

      // Prevent picker from overflowing on the right
      if (adjustedX + pickerWidth / 2 + 20 >= viewportWidth) {
        adjustedX = viewportWidth - pickerWidth / 2 - 20; // Add padding
      }

      if (adjustedX - pickerWidth / 2 < 0) {
        adjustedX = pickerWidth / 2 - 10;
      }

      // Check space below and above the reaction
      const spaceBelow = viewportHeight - reactionLocation.y;
      if (spaceBelow < pickerHeight + 10) {
        // Not enough space below, move above
        adjustedY = reactionLocation.y - pickerHeight - 10;
      } else {
        // Enough space below, position normally
        adjustedY = reactionLocation.y + 10;
      }

      // Apply adjusted position
      picker.style.left = `${adjustedX}px`;
      picker.style.top = `${adjustedY}px`;
    }
  }, [reactionLocation, pickerRef]);

  return (
    <div
      ref={pickerRef}
      className={`bg-[rgb(35,46,52)] shadow-xl overflow-x-scroll absolute flex z-[100] w-[15.5rem] p-2 rounded-full ${
        translate
      } ${openReactionBox ? "opacity-100 scale-100" : "opacity-0 scale-0"} translate-y-[-10%]`}
      style={{
        transition: "all 0.2s ease-in",
      }}
    >
      {reactionEmojis.map((emoji, idx) => (
        <div
          key={idx}
          onClick={() => {
            handleReaction(messageId, emoji);
          }}
          className="flex items-center justify-center hover:cursor-pointer rounded-full mx-[0.1rem] h-9 w-9 p-2 text-[1.5rem]"
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

export default Picker;
