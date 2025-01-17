/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
      )}
    </>
  );
}

function SingleChat({
  allMessage = [],
  info,
  idx,
  userId,
  handleReaction,
  allRefs,
  setMentionText,
  setIsOpenReactionMore,
  setReactionMessageId,
}) {
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
    listeners.forEach((event) =>
      window.addEventListener(event, handleUnsetReactionMenu)
    );

    return () => {
      listeners.forEach((event) =>
        window.removeEventListener(event, handleUnsetReactionMenu)
      );
    };
  }, []);

  //fetch info if only message is link
  useEffect(() => {
    // https://api.microlink.io/?url=
    (async () => {
      try {
        const url = info.message;
        if (url.match(urlRegex)) {
          const response = await axios.get(
            `https://api.linkpreview.net/?key=${import.meta.env.VITE_LINK_PREVIEW_API_KEY}&q=${encodeURIComponent(url)}`
          );
          console.log(response);

          if (response.data) setLinkInfo(response.data);
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

  return (
    <div
      ref={mainSectionRef}
      className={`relative w-full flex flex-col transition-all ${info.senderId === userId ? "items-end" : "items-start"} ${info.reaction?.length ? "mb-7" : ""}`}
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
        <img
          src="/images/reply.png"
          alt=""
          decoding="sync"
          className="invert w-4"
        />
      </div>
      {/* all emojis */}
      <Picker
        pickerRef={pickerRef}
        mainSectionRef={mainSectionRef}
        setIsOpenReactionMore={setIsOpenReactionMore}
        reactionLocation={reactionLocation}
        openReactionBox={openReactionBox}
        setOpenReactionBox={setOpenReactionBox}
        handleReaction={handleReaction}
        messageId={info._id}
        translate={"translate-x-[-50%] translate-y-[-130%]"}
        position={"left-1/2 top-1/2"}
      />

      {/* different day's message */}
      {!areDatesSame(
        new Date(allMessage[idx - 1 >= 0 ? idx - 1 : 0].createdAt),
        new Date(info.createdAt)
      ) || idx === 0 ? (
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
      ) : (
        ""
      )}

      {/* main chat bubble */}
      <div
        ref={chatSecRef}
        className={`
          relative max-w-[80%] px-1 pt-1 pb-5 rounded-xl break-words text-white min-w-[6.5rem] select-none hover:cursor-pointer 
          ${info.senderId === userId ? "bg-[rgb(0,93,74)]" : "bg-[rgb(32,45,50)]"}
          ${idx === 0 || allMessage[idx - 1 >= 0 ? idx - 1 : 0].senderId != info.senderId ? (info.senderId == userId ? "parentBubbleYou rounded-tr-none" : "parentBubbleOther rounded-tl-none") : ""}
          ${idx > 0 && info.senderId !== allMessage[idx - 1].senderId ? "mt-[0.8rem]" : ""}
          `}
        style={{
          transform: `translateX(${dragDistance}px)`,
          transition: "transform 0.1s ease-out",
        }}
        onDoubleClick={(e) => {
          setReactionMessageId(() => info._id);
          setOpenReactionBox((prev) => !prev);
          const target = mainSectionRef.current;
          const rect = target.getBoundingClientRect();

          const x =
            (e.clientX || (e.touches && e.touches[0]?.clientX) || 0) -
            rect.left;
          const y =
            (e.clientY || (e.touches && e.touches[0]?.clientY) || 0) - rect.top;

          setReactionLocation({
            x: Math.max(0, x),
            y: Math.max(0, y),
          });
        }}
        onClick={(e) => setOpenReactionBox(false)}
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
                  <div>
                    {linkInfo.image ? (
                      <img
                        className="max-w-[30rem] w-full pointer-events-none"
                        src={linkInfo.image}
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
