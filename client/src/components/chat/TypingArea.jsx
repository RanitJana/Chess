/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useCallback, useRef, useState } from "react";
import { socket } from "../../socket.js";
import MemoizedEmojiMore from "./EmojiMore.jsx";
import { useGameContext } from "../../pages/Game.jsx";
import { useChatContext } from "../../context/ChatContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { messagePost } from "../../api/message.js";
import { encryptMessage } from "../../utils/encryptDecryptMessage.js";
import toast from "react-hot-toast";
import ScrollToBottom from "./ScrollToBottom.jsx";

function MentionInText({ mentionText = {}, setMentionText }) {
  return (
    <div
      className={`bg-[rgb(17,26,33)] rounded-xl  ${mentionText ? "m-[0.15rem]" : "h-0"} transition-opacity overflow-hidden`}
    >
      <div className="text-sm border-l-4 flex-col h-full border-[rgb(7,206,156)] flex items-center justify-center">
        <div className="flex items-center justify-between w-full px-2 py-1">
          <span className="text-[rgb(13,160,157)] font-bold transition-all">
            {mentionText?.owner}
          </span>
          <span
            className="text-white hover:cursor-pointer"
            onClick={() => setMentionText(null)}
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
          className={`px-2 pb-1 w-[99%] text-[rgb(174,174,174)] line-clamp-3 break-all text-pretty mb-1`}
        >
          {mentionText?.text}
        </span>
      </div>
    </div>
  );
}

function TypingArea() {
  const { opponent } = useGameContext();
  const {
    mentionText,
    setMentionText,
    trueFalseStates,
    setTrueFalseStates,
    setAllMessage,
    scrollChatElementBottom,
    allRefs,
    playerInfo,
    gameId,
  } = useChatContext();
  const userId = playerInfo._id;

  const [text, setText] = useState("");
  const isPrevFocusedTextArea = useRef(false);

  const handleEmojiClick = useCallback((emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  }, []);

  const adjustHeight = useCallback(() => {
    const textarea = allRefs.current.textareaRef;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`; // Adjust to content
      scrollChatElementBottom();
    }
  }, [allRefs, scrollChatElementBottom]);

  const handleSendMessage = useCallback(async () => {
    if (isPrevFocusedTextArea.current) {
      isPrevFocusedTextArea.current = false;
      allRefs.current.textareaRef.focus();
    }
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
    adjustHeight();

    try {
      socket.emit("new-message", {
        ...{ ...info, mentionText },
        message: encryptedText,
      });

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
  }, [
    text,
    opponent,
    userId,
    setTrueFalseStates,
    scrollChatElementBottom,
    playerInfo.name,
    mentionText,
    setMentionText,
    setAllMessage,
    adjustHeight,
    gameId,
  ]);

  const handleOnChange = (e) => {
    setText(e.target.value);
    adjustHeight();
  };

  const handleOnkeyDown = (e) => {
    if (allRefs.current.typingRef) clearTimeout(allRefs.current.typingRef);
    if (e.key === "Enter") {
      e.preventDefault();
      socket.emit("not-typing", userId);
      handleSendMessage();
    } else {
      socket.emit("typing", { userId, gameId });
    }
  };

  const handleOnKeyUp = () => {
    allRefs.current.typingRef = setTimeout(() => {
      socket.emit("not-typing", userId);
    }, 2000);
  };

  const handleOnFocus = () => {
    isPrevFocusedTextArea.current = true;
    setTrueFalseStates((prev) => ({ ...prev, isEmojiPickerTrue: false }));
  };

  const handleOnBlur = () => {
    allRefs.current.typingRef = setTimeout(() => {
      socket.emit("not-typing", userId);
    }, 100);
  };

  const handleOpenMoreEmoji = () => {
    setTrueFalseStates((prev) => ({
      ...prev,
      isEmojiPickerTrue: !prev.isEmojiPickerTrue,
    }));
  };

  return (
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
          <MentionInText
            mentionText={mentionText}
            setMentionText={setMentionText}
          />

          <div className="w-full relative flex items-end text-white outline-none">
            {/* more emoji */}
            <div className="active:bg-[rgba(255,255,255,0.14)] transition-colors rounded-full min-w-[2.5rem] w-[2.5rem] h-full hover:cursor-pointer p-1">
              <img
                src="/images/smile.png"
                alt="E"
                onClick={handleOpenMoreEmoji}
                className="w-full"
              />
            </div>
            {/* typing section */}
            <textarea
              ref={(el) => (allRefs.current.textareaRef = el)}
              type="text"
              value={text}
              rows={1}
              className="caret-[rgb(36,217,181)] w-full resize-none bg-transparent p-2 pl-1 px-4 text-white outline-none rounded-3xl rounded-bl-none rounded-tl-none overflow-y-scroll"
              placeholder="Message"
              onChange={handleOnChange}
              onKeyDown={handleOnkeyDown}
              onKeyUp={handleOnKeyUp}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              onScroll={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <div className="relative">
          {/* scroll to bottom */}
          <ScrollToBottom
            chatSectionRef={allRefs.current?.chatSectionRef}
            isChatSectionBottom={trueFalseStates.isChatSectionBottom}
          />
          {/* send buttom */}
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

      {/* more emoji in keyboard */}
      <MemoizedEmojiMore
        onEmojiClick={handleEmojiClick}
        isEmojiPickerTrue={trueFalseStates.isEmojiPickerTrue}
      />
    </div>
  );
}

export default TypingArea;
