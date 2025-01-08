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
import { messageGet } from "../api/message.js";
import { useParams } from "react-router";
import { decryptMessage } from "../utils/encryptDecryptMessage.js";
import SingleChat from "./SingleChat.jsx";

const EmojiPickerComponent = ({ onEmojiClick }) => (
  <EmojiPicker
    theme="dark"
    autoFocusSearch={false}
    style={{
      position: "absolute",
      bottom: "3.5rem",
      left: "0.5rem",
      height: "25rem",
      width: "18rem",
    }}
    lazyLoadEmojis={true}
    onEmojiClick={onEmojiClick}
  />
);

let draftMessageTimeout = null;
const MemoizedEmojiPicker = React.memo(EmojiPickerComponent);

function ChatInGame() {
  const { gameId } = useParams();
  const { opponent } = useGameContext();
  const { playerInfo } = useAuthContext();
  const userId = playerInfo._id;

  const [allMessage, setAllMessage] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isTyping, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isEmojiPickerTrue, setIsEmojiPickerTrue] = useState(false);
  const previousScrollHeight = useRef(null);
  const typingRef = useRef(null);
  const textareaRef = useRef(null);
  const chatSectionRef = useRef(null);
  const textAreaFocus = useRef(null);

  const loadMessages = async () => {
    try {
      let response = await messageGet(gameId, allMessage?.length || 0);

      if (response) {
        const { success, info, hasMore } = response.data;
        setHasMoreMessages(hasMore);
        if (success) {
          if (allMessage)
            setAllMessage((prev) => {
              return [
                ...info.map((value) => ({
                  _id: value._id,
                  senderId: value.senderId,
                  message: decryptMessage(value.content),
                  createdAt: value.createdAt,
                  updatedAt: value.updatedAt,
                  reaction: value.reaction,
                })),
                ...prev,
              ];
            });
          else
            setAllMessage(() => {
              return info.map((value) => ({
                _id: value._id,
                senderId: value.senderId,
                message: decryptMessage(value.content),
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
                reaction: value.reaction,
              }));
            });
        } else setAllMessage([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try to refresh the page");
    }
  };

  const scrollChatElementBottom = function () {
    const chatSectionRefCurrent = chatSectionRef.current;

    if (chatSectionRefCurrent) {
      const isAtBottom =
        Math.abs(
          chatSectionRefCurrent.scrollHeight -
          chatSectionRefCurrent.scrollTop -
          chatSectionRefCurrent.clientHeight
        ) < 200;

      if (isAtBottom) {
        setTimeout(() => {
          chatSectionRefCurrent.scrollTo({
            top: chatSectionRefCurrent.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to content
    }
  };

  const handleScroll = () => {
    const container = chatSectionRef.current;
    if (!container) return;

    if (container.scrollTop <= 0 && hasMoreMessages && allMessage) {
      loadMessages();
    }
  };

  useEffect(() => {
    if (!allMessage) return;

    const container = chatSectionRef.current;
    if (!container) return;

    const newScrollHeight = container.scrollHeight;

    // Handle initial load separately
    if (initialLoad) {
      container.scrollTo(0, newScrollHeight);
      setInitialLoad(false);
      previousScrollHeight.current = newScrollHeight;
      return;
    }

    // Handle subsequent updates (e.g., new messages)
    if (previousScrollHeight.current != null) {
      if (newScrollHeight !== previousScrollHeight.current) {
        // Only adjust scroll for new content
        container.scrollTop += newScrollHeight - previousScrollHeight.current;
      }
    }

    previousScrollHeight.current = newScrollHeight;
  }, [allMessage]);

  useEffect(() => {
    const handleReceiveMessage = (info) => {
      const { senderId, message, _id } = info;
      setAllMessage((prev) => [
        ...prev,
        {
          _id,
          reaction: [],
          senderId,
          message: decryptMessage(message),
          updatedAt: Date.now(),
          createdAt: Date.now(),
        },
      ]);
      scrollChatElementBottom();
    };

    function handleNewReaction(info) {
      setAllMessage((prev) =>
        prev.map((val) => {
          if (val._id != info.messageId) return val;
          return { ...val, reaction: info.reaction };
        })
      );
    }

    // Register socket event listener
    socket.on("receive-new-message", handleReceiveMessage);

    socket.on("chat-reaction-receiver", handleNewReaction);

    let allDrafts = JSON.parse(localStorage.getItem("draft-messages")) || {};
    if (allDrafts[gameId]) {
      setText(allDrafts[gameId]);
    }

    const handleResize = () => {
      textAreaFocus.current?.scrollIntoView();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      socket.off("receive-new-message", handleReceiveMessage);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    loadMessages();

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
  }, [gameId]);

  useEffect(() => {
    if (isTyping) scrollChatElementBottom();
  }, [isTyping]);

  const handleSendMessage = useCallback(async () => {
    if (!text.trim() || !opponent || !userId) return;

    setIsEmojiPickerTrue(false);

    scrollChatElementBottom();

    try {
      let encryptedText = encryptMessage(text.trim());
      let info = {
        _id: "",
        senderId: userId,
        message: text.trim(),
        updatedAt: Date.now(),
        createdAt: Date.now(),
      };

      setText(() => "");
      textareaRef.current.value = "";
      adjustHeight();

      let response = await messagePost({
        receiverId: opponent._id,
        gameId,
        content: encryptedText,
      });

      if (response.data) info._id = response.data.messageId;

      socket.emit("new-message", {
        _id: response?.data?.messageId || "",
        senderId: userId,
        message: encryptedText,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });

      setAllMessage((prev) => [...prev, info]);
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
            onScroll={handleScroll}
          >
            {allMessage?.length == 0 ? (
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
            ) : (
              <div className="bg-transparent h-5"></div>
            )}
            {hasMoreMessages ? (
              <div className="flex items-center justify-center pb-3">
                <span
                  className="loader"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderWidth: "0.15rem",
                  }}
                ></span>
              </div>
            ) : (
              ""
            )}
            {
              allMessage.map((info, idx) => {
                return <div
                  key={idx}
                >
                  <SingleChat
                    allMessage={allMessage}
                    setAllMessage={setAllMessage}
                    idx={idx}
                    info={info}
                    userId={userId}
                  />
                </ div>
              })
            }

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
          <div className="w-full relative flex gap-2 items-end p-2 pt-1">
            <div className="w-full relative flex items-end bg-[rgb(42,56,67)] p-1 text-white outline-none rounded-3xl">
              <div className="min-w-[2.5rem] w-[2.5rem] h-full hover:cursor-pointer p-1">
                <img
                  src="/images/smile.png"
                  alt="E"
                  onClick={() => setIsEmojiPickerTrue((prev) => !prev)}
                  className="w-full"
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
                className="caret-[rgb(36,217,181)] w-full resize-none bg-transparent p-2 pl-1 px-4 text-white outline-none rounded-3xl rounded-bl-none rounded-tl-none"
                placeholder="Message"
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
                onBlur={() =>
                (typingRef.current = setTimeout(() => {
                  socket.emit("not-typing", userId);
                }, 100))
                }
              />
            </div>
            <button
              className="h-[3rem] flex justify-center items-center text-white border rounded-[50%] aspect-square bg-slate-100"
              onClick={handleSendMessage}
            >
              <img src="/images/send.png" alt="" className="w-6 max-h-6" />
            </button>
          </div>
          <div ref={textAreaFocus}></div>
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
