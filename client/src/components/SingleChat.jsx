/* eslint-disable no-unused-vars */
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

function MentionSection({ mentionText, senderId, userId }) {
  return (
    <>
      {mentionText?._id && (
        <div
          className={`${senderId == userId ? "bg-[rgb(2,81,68)]" : "bg-[rgb(17,26,33)]"} mb-1 rounded-md overflow-hidden transition-all`}
        >
          <div className="text-sm border-l-4 flex-col h-full border-[rgb(7,206,156)] break-words flex items-center justify-center transition-all">
            <div className="flex items-center justify-between w-full px-2 pt-1 transition-all">
              <span className="text-[rgb(13,160,157)] font-bold">
                {mentionText.owner == userId ? "You" : "Opponent"}
              </span>
            </div>

            <span
              className={`px-2 pb-1 w-[99%] text-[rgb(174,174,174)] line-clamp-3 transition-all mb-[-1px]`}
            >
              {mentionText.text}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

function SingleChat({
  allMessage = [],
  info,
  idx,
  userId,
  setAllMessage,
  allRefs,
  setMentionText,
}) {

  const [openReactionBox, setOpenReactionBox] = useState(false);

  const [linkInfo, setLinkInfo] = useState(null);

  const [dragStart, setDragStart] = useState({
    x: 0, y: 0
  });
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pickerRef = useRef(null);
  const chatSecRef = useRef(null);

  let holdTimeout;
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

  const hanldleMentionText = function () {
    setMentionText(() => ({
      text: info.message,
      _id: info._id,
      owner: info.senderId == userId ? "You" : "Opponent",
    }));

    allRefs.current.textareaRef?.focus();
  };

  const handleMouseDown = (e) => {
    setDragStart(() => ({
      x: e.clientX || e.touches[0].clientX || 0,
      y: e.clientY || e.touches[0].clientY || 0
    }));
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentX = e.clientX || e.touches[0].clientX || 0;
    const currentY = e.clientY || e.touches[0].clientY || 0;
    let distanceX = currentX - dragStart.x;
    const distanceY = currentY - dragStart.y;

    if (distanceY > distanceX) {
      setIsDragging(false);
      setDragDistance(0);
      return;
    }

    // Prevent dragging to the left
    if (distanceX < 0) distanceX = 0;

    // Apply dampening factor to make it slower as distanceX increases
    const dampeningFactor = 1 / (1 + distanceX / 180); // Adjust divisor (50) for sensitivity
    distanceX *= dampeningFactor;

    setDragDistance(distanceX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Trigger reply if dragged beyond 45px
    if (dragDistance > 50) {
      if (navigator.vibrate) navigator.vibrate(50);
      hanldleMentionText();
    }

    // Reset drag distance
    setDragDistance(0);
  };

  //remove reaction list
  useEffect(() => {
    const handleUnsetReactionMenu = (e) => {
      if (
        chatSecRef.current &&
        !chatSecRef.current.contains(e.target) &&
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {
        setOpenReactionBox(false);
      }
    };

    const listeners = ["click", "mousedown"];
    listeners.forEach((event) => window.addEventListener(event, handleUnsetReactionMenu));

    return () => {
      listeners.forEach((event) => window.removeEventListener(event, handleUnsetReactionMenu));
    };
  }, []);

  //fetch info if only message is link
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
        // console.error("Error fetching the URL:", error.message);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  // Add and remove global event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]); // Only re-run when isDragging changes

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
  }, [holdTimeout, allRefs]);

  return (
    <div className={`relative flex flex-col transition-all ${info.senderId === userId ? "items-end" : "items-start"} ${info.reaction?.length ? "mb-7" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}

      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* all emojis */}
      <Picker
        pickerRef={pickerRef}
        openReactionBox={openReactionBox}
        handleReaction={handleReaction}
        messageId={info._id}
        translate={"translate-x-[-50%] translate-y-[-130%]"}
        position={"left-1/2 top-1/2"}
      />

      {/* different day's message */}
      {!areDatesSame(new Date(allMessage[idx - 1 >= 0 ? idx - 1 : 0].createdAt), new Date(info.createdAt)) || idx === 0 ? (
        <div className="w-full flex items-center justify-center mb-1">
          <div className="flex text-[0.7rem] w-fit bg-[rgb(32,44,51)] h-fit px-4 py-1 rounded-lg">
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
      ) : ("")}

      {/* main chat bubble */}
      <div ref={chatSecRef}
        className={`
          relative max-w-[80%] px-1 pt-1 pb-5 rounded-xl break-words text-white min-w-[6.5rem] select-none hover:cursor-pointer 
          ${info.senderId === userId ? "bg-[rgb(0,93,74)]" : "bg-[rgb(32,45,50)]"}
          ${(idx === 0 || allMessage[idx - 1 >= 0 ? idx - 1 : 0].senderId != info.senderId) ? info.senderId == userId ? "parentBubbleYou rounded-tr-none" : "parentBubbleOther rounded-tl-none" : ""}
          ${idx > 0 && info.senderId !== allMessage[idx - 1].senderId ? "mt-[0.8rem]" : ""}
          `}
        style={{
          transform: `translateX(${dragDistance}px)`,
          transition: !isDragging ? "transform 0.5s ease" : "none",
        }}
        onDoubleClick={() => setOpenReactionBox((prev) => !prev)}
        onClick={() => setOpenReactionBox(false)}
      >
        {/* reactions */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpenReactionBox((prev) => !prev);
          }}
          className={`absolute flex items-center justify-center top-1/2 bg-[rgb(17,25,29)] p-[0.1rem] rounded-full ${info.senderId == userId ? "left-0 translate-x-[-120%]" : "right-0 translate-x-[120%]"} translate-y-[-50%]`}
        >
          <img
            src="/images/smile-reaction.png"
            className="brightness-[20%] invert w-4"
            alt="😊"
            decoding="async"
          />
        </div>

        {/* text reactions */}
        {info.reaction?.length > 0 && (
          <div
            className={`absolute text-sm bottom-0 translate-y-[80%] bg-[rgb(32,45,50)] rounded-full border border-[rgb(17,27,33)] w-7 min-w-fit min-h-fit flex items-center justify-center text-[1rem] p-[0.2rem] ${info.senderId == userId ? "right-3" : "left-3"}`}
          >
            {info.reaction?.map((val) => val?.symbol)}
          </div>
        )}

        {/* link detection */}
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
              <span className="px-1 pt-1">
                {info.message.split(" ").map((text, idx) => {
                  if (text.match(urlRegex))
                    return (
                      <a
                        href={text}
                        key={idx}
                        target="_blank"
                        className="text-blue-400 px-1 pt-1 underline"
                      >
                        {text}
                      </a>
                    );
                  return <span key={idx}>{text}</span>;
                })}
              </span>
            )}
          </span>
        ) : (
          <>
            <MentionSection mentionText={info.mentionText} senderId={info.senderId} userId={userId} />
            {/* main text */}
            <span
              className={`block px-1 pt-1 ${emojiRegex.test(info.message) ? "text-[2.5rem]" : ""}`}
            >
              {info.message}
            </span>
          </>
        )}

        {/* message sent time */}
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
