import { useEffect } from "react";

/* eslint-disable react/prop-types */
function Picker({
  mainSectionRef,
  pickerRef,
  translate,
  handleReaction,
  messageId,
  openReactionBox,
  setOpenReactionBox,
  reactionLocation,
  setTrueFalseStates,
}) {
  const reactionEmojis = ["❤️", "😂", "😮", "😢", "😡", "👍"];

  useEffect(() => {
    const picker = pickerRef.current;
    const mainSection = mainSectionRef.current;
    const { top, height } = mainSection.getBoundingClientRect();
    if (picker && mainSection) {
      // Get picker dimensions
      const pickerWidth = picker.offsetWidth;
      const pickerHeight = picker.offsetHeight;

      // Get viewport dimensions
      const viewportWidth = mainSection.clientWidth;
      const viewportHeight = top + height;

      // Calculate adjusted position
      let adjustedX = reactionLocation.x;
      let adjustedY = reactionLocation.y;

      // Prevent picker from overflowing on the right
      if (adjustedX + pickerWidth / 2 >= viewportWidth) {
        adjustedX = viewportWidth - pickerWidth / 2; // Add padding
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
  }, [reactionLocation, pickerRef, mainSectionRef]);

  return (
    <div
      ref={pickerRef}
      className={`bg-[rgb(35,46,52)] shadow-xl absolute flex z-[100] p-2 rounded-full ${
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
            setOpenReactionBox(false);
            handleReaction(messageId, emoji);
          }}
          className="flex items-center justify-center hover:cursor-pointer rounded-full mx-[0.1rem] h-9 w-9 p-2 text-[1.5rem]"
        >
          {emoji}
        </div>
      ))}
      <div
        className="bg-gray-600 active:bg-gray-700 transition-colors flex items-center justify-center hover:cursor-pointer rounded-full mx-[0.1rem] h-9 aspect-square p-2 text-[1.5rem]"
        onClick={() => {
          setOpenReactionBox(false);
          setTrueFalseStates((prev) => ({ ...prev, isOpenReactionMore: true }));
        }}
      >
        <img
          src="/images/cross.png"
          alt=""
          className="rotate-45 w-6 brightness-0 invert select-none"
        />
      </div>
    </div>
  );
}

export default Picker;
