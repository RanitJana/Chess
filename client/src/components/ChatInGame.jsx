/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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

const cleanUpSocketEvents = (events) => {
  events.forEach(([event, listener]) => socket.off(event, listener));
};

const MemoizedEmojiPicker = React.memo(EmojiPickerComponent);

function ChatInGame() {
  const { gameId } = useParams();
  const { opponent } = useGameContext();
  const { playerInfo } = useAuthContext();
  const userId = playerInfo._id;

  const [allMessage, setAllMessage] = useState(null);

  const [trueFalseStates, setTrueFalseStates] = useState({
    initialLoad: true,
    isTyping: false,
    hasMoreMessages: true,
    isEmojiPickerTrue: false,
  });

  const [text, setText] = useState("");

  // {
  //   text: "Hey ranit what's up. How are you?",
  //   _id: 123,
  //   owner:"You"
  // }
  const [mentionText, setMentionText] = useState(null);
  const [chatSectionBottom, isChatSectionBottom] = useState(true);

  const allRefs = useRef({
    previousScrollHeight: null,
    typingRef: null,
    textareaRef: null,
    chatSectionRef: null,
    textAreaFocus: null,
  });

  const loadMessages = useCallback(async () => {
    try {
      let response = await messageGet(gameId, allMessage?.length || 0);

      if (response) {
        const { success, info, hasMore } = response.data;
        setTrueFalseStates((prev) => ({ ...prev, hasMoreMessages: hasMore }));
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
                  mentionText: {
                    text: value.mentionText
                      ? decryptMessage(value.mentionText?.content)
                      : null,
                    _id: value.mentionText?._id,
                    owner: value.mentionText?.senderId,
                  },
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
                mentionText: {
                  text: value.mentionText
                    ? decryptMessage(value.mentionText?.content)
                    : null,
                  _id: value.mentionText?._id,
                  owner: value.mentionText?.senderId,
                },
              }));
            });
        } else setAllMessage([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try to refresh the page");
    }
  }, [allMessage, gameId]);

  const handleSendMessage = useCallback(async () => {
    if (!text.trim() || !opponent || !userId) return;

    setTrueFalseStates((prev) => ({ ...prev, isEmojiPickerTrue: false }));
    scrollChatElementBottom();

    let encryptedText = encryptMessage(text.trim());
    const tempId = uuidv4();

    let info = {
      _id: tempId,
      senderId: userId,
      message: text.trim(),
      updatedAt: Date.now(),
      createdAt: Date.now(),
      mentionText,
    };

    setMentionText(() => null);

    try {
      setAllMessage((prev) => [...prev, info]);
      setText(() => "");

      socket.emit("new-message", {
        ...{ ...info, mentionText },
        message: encryptedText,
      });

      allRefs.current.textareaRef.value = "";
      adjustHeight();

      let response = await messagePost({
        receiverId: opponent._id,
        gameId,
        content: encryptedText,
        mentionText: mentionText ? mentionText._id : null,
      });

      if (response.data) {
        socket.emit("new-message-update-id", {
          prev: tempId,
          current: response.data.messageId,
        });

        setAllMessage((prev) => {
          for (let i = prev.length - 1; i >= 0; i--) {
            if (prev[i]._id == tempId) {
              prev[i]._id = response.data.messageId;
              break;
            }
          }
          return prev;
        });
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

  function isAtBottom(element, offset) {
    if (!element) return false;
    return (
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) < offset
    );
  }

  const scrollChatElementBottom = function () {
    const chatSectionRefCurrent = allRefs.current.chatSectionRef;

    if (chatSectionRefCurrent) {
      if (isAtBottom(chatSectionRefCurrent, 200)) {
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
    const textarea = allRefs.current.textareaRef;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`; // Adjust to content
      scrollChatElementBottom();
    }
  };

  const handleScroll = () => {
    const container = allRefs.current.chatSectionRef;
    isChatSectionBottom(() => isAtBottom(container, 200));

    if (!container) return;

    if (
      container.scrollTop <= 0 &&
      trueFalseStates.hasMoreMessages &&
      allMessage
    ) {
      loadMessages();
    }
  };

  useEffect(() => {
    if (!allMessage) return;

    const container = allRefs.current.chatSectionRef;
    if (!container) return;

    const newScrollHeight = container.scrollHeight;

    // Handle initial load separately
    if (trueFalseStates.initialLoad) {
      container.scrollTo(0, newScrollHeight);
      setTrueFalseStates((prev) => ({ ...prev, initialLoad: false }));
      allRefs.current.previousScrollHeight = newScrollHeight;
      return;
    }

    // Handle subsequent updates (e.g., new messages)
    if (allRefs.current.previousScrollHeight != null) {
      if (newScrollHeight !== allRefs.current.previousScrollHeight) {
        // Only adjust scroll for new content
        container.scrollTop +=
          newScrollHeight - allRefs.current.previousScrollHeight;
      }
    }

    allRefs.current.previousScrollHeight = newScrollHeight;
  }, [allMessage]);

  useEffect(() => {
    const handleReceiveMessage = (info) => {
      const { senderId, message, _id, mentionText } = info;
      setAllMessage((prev) => [
        ...prev,
        {
          _id,
          reaction: [],
          mentionText,
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

    function updateMessageId(info) {
      const { prev, current } = info;
      setAllMessage((temp) => {
        for (let i = temp.length - 1; i >= 0; i--) {
          if (temp[i]._id == prev) {
            temp[i]._id = current;
            break;
          }
        }
        return temp;
      });
    }

    const listeners = [
      ["receive-new-message", handleReceiveMessage],
      ["new-message-update-id-user", updateMessageId],
      ["chat-reaction-receiver", handleNewReaction],
    ];

    // Register socket event listener
    listeners.forEach(([event, listener]) => socket.on(event, listener));

    const handleResize = () => {
      if (allRefs.current.textareaRef === document.activeElement) {
        // Get the current bounding rectangle of the focused textarea
        const { top } = allRefs.current.textareaRef.getBoundingClientRect();

        // Adjust the scroll behavior to ensure it aligns smoothly
        window.scrollTo({
          top: window.scrollY + top - 100, // Adjust 100 as an offset for better positioning
          behavior: "smooth", // Smooth scrolling behavior
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cleanUpSocketEvents(listeners);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    loadMessages();

    const listeners = [
      [
        "server-typing",
        (value) => {
          if (userId !== value.userId && gameId === value.gameId)
            setTrueFalseStates((prev) => ({ ...prev, isTyping: true }));
        },
      ],
      [
        "server-not-typing",
        () => {
          setTrueFalseStates((prev) => ({ ...prev, isTyping: false }));
        },
      ],
    ];

    listeners.forEach(([event, listener]) => socket.on(event, listener));

    return () => cleanUpSocketEvents(listeners);
  }, [gameId]);

  useEffect(() => {
    scrollChatElementBottom();
  }, [mentionText]);

  return (
    <div className="relative h-full w-full flex flex-col bg-transparent">
      <img
        src="/images/chat.png"
        decoding="sync"
        alt=""
        className="absolute w-full h-full top-0 brightness-[25%] object-cover"
      />
      {/* scroll to bottom */}
      <div
        onClick={() => {
          const chatSectionRefCurrent = allRefs.current.chatSectionRef;
          if (!chatSectionRefCurrent) return;
          chatSectionRefCurrent.scrollTo({
            top: chatSectionRefCurrent.scrollHeight,
            behavior: "smooth",
          });
        }}
        className="absolute hover:cursor-pointer active:bg-blackDarkest transition-all right-[1rem] rotate-180 rounded-full p-2 z-50 bg-[rgb(32,45,50)] bottom-[5rem]"
        style={{
          scale: chatSectionBottom ? "0" : "1",
        }}
      >
        <img src="/images/double.png" alt="" className="w-5" />
      </div>
      {/* Chat Messages */}
      {allMessage ? (
        <div className="absolute top-0 h-full flex flex-col w-full">
          <div
            className="w-full h-full text-white overflow-y-auto px-4 space-y-1"
            ref={(el) => (allRefs.current.chatSectionRef = el)}
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
            {trueFalseStates.hasMoreMessages ? (
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
            {allMessage.map((info, idx) => {
              return (
                <div key={idx}>
                  <SingleChat
                    setMentionText={setMentionText}
                    allRefs={allRefs}
                    allMessage={allMessage}
                    setAllMessage={setAllMessage}
                    idx={idx}
                    info={info}
                    userId={userId}
                  />
                </div>
              );
            })}

            <div
              className="bg-[rgb(32,44,51)] flex items-center justify-center w-fit px-[15px] rounded-xl rounded-tl-none overflow-hidden transition-all"
              style={{
                height: `${!trueFalseStates.isTyping ? "0px" : "35px"}`,
                padding: `${!trueFalseStates.isTyping ? "0" : "0.5rem"}`,
                opacity: trueFalseStates.isTyping ? "1" : "0",
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
          <div className="w-full relative grid grid-cols-[auto_3rem] gap-2 items-end p-2 pt-1">
            <div className="w-full p-1 bg-[rgb(42,56,67)] rounded-3xl"
              style={{
                borderTopLeftRadius: mentionText ? "1rem" : "1.5rem",
                borderTopRightRadius: mentionText ? "1rem" : "1.5rem"
              }}
            >
              {/* mention text */}
              <div
                className={`bg-[rgb(17,26,33)] rounded-xl  ${mentionText ? "opacity-100 m-[0.15rem]" : "h-0 opacity-0"} transition-opacity overflow-hidden`}
              >
                <div className="text-sm border-l-4 flex-col h-full border-[rgb(7,206,156)] flex items-center justify-center">
                  <div className="flex items-center justify-between w-full px-2 py-1">
                    <span className="text-[rgb(13,160,157)] font-bold transition-all">
                      {mentionText?.owner}
                    </span>
                    <span
                      className="text-white hover:cursor-pointer"
                      onClick={() => {
                        setMentionText(() => null);
                      }}
                    >
                      <img
                        src="/images/cross.png"
                        alt="x"
                        decoding="sync"
                        className="w-4"
                      />
                    </span>
                  </div>
                  <span
                    className={`px-2 pb-1 w-[99%] text-[rgb(114,104,96)] line-clamp-3 break-all text-pretty mb-1`}
                  >
                    {mentionText?.text}
                  </span>
                </div>
              </div>
              <div className="w-full relative flex items-end text-white outline-none">
                <div className="min-w-[2.5rem] w-[2.5rem] h-full hover:cursor-pointer p-1">
                  <img
                    src="/images/smile.png"
                    alt="E"
                    onClick={() =>
                      setTrueFalseStates((prev) => ({
                        ...prev,
                        isEmojiPickerTrue: !prev.isEmojiPickerTrue,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                {trueFalseStates.isEmojiPickerTrue && (
                  <MemoizedEmojiPicker onEmojiClick={handleEmojiClick} />
                )}
                <textarea
                  ref={(el) => (allRefs.current.textareaRef = el)}
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    adjustHeight();
                  }}
                  rows={1}
                  className="caret-[rgb(36,217,181)] w-full resize-none bg-transparent p-2 pl-1 px-4 text-white outline-none rounded-3xl rounded-bl-none rounded-tl-none"
                  placeholder="Message"
                  onKeyDown={(e) => {
                    if (allRefs.current.typingRef)
                      clearTimeout(allRefs.current.typingRef);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      socket.emit("not-typing", userId);
                      handleSendMessage();
                    } else {
                      socket.emit("typing", { userId, gameId });
                    }
                  }}
                  onKeyUp={() => {
                    allRefs.current.typingRef = setTimeout(() => {
                      socket.emit("not-typing", userId);
                    }, 1500);
                  }}
                  onFocus={() =>
                    setTrueFalseStates((prev) => ({
                      ...prev,
                      isEmojiPickerTrue: false,
                    }))
                  }
                  onBlur={() =>
                  (allRefs.current.typingRef = setTimeout(() => {
                    socket.emit("not-typing", userId);
                  }, 100))
                  }
                />
              </div>
            </div>
            <button
              className="h-[3rem] flex justify-center items-center text-white rounded-[50%] aspect-square bg-[rgb(37,211,102)] active:brightness-75 transition-colors"
              onClick={handleSendMessage}
            >
              <img
                src="/images/send.png"
                alt=""
                className="w-6 max-h-6 rotate-45 brightness-0"
              />
            </button>
          </div>
          <div ref={(el) => (allRefs.current.textAreaFocus = el)}></div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default ChatInGame;
