/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import SingleChat from "./SingleChat.jsx";
import MemoizedEmojiMore from "./EmojiMore.jsx";
import { useGameContext } from "../../pages/Game.jsx";
import { useChatContext } from "../../context/ChatContext.jsx";
import {
  encryptMessage,
  decryptMessage,
} from "../../utils/encryptDecryptMessage.js";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../../socket.js";
import { messagePost, messageGet } from "../../api/message.js";
import toast from "react-hot-toast";
import Typing from "./Typing.jsx";

function Chats() {
  const { opponent } = useGameContext();

  const {
    allRefs,
    setTrueFalseStates,
    scrollChatElementBottom,
    isAtBottom,
    allMessage,
    trueFalseStates,
    gameId,
    playerInfo,
    mentionText,
    setMentionText,
    setAllMessage,
    setReactionMessageId,
    handleReaction,
  } = useChatContext();
  const userId = playerInfo._id;

  const [text, setText] = useState("");

  const loadMessages = useCallback(async () => {
    try {
      let response = await messageGet(gameId, allMessage?.length || 0);

      if (response) {
        const { success, info, hasMore } = response.data;
        console.log(info);

        setTrueFalseStates((prev) => ({ ...prev, hasMoreMessages: hasMore }));
        if (success) {
          const decryptedMessages = info.map((value) => ({
            _id: value._id,
            senderId: value.senderId,
            message: decryptMessage(value.content),
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
            reaction: value.reaction,
            mentionText: {
              text: value.mentionText
                ? decryptMessage(value.mentionText.content)
                : null,
              _id: value.mentionText?._id,
              owner: value.mentionText?.senderId,
            },
          }));
          setAllMessage((prev) =>
            prev?.length ? [...decryptedMessages, ...prev] : decryptedMessages
          );
        } else setAllMessage([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try to refresh the page");
    }
  }, [allMessage, gameId]);

  const handleScroll = () => {
    const container = allRefs.current.chatSectionRef;
    setTrueFalseStates((prev) => ({
      ...prev,
      isChatSectionBottom: isAtBottom(container, 200),
    }));

    if (!container) return;

    if (
      container.scrollTop <= 0 &&
      trueFalseStates.hasMoreMessages &&
      allMessage
    ) {
      loadMessages();
    }
  };
  const handleEmojiClick = useCallback(
    (emojiObject) => {
      setText((prev) => prev + emojiObject.emoji);
    },
    [setText]
  );

  const handleSendMessage = useCallback(async () => {
    if (!text.trim() || !opponent || !userId) return;

    setTrueFalseStates((prev) => ({ ...prev, isEmojiPickerTrue: false }));
    scrollChatElementBottom();

    let encryptedText = encryptMessage(text.trim());
    const tempId = uuidv4();

    let info = {
      _id: tempId,
      senderName: playerInfo.name,
      senderId: userId,
      message: text.trim(),
      updatedAt: Date.now(),
      createdAt: Date.now(),
      mentionText,
    };

    setMentionText(null);
    setAllMessage((prev) => [...prev, info]);
    setText("");

    try {
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
  }, [gameId, text, userId, mentionText]);

  const adjustHeight = useCallback(() => {
    const textarea = allRefs.current.textareaRef;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`; // Adjust to content
      scrollChatElementBottom();
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [gameId]);

  if (!allMessage)
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );

  return (
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

        {trueFalseStates.hasMoreMessages && (
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
        )}

        {allMessage.map((info, idx) => {
          return (
            <div key={idx}>
              <SingleChat
                handleReaction={handleReaction}
                setReactionMessageId={setReactionMessageId}
                setTrueFalseStates={setTrueFalseStates}
                setMentionText={setMentionText}
                allRefs={allRefs}
                allMessage={allMessage}
                idx={idx}
                info={info}
                userId={userId}
              />
            </div>
          );
        })}

        <Typing isTyping={trueFalseStates.isTyping} />
      </div>

      {/* Input Box */}
      <div className="w-full relative">
        <div className="w-full relative grid grid-cols-[auto_3rem] gap-2 items-end p-2 pt-1">
          <div
            className="w-full p-1 bg-[rgb(42,56,67)] rounded-3xl"
            style={{
              borderTopLeftRadius: mentionText ? "1rem" : "1.5rem",
              borderTopRightRadius: mentionText ? "1rem" : "1.5rem",
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
              <div className="active:bg-[rgba(255,255,255,0.14)] transition-colors rounded-full min-w-[2.5rem] w-[2.5rem] h-full hover:cursor-pointer p-1">
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
          <div className="relative">
            {/* scroll to bottom */}
            <div
              onClick={(e) => {
                e.preventDefault();
                const chatSectionRefCurrent = allRefs.current.chatSectionRef;
                if (!chatSectionRefCurrent) return;
                chatSectionRefCurrent.scrollTo({
                  top: chatSectionRefCurrent.scrollHeight,
                  behavior: "instant",
                });
              }}
              className="absolute hover:cursor-pointer active:bg-blackDarkest transition-all right-[0.5rem] rotate-180 rounded-full p-2 z-50 bg-[rgb(32,45,50)] top-[-3.5rem]"
              style={{
                scale: trueFalseStates.isChatSectionBottom ? "0" : "1",
              }}
            >
              <img src="/images/double.png" alt="" className="w-5" />
            </div>
            <button
              className="h-[3rem] relative flex justify-center items-center text-white rounded-[50%] aspect-square bg-[rgb(37,211,102)] active:brightness-75 transition-colors"
              onClick={handleSendMessage}
            >
              <img
                src="/images/send.png"
                alt=""
                className="w-6 max-h-6 rotate-45 brightness-0"
              />
            </button>
          </div>
        </div>
        <MemoizedEmojiMore
          onEmojiClick={handleEmojiClick}
          isEmojiPickerTrue={trueFalseStates.isEmojiPickerTrue}
        />
      </div>
      <div ref={(el) => (allRefs.current.textAreaFocus = el)}></div>
    </div>
  );
}

export default Chats;
