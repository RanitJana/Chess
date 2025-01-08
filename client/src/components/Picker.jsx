function Picker() {
  const reactionEmojis = [
    "👍", // Thumbs Up
    "👎", // Thumbs Down
    "❤️", // Heart
    "😄", // Smiling Face
    "🎉", // Party Popper
    "😢", // Sad Face
    "😂", // Laughing Face
    "😡", // Angry Face
    "🤔", // Thinking Face
    "🙏", // Thank You/Praying
    "🚀", // Rocket
    "👏", // Clapping Hands
    "🥳", // Partying Face
    "🔥", // Fire
    "😍", // Heart Eyes
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
    <div className="bg-[rgb(35,46,52)] shadow-xl w-[20rem] overflow-x-scroll absolute flex top-[-80%] left-0 p-2 rounded-full">
      {reactionEmojis.map((emoji, idx) => (
        <div
          key={idx}
          className="flex items-center justify-center hover:cursor-pointer rounded-full mx-[0.1rem] h-9 w-9 p-2 text-[1.5rem]"
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

export default Picker;
