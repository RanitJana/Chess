/* eslint-disable react/prop-types */
import { useCallback } from "react";

function ScrollToBottom({ chatSectionRef, isChatSectionBottom }) {
  const handleScrollToBottom = useCallback(
    (e) => {
      e.preventDefault();
      if (!chatSectionRef) return;
      chatSectionRef.scrollTo({
        top: chatSectionRef.scrollHeight,
        behavior: "instant",
      });
    },
    [chatSectionRef]
  );

  return (
    <div
      onClick={handleScrollToBottom}
      className="absolute hover:cursor-pointer active:bg-blackDarkest transition-all right-[0.5rem] rotate-180 rounded-full p-2 z-50 bg-[rgb(32,45,50)] top-[-3.5rem]"
      style={{
        scale: isChatSectionBottom ? "0" : "1",
      }}
    >
      <img src="/images/double.png" alt="" className="w-5" />
    </div>
  );
}

export default ScrollToBottom;
