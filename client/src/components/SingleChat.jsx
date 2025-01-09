/* eslint-disable react/prop-types */
import { socket } from "../socket.js";
import { messageReaction } from "../api/message.js";
import Picker from "./Picker.jsx";
import { useEffect, useRef, useState } from "react";

function areDatesSame(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() && // Note: getMonth() returns 0 for January, 1 for February, etc.
    date1.getFullYear() === date2.getFullYear()
  );
}

function SingleChat({ allMessage = [], info, idx, userId, setAllMessage }) {
  const [openReactionBox, setOpenReactionBox] = useState(false);
  const emojiRegex =
    /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji}\u200D\p{Emoji})$/gu;

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

  const singleChatRef = useRef(null);
  useEffect(() => {
    const handleUnsetReactionMenu = (e) => {
      // Correct the typo in "e.target" and ensure the check uses `.contains`
      if (singleChatRef.current && !singleChatRef.current.contains(e.target)) {
        setOpenReactionBox(false); // Ensure `setOpenReactionBox` is properly defined
      }
    };

    // Add the event listener
    window.addEventListener("click", handleUnsetReactionMenu);

    return () => {
      // Correct the typo in `removeEventListener`
      window.removeEventListener("click", handleUnsetReactionMenu);
    };
  }, []);

  let holdTimeout;

  const handleMouseDown = () => {
    holdTimeout = setTimeout(() => {
      setOpenReactionBox(true);
    }, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(holdTimeout); // Clear timeout if released early
  };

  const handleMouseLeave = () => {
    clearTimeout(holdTimeout); // Clear timeout if the mouse leaves the element
  };

  return (
    <div
      className={`
                  flex flex-col transition-all ${info.senderId === userId ? "items-end" : "items-start"}
                  ${info.reaction?.length ? "mb-7" : ""}
                `}
    >
      {!areDatesSame(
        new Date(allMessage[idx - 1 >= 0 ? idx - 1 : 0].createdAt),
        new Date(info.createdAt)
      ) || idx === 0 ? (
        <div className="w-full flex items-center justify-center mb-1">
          <div className="flex text-sm w-fit bg-[rgb(32,44,51)] h-fit px-4 py-1 rounded-lg">
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(info.createdAt))}
          </div>
        </div>
      ) : (
        ""
      )}
      <div
        ref={singleChatRef}
        className={`relative max-w-[80%] px-3 pt-1 pb-5 rounded-xl shadow-md break-words text-white min-w-[6.5rem] select-none hover:cursor-pointer ${
          info.senderId === userId ? "bg-[rgb(0,93,74)]" : "bg-[rgb(32,44,51)]"
        }
                    ${
                      idx === 0 ||
                      allMessage[idx - 1 >= 0 ? idx - 1 : 0].senderId !=
                        info.senderId
                        ? info.senderId == userId
                          ? "parentBubbleYou rounded-tr-none"
                          : "parentBubbleOther rounded-tl-none"
                        : ""
                    }
                    ${
                      idx > 0 && info.senderId !== allMessage[idx - 1].senderId
                        ? "mt-[0.8rem]"
                        : ""
                    }
                    `}
        onDoubleClick={() => setOpenReactionBox((prev) => !prev)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* reactions */}
        <Picker
          openReactionBox={openReactionBox}
          handleReaction={handleReaction}
          messageId={info._id}
          position={info.senderId === userId ? "right-0" : "left-0"}
        />
        {info.reaction?.length > 0 && (
          <div
            className={`absolute text-sm bottom-0 translate-y-[80%] bg-[rgb(32,45,50)] rounded-full border border-[rgb(17,27,33)] w-7 min-w-fit min-h-fit flex items-center justify-center text-[1rem] p-[0.2rem] ${info.senderId == userId ? "right-3" : "left-3"}`}
          >
            {info?.reaction?.map((val) => val?.symbol)}
          </div>
        )}
        <span
          className="block"
          style={{
            fontSize: emojiRegex.test(info.message) ? "2.5rem" : "",
          }}
        >
          {info.message}
        </span>
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

export default SingleChat;
