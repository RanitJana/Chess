/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { messagePost } from "../api/message.js";
import { toast } from "react-hot-toast";
import { socket } from "../socket.js";
import "./Chat.css";
import { encryptMessage } from "../utils/encryptDecryptMessage.js";
import { useGameContext } from "../pages/Game.jsx";
import EmojiPicker from "emoji-picker-react";
import { useAuthContext } from "../context/AuthContext.jsx";

const EmojiPickerComponent = ({ onEmojiClick }) => (
  <EmojiPicker
    theme="dark"
    autoFocusSearch={false}
    style={{
      position: "absolute",
      bottom: "3.5rem",
      left: "0.5rem",
      height: "25rem",
    }}
    lazyLoadEmojis={true}
    onEmojiClick={onEmojiClick}
  />
);
let draftMessageTimeout = null;
const MemoizedEmojiPicker = React.memo(EmojiPickerComponent);

function ChatInGame({ allMessage, setAllMessage, gameId, chatSectionRef }) {
  const { opponent } = useGameContext();
  const { playerInfo } = useAuthContext();

  const userId = playerInfo._id;

  const [isTyping, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [isEmojiPickerTrue, setIsEmojiPickerTrue] = useState(false);
  const typingRef = useRef(null);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to content
      chatSectionRef.current?.scrollTo(0, chatSectionRef.current.scrollHeight);
    }
  };

  useEffect(() => {
    let allDrafts = JSON.parse(localStorage.getItem("draft-messages")) || {};
    if (allDrafts[gameId]) {
      setText(allDrafts[gameId]);
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!text.trim() || !opponent || !userId) return;

    setIsEmojiPickerTrue(false);
    try {
      let encryptedText = encryptMessage(text.trim());
      let info = {
        senderId: userId,
        message: text.trim(),
        updatedAt: Date.now(),
        createdAt: Date.now(),
      };

      setText(() => "");
      textareaRef.current.value = "";
      adjustHeight();

      socket.emit("new-message", {
        senderId: userId,
        message: encryptedText,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });
      
      setAllMessage((prev) => [...prev, info]);
      chatSectionRef.current?.scrollTo(0 + 20, chatSectionRef.current.scrollHeight);
      await messagePost({
        receiverId: opponent._id,
        gameId,
        content: encryptedText,
      });
      let allDrafts = JSON.parse(localStorage.getItem("draft-messages"));
      if (allDrafts) {
        try {
          delete allDrafts[gameId];
          localStorage.setItem("draft-messages", JSON.stringify(allDrafts));
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to send the message");
    }
  }, [gameId, opponent, text, userId]);

  useEffect(() => {
    chatSectionRef.current?.scrollTo(0, chatSectionRef.current.scrollHeight);
  }, [allMessage]);

  useEffect(() => {
    socket.on("server-typing", (value) => {
      if (userId !== value.userId && gameId === value.gameId) setTyping(true);
    });

    socket.on("server-not-typing", () => {
      setTyping(false);
    });

    return () => {
      socket.off("server-typing");
      socket.off("server-not-typing");
    };
  }, [gameId, userId]);

  const handleEmojiClick = useCallback(
    (emojiObject) => {
      setText((prev) => prev + emojiObject.emoji);
    },
    [setText]
  );

  const handleDraftMessages = function (value) {
    if (draftMessageTimeout) {
      clearTimeout(draftMessageTimeout);
    }

    draftMessageTimeout = setTimeout(() => {
      let allDrafts = JSON.parse(localStorage.getItem("draft-messages")) || {};
      allDrafts[gameId] = value;
      localStorage.setItem("draft-messages", JSON.stringify(allDrafts));
    }, 1000);

    return () => {
      if (draftMessageTimeout) {
        clearTimeout(draftMessageTimeout);
      }
    };
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Chat Messages */}
      {allMessage ? (
        <>
          <div
            className="w-full h-full text-white overflow-y-auto px-4 space-y-1"
            ref={chatSectionRef}
          >
            <div className="flex justify-center mt-2">
              <p className="max-w-[80%] w-full bg-black rounded-lg p-2 text-center text-pretty mb-4 text-[0.8rem]">
                <img
                  src="/images/lock.png"
                  alt=""
                  className="w-3 aspect-square inline mr-1 mt-[-3px]"
                />
                Messages are partially encrypted. No one outside of this chat,
                (except chess2.com), can read them.
              </p>
            </div>
            {allMessage.map((info, idx) => (
              <div
                key={idx}
                className={`flex mb-2 ${info.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[80%] px-3 pt-1 pb-5 rounded-lg shadow-md break-words text-white min-w-[6.5rem] ${info.senderId === userId
                      ? "bg-[rgb(0,93,74)]"
                      : "bg-[rgb(32,44,51)]"
                    }
                    ${idx > 0
                      ? allMessage[idx - 1].senderId != info.senderId
                        ? info.senderId == userId
                          ? "parentBubbleYou rounded-tr-none"
                          : "parentBubbleOther rounded-tl-none"
                        : ""
                      : info.senderId == userId
                        ? "parentBubbleYou rounded-tr-none"
                        : "parentBubbleOther rounded-tl-none"
                    }
                    `}
                >
                  <span className="block">{info.message}</span>
                  <span className="absolute bottom-1 right-2 text-xs text-gray-300">
                    {new Date(info.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            ))}

            <div
              className="bg-[rgb(32,44,51)] w-fit px-[15px] rounded-lg rounded-tl-none overflow-hidden transition-all"
              style={{
                height: `${!isTyping ? "0px" : "30px"}`,
                padding: `${!isTyping ? "0" : "0.5rem"}`,
              }}
            >
              <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="w-full relative flex gap-2 items-end p-2">
            <div className="w-full relative flex items-end bg-[rgb(42,56,67)] p-1 text-white outline-none rounded-3xl">
              <div className="w-10 h-full hover:cursor-pointer p-1">
                <img
                  src="/images/smile.png"
                  alt="E"
                  onClick={() => setIsEmojiPickerTrue((prev) => !prev)}
                />
              </div>
              {isEmojiPickerTrue && (
                <MemoizedEmojiPicker onEmojiClick={handleEmojiClick} />
              )}
              <textarea
                ref={textareaRef}
                type="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  adjustHeight();
                  handleDraftMessages(e.target.value);
                }}
                rows={1}
                className="w-full resize-none bg-transparent p-2 pl-1 px-4 text-white outline-none rounded-3xl rounded-bl-none rounded-tl-none"
                placeholder="Send a message..."
                onKeyDown={(e) => {
                  if (typingRef.current) clearTimeout(typingRef.current);
                  if (e.key === "Enter") {
                    e.preventDefault();
                    socket.emit("not-typing", userId);
                    handleSendMessage();
                  } else {
                    socket.emit("typing", { userId, gameId });
                  }
                }}
                onKeyUp={() => {
                  typingRef.current = setTimeout(() => {
                    socket.emit("not-typing", userId);
                  }, 1500);
                }}
                onFocus={() => setIsEmojiPickerTrue(false)}
              />
            </div>
            <button
              className="h-[3rem] flex justify-center items-center text-white border rounded-[50%] aspect-square bg-slate-100"
              onClick={handleSendMessage}
            >
              <img src="/images/send.png" alt="" className="w-6 max-h-6" />
            </button>
          </div>
        </>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default ChatInGame;
