/* eslint-disable react/prop-types */
function Picker({
  pickerRef,
  position,
  translate,
  handleReaction,
  messageId,
  openReactionBox,
}) {
  const reactionEmojis = [
    "👍", // Thumbs Up
    "❤️", // Heart
    "😂", // Laughing Face
    "😮",
    "😢", // Sad Face
    "🙏", // Thank You/Praying
    "👎", // Thumbs Down
    "😍",
    "🥰",
    "😄", // Smiling Face
    "🎉", // Party Popper
    "😡", // Angry Face
    "🤔", // Thinking Face
    "🚀", // Rocket
    "👏", // Clapping Hands
    "🥳", // Partying Face
    "🔥", // Fire
    "😱", // Screaming Face
    "💯", // 100
    "✨", // Sparkles
    "👀", // Eyes
    "🤩", // Star-Struck
    "😊", // Happy Face
    "🙌", // Raised Hands
    "🌟", // Star
    "😞", // Disappointed Face
    "💔", // Broken Heart
    "🤷", // Shrug
    "😐", // Neutral Face
    "🤨", // Raised Eyebrow
  ];

  return (
    <div
      ref={pickerRef}
      className={`bg-[rgb(35,46,52)] shadow-xl overflow-x-scroll absolute flex top-1/2 translate-y-[-130%] z-[100] w-[15.5rem] p-2 rounded-full ${translate} ${position} ${openReactionBox ? " scale-100 opacity-100" : " scale-0 opacity-0"}`}
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
