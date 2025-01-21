/* eslint-disable react/prop-types */

function Typing({ isTyping = false }) {
  return (
    <div
      className={`bg-[rgb(32,44,51)] ${isTyping ? "p-2 h-[35px]" : "h-0"} flex items-center justify-center w-fit px-[15px] rounded-xl rounded-tl-none overflow-hidden transition-[height_0.3s_linear]`}
    >
      {isTyping && (
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
    </div>
  );
}

export default Typing;
