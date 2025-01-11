/* eslint-disable react/prop-types */
import { socket } from "../socket.js";
import { messageReaction } from "../api/message.js";
import Picker from "./Picker.jsx";
import { useEffect, useRef, useState, memo } from "react";
import axios from "axios";

function areDatesSame(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() && // Note: getMonth() returns 0 for January, 1 for February, etc.
    date1.getFullYear() === date2.getFullYear()
  );
}

function SingleChat({
  allMessage = [],
  info,
  idx,
  userId,
  setAllMessage,
  allRefs,
}) {
  const [openReactionBox, setOpenReactionBox] = useState(false);
  const [linkInfo, setLinkInfo] = useState(null);
  const emojiRegex =
    /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji}\u200D\p{Emoji})$/gu;
  const urlRegex = /\b((https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*\b/g;

  const handleReaction = async (messageId, reaction) => {
    try {
      setOpenReactionBox(false);
      const response = await messageReaction(messageId, { reaction });
      if (response.data) {
        const { success, reaction } = response.data;
        if (success) {
          setAllMessage((prev) =>
            prev.map((val) => {
              if (val._id != messageId) return val;
              return { ...val, reaction };
            })
          );
          socket.emit("chat-reaction", {
            senderId: userId,
            messageId,
            reaction,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickerRef = useRef(null);
  const chatSecRef = useRef(null);
  useEffect(() => {
    const handleUnsetReactionMenu = (e) => {
      // Correct the typo in "e.target" and ensure the check uses `.contains`
      if (chatSecRef.current && !chatSecRef.current.contains(e.target)) {
        setOpenReactionBox(false); // Ensure `setOpenReactionBox` is properly defined
      }
    };

    // Add the event listener
    window.addEventListener("click", handleUnsetReactionMenu);
    window.addEventListener("mousedown", handleUnsetReactionMenu);
    window.addEventListener("mouseup", handleUnsetReactionMenu);
    window.addEventListener("touchstart", handleUnsetReactionMenu);
    window.addEventListener("touchend", handleUnsetReactionMenu);

    return () => {
      // Correct the typo in `removeEventListener`
      window.removeEventListener("click", handleUnsetReactionMenu);
      window.removeEventListener("mousedown", handleUnsetReactionMenu);
      window.removeEventListener("mouseup", handleUnsetReactionMenu);
      window.removeEventListener("touchstart", handleUnsetReactionMenu);
      window.removeEventListener("touchend", handleUnsetReactionMenu);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const url = info.message;
        if (url.match(urlRegex)) {
          const response = await axios.get(
            `https://api.microlink.io/?url=${url}`
          );
          if (response.data) setLinkInfo(response.data.data);
          // console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching the URL:", error.message);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  let holdTimeout;

  const handleMouseDown = () => {
    holdTimeout = setTimeout(() => {
      setOpenReactionBox(true);
      if (navigator.vibrate) navigator.vibrate(60);
    }, 800);
  };

  const handleMouseUp = () => {
    clearTimeout(holdTimeout); // Clear timeout if released early
  };

  const handleMouseLeave = () => {
    clearTimeout(holdTimeout); // Clear timeout if the mouse leaves the element
  };

  useEffect(() => {
    const element = allRefs.current.chatSectionRef;
    if (element) {
      const handleScroll = () => {
        clearTimeout(holdTimeout);
        setOpenReactionBox(false);
      };
      const handleScrollEnd = () => {
        clearTimeout(holdTimeout);
      };
      // Add scroll event listener
      element.addEventListener("scrollend", handleScrollEnd);
      element.addEventListener("scroll", handleScroll);

      // Cleanup on unmount
      return () => {
        element.removeEventListener("scroll", handleScroll);
        element.removeEventListener("scrollend", handleScrollEnd);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdTimeout, allRefs]);

  return (
    <div
      className={`
                  relative
                  flex flex-col transition-all ${info.senderId === userId ? "items-end" : "items-start"}
                  ${info.reaction?.length ? "mb-7" : ""}
                `}
    >
      <Picker
        pickerRef={pickerRef}
        openReactionBox={openReactionBox}
        handleReaction={handleReaction}
        messageId={info._id}
        translate={"translate-x-[-50%] translate-y-[-50%]"}
        position={"left-1/2 top-1/2"}
      />
      {!areDatesSame(
        new Date(allMessage[idx - 1 >= 0 ? idx - 1 : 0].createdAt),
        new Date(info.createdAt)
      ) || idx === 0 ? (
        <div className="w-full flex items-center justify-center mb-1">
          <div className="flex text-sm w-fit bg-[rgb(32,44,51)] h-fit px-4 py-1 rounded-lg">
            {(() => {
              const prevDate = new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(info.createdAt));

              const today = new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(Date.now()));

              return today == prevDate ? "Today" : prevDate;
            })()}
          </div>
        </div>
      ) : (
        ""
      )}
      <div
        ref={chatSecRef}
        className={`
          relative max-w-[80%] px-1 pt-1 pb-5 rounded-xl shadow-md break-words text-white min-w-[6.5rem] select-none hover:cursor-pointer 
          ${info.senderId === userId ? "bg-[rgb(0,93,74)]" : "bg-[rgb(32,45,50)]"}
          ${
            idx === 0 ||
            allMessage[idx - 1 >= 0 ? idx - 1 : 0].senderId != info.senderId
              ? info.senderId == userId
                ? "parentBubbleYou rounded-tr-none"
                : "parentBubbleOther rounded-tl-none"
              : ""
          }
          ${idx > 0 && info.senderId !== allMessage[idx - 1].senderId ? "mt-[0.8rem]" : ""}
          `}
        onDoubleClick={() => setOpenReactionBox((prev) => !prev)}
        onClick={() => setOpenReactionBox(false)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* reactions */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpenReactionBox((prev) => !prev);
          }}
          className={`absolute flex items-center justify-center top-1/2 ${info.senderId == userId ? "left-0 translate-x-[-120%]" : "right-0 translate-x-[120%]"} translate-y-[-50%] bg-[rgb(17,25,29)] rounded-full w-7 h-7`}
        >
          <img
            src="/images/smile-reaction.png"
            className="brightness-[20%] invert w-5"
            alt=""
          />
        </div>
        {info.reaction?.length > 0 && (
          <div
            className={`absolute text-sm bottom-0 translate-y-[80%] bg-[rgb(32,45,50)] rounded-full border border-[rgb(17,27,33)] w-7 min-w-fit min-h-fit flex items-center justify-center text-[1rem] p-[0.2rem] ${info.senderId == userId ? "right-3" : "left-3"}`}
          >
            {info?.reaction?.map((val) => val?.symbol)}
          </div>
        )}
        {info.message.match(urlRegex) ? (
          <span className="block">
            {linkInfo ? (
              <a href={info.message} target="_blank">
                <div
                  className={`${info.senderId == userId ? "bg-[rgb(2,81,68)]" : "bg-[rgb(28,41,47)]"} overflow-hidden rounded-lg mb-2 w-full max-w-[30rem]`}
                >
                  <div>
                    {linkInfo.image ? (
                      <img
                        className="max-w-[30rem] w-full pointer-events-none"
                        src={linkInfo.image.url}
                        alt=""
                      />
                    ) : (
                      <img
                        className="max-w-[15rem] p-2"
                        src={linkInfo.logo.url}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="p-2">
                    <div>{linkInfo.title || "Unknown"}</div>
                    <div className="truncate line-clamp-2 text-wrap text-xs text-gray-400">
                      {linkInfo.description}
                    </div>
                    <div className="text-sm pt-2">{linkInfo.publisher}</div>
                  </div>
                </div>
                <span className="text-blue-400 px-1 pt-1 underline text-sm">
                  {linkInfo.url}
                </span>
              </a>
            ) : (
              <span className="text-blue-400 px-1 pt-1 underline">
                {info.message}
              </span>
            )}
          </span>
        ) : (
          <span
            className={`block px-1 pt-1 ${emojiRegex.test(info.message) ? "text-[2.5rem]" : ""}`}
          >
            {info.message}
          </span>
        )}
        <span className="absolute bottom-1 right-2 text-xs text-gray-300">
          {new Date(info.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </span>
      </div>
    </div>
  );
}

export default memo(SingleChat, (prevProps, nextProps) => {
  return (
    prevProps.info === nextProps.info && prevProps.userId === nextProps.userId
  );
});
