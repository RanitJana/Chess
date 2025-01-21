/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, memo } from "react";
import Picker from "./Picker.jsx";
import axios from "axios";
import DifferentDayChatSeparator from "./DifferentDayChatSeparator.jsx";

function MentionSection({ mentionText, senderId, userId }) {
  if (!mentionText?._id) return;
  return (
    <div
      className={`${senderId == userId ? "bg-[rgb(2,81,68)]" : "bg-[rgb(17,26,33)]"} mb-1 rounded-md overflow-hidden transition-all`}
    >
      <div className="text-sm py-1 border-l-4 flex-col h-full border-[rgb(7,206,156)] break-words flex items-center justify-center transition-all">
        <div className="flex items-center justify-between w-full px-2 transition-all">
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
  );
}

function SingleChat({
  prevBubble,
  info,
  idx,
  hasMoreMessages,
  scrollChatElementBottom,
  playerInfo,
  allRefs,
  setMentionText,
  setTrueFalseStates,
  setReactionMessageId,
  handleReaction,
}) {
  const userId = playerInfo._id;

  const [openReactionBox, setOpenReactionBox] = useState(false);
  const [reactionLocation, setReactionLocation] = useState({ x: 0, y: 0 });
  const [linkInfo, setLinkInfo] = useState(null);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pickerRef = useRef(null);
  const chatSecRef = useRef(null);
  const mainSectionRef = useRef(null);

  const emojiRegex =
    /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji}\u200D\p{Emoji})$/gu;

  const urlRegex = /\b((https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*\b/g;

  const hanldleMentionText = function () {
    setMentionText(() => ({
      text: info.message,
      _id: info._id,
      owner: info.senderId == userId ? "You" : "Opponent",
    }));

    allRefs.current.textareaRef?.focus();
    scrollChatElementBottom();
  };

  const handleMouseDown = (e) => {
    setDragStart(() => ({
      x: e.clientX || e.touches[0].clientX || 0,
      y: e.clientY || e.touches[0].clientY || 0,
    }));
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentX = e.clientX || e.touches[0].clientX || 0;
    const currentY = e.clientY || e.touches[0].clientY || 0;
    let distanceX = currentX - dragStart.x;
    const distanceY = Math.abs(currentY - dragStart.y);

    if (distanceY > 20) {
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
    // Trigger reply if dragged beyond 50px
    if (dragDistance > 50) {
      if (navigator.vibrate) navigator.vibrate(50);
      hanldleMentionText();
    }
    setDragDistance(0);
  };

  const handleDoubleClick = (e) => {
    setReactionMessageId(() => info._id);
    setOpenReactionBox((prev) => !prev);
    const target = mainSectionRef.current;
    const rect = target.getBoundingClientRect();

    const x =
      (e.clientX || (e.touches && e.touches[0]?.clientX) || 0) - rect.left;
    const y =
      (e.clientY || (e.touches && e.touches[0]?.clientY) || 0) - rect.top;

    setReactionLocation({
      x: Math.max(0, x),
      y: Math.max(0, y),
    });
  };

  useEffect(() => {
    const fetchLinkInfo = async () => {
      try {
        const url = info.message;
        if (url.match(urlRegex)) {
          const response = await axios.get(
            `https://api.linkpreview.net/?key=${import.meta.env.VITE_LINK_PREVIEW_API_KEY}&q=${encodeURIComponent(url)}`
          );
          if (response.data) setLinkInfo(response.data);
        }
      } catch {
        // console.error("Error fetching the URL:", error.message);
      }
    };

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

    fetchLinkInfo();

    const listeners = ["click", "mousedown"];
    listeners.forEach((event) =>
      window.addEventListener(event, handleUnsetReactionMenu)
    );

    return () => {
      listeners.forEach((event) =>
        window.removeEventListener(event, handleUnsetReactionMenu)
      );
    };
  }, []);

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
  }, [isDragging]); // Only re-run when isDragging changes

  return (
    <div
      ref={mainSectionRef}
      className={`relative w-full flex flex-col ${info.senderId === userId ? "items-end" : "items-start"} ${info.reaction?.length ? "mb-7" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <div
        className="bg-[rgb(20,20,18)] p-2 rounded-full absolute top-1/2 left-0"
        style={{
          opacity: `${50 / (150 - dragDistance)}`,
          transform: `translate(${dragDistance - 50}px,-50%)`,
          transition: "transform 0.1s linear",
        }}
      >
        <img src="/images/reply.png" alt="" className="invert w-4" />
      </div>
      {/* all emojis */}
      <Picker
        pickerRef={pickerRef}
        mainSectionRef={mainSectionRef}
        setTrueFalseStates={setTrueFalseStates}
        reactionLocation={reactionLocation}
        openReactionBox={openReactionBox}
        setOpenReactionBox={setOpenReactionBox}
        handleReaction={handleReaction}
        messageId={info._id}
        translate={"translate-x-[-50%] translate-y-[-130%]"}
        position={"left-1/2 top-1/2"}
      />

      {/* different day's message */}
      <DifferentDayChatSeparator
        previousDate={prevBubble?.createdAt || info.createdAt}
        currentDate={info.createdAt}
        hasMoreMessages={hasMoreMessages}
      />

      {/* main chat bubble */}
      <div
        ref={chatSecRef}
        className={`
          relative max-w-[80%] px-1 pt-1 pb-5 rounded-xl break-words text-white min-w-[6.5rem] select-none hover:cursor-pointer 
          ${info.senderId === userId ? "bg-[rgb(0,93,74)]" : "bg-[rgb(32,45,50)]"}
          ${idx === 0 || prevBubble?.senderId != info.senderId ? (info.senderId == userId ? "parentBubbleYou rounded-tr-none" : "parentBubbleOther rounded-tl-none") : ""}
          ${idx > 0 && info.senderId !== prevBubble?.senderId ? "mt-[0.8rem]" : ""}
          `}
        style={{
          transform: `translateX(${dragDistance}px)`,
          transition: "transform 0.1s ease",
        }}
        onDoubleClick={handleDoubleClick}
        onClick={() => setOpenReactionBox(false)}
      >
        {/* text reactions */}
        {info.reaction?.length > 0 && (
          <div
            className={`absolute text-sm bottom-0 translate-y-[80%] bg-[rgb(32,45,50)] rounded-full border border-[rgb(17,27,33)] w-7 min-w-fit min-h-fit flex items-center justify-center text-[1rem] p-[0.2rem] ${info.senderId == userId ? "right-3" : "left-3"}`}
          >
            {info.reaction?.map((val) => val?.symbol)}
            {info.reaction?.length > 1 && (
              <span className="text-gray-400 px-1">
                {info.reaction?.length}
              </span>
            )}
          </div>
        )}

        {/* link detection */}
        {info.message.match(urlRegex) ? (
          <span className="block">
            {linkInfo ? (
              <a href={info.message} target="_blank">
                <MentionSection
                  mentionText={info.mentionText}
                  senderId={info.senderId}
                  userId={userId}
                />
                <div
                  className={`${info.senderId == userId ? "bg-[rgb(2,81,68)]" : "bg-[rgb(28,41,47)]"} overflow-hidden rounded-lg mb-2 w-full max-w-[30rem]`}
                >
                  <img
                    src={linkInfo.image || linkInfo.logo?.url}
                    alt=""
                    className={`${linkInfo.image ? "max-w-[30rem] w-full pointer-events-none" : "max-w-[15rem] p-2"}`}
                  />
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
              <div>
                <MentionSection
                  mentionText={info.mentionText}
                  senderId={info.senderId}
                  userId={userId}
                />
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
              </div>
            )}
          </span>
        ) : (
          <>
            <MentionSection
              mentionText={info.mentionText}
              senderId={info.senderId}
              userId={userId}
            />
            {/* main text */}
            <span
              className={`block px-1 pt-1 ${emojiRegex.test(info.message) ? "text-[3rem]" : ""}`}
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
