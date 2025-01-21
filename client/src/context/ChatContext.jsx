/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { socket } from "../socket.js";
import MemoizedEmojiPickerForReaction from "../components/chat/EmojiReactionMore.jsx";
import { useAuthContext } from "./AuthContext.jsx";
import { messageReaction } from "../api/message.js";
import { useParams } from "react-router";
import { decryptMessage } from "../utils/encryptDecryptMessage.js";
import showNotification from "../utils/Notification.js";
import Chats from "../components/chat/Chats.jsx";

const chatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useChatContext() {
  return useContext(chatContext);
}

function ChatContext() {
  const { gameId } = useParams();
  const { playerInfo } = useAuthContext();
  const userId = playerInfo._id;

  const [allMessage, setAllMessage] = useState(null);
  const [reactionMessageId, setReactionMessageId] = useState(null);
  const [mentionText, setMentionText] = useState(null);

  const [trueFalseStates, setTrueFalseStates] = useState({
    initialLoad: true,
    isTyping: false,
    isEmojiPickerTrue: false,
    isOpenReactionMore: false,
    isChatSectionBottom: true,
  });

  const allRefs = useRef({
    previousScrollHeight: null,
    typingRef: null,
    textareaRef: null,
    chatSectionRef: null,
    textAreaFocus: null,
  });

  const cleanUpSocketEvents = useCallback((events) => {
    events.forEach(([event, listener]) => socket.off(event, listener));
  }, []);

  function isAtBottom(element, offset) {
    if (!element) return false;
    return (
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) <= offset
    );
  }

  const scrollChatElementBottom = useCallback(
    function () {
      const chatSectionRefCurrent = allRefs.current.chatSectionRef;

      if (chatSectionRefCurrent) {
        if (isAtBottom(chatSectionRefCurrent, 10)) {
          setTimeout(() => {
            chatSectionRefCurrent.scrollTo({
              top: chatSectionRefCurrent.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        }
      }
    },
    [isAtBottom]
  );
  useEffect(() => {
    if (!allMessage) return;

    const container = allRefs.current.chatSectionRef;
    if (!container) return;

    const newScrollHeight = container.scrollHeight;

    if (trueFalseStates.initialLoad) {
      container.scrollTo(0, newScrollHeight); // Scroll to the bottom initially
      setTrueFalseStates((prev) => ({ ...prev, initialLoad: false }));
      allRefs.current.previousScrollHeight = newScrollHeight; // Save initial scroll height
      return;
    }

    const previousScrollHeight = allRefs.current.previousScrollHeight;

    if (container.scrollTop + container.clientHeight === previousScrollHeight) {
      container.scrollTop = newScrollHeight;
    } else {
      container.scrollTop =
        container.scrollHeight - previousScrollHeight + container.scrollTop;
    }

    allRefs.current.previousScrollHeight = newScrollHeight;
  }, [allMessage]);

  useEffect(() => {
    const handleResize = () => {
      if (allRefs.current.textareaRef == document.activeElement)
        allRefs.current.textAreaFocus?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function handleReceiveMessage(info) {
      const { senderId, message, _id, mentionText, senderName } = info;
      const decryptMessageText = decryptMessage(message);
      showNotification(senderName + " : " + decryptMessageText);
      setAllMessage((prev) => [
        ...prev,
        {
          _id,
          reaction: [],
          mentionText,
          senderId,
          message: decryptMessageText,
          updatedAt: Date.now(),
          createdAt: Date.now(),
        },
      ]);
      scrollChatElementBottom();
    }

    function handleNewReaction(info) {
      setAllMessage((prev) =>
        prev.map((val) => {
          if (val._id != info.messageId) return val;
          return { ...val, reaction: info.reaction };
        })
      );
    }

    function handleUpdateMessageId(info) {
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

    function handleServerTyping(value) {
      if (userId !== value.userId && gameId === value.gameId) {
        setTrueFalseStates((prev) => ({ ...prev, isTyping: true }));
        setTimeout(() => {
          scrollChatElementBottom();
        }, 0);
      }
    }

    function handleServerNotTyping() {
      setTrueFalseStates((prev) => ({ ...prev, isTyping: false }));
      setTimeout(() => {
        scrollChatElementBottom();
      }, 0);
    }

    const listeners = [
      ["server-typing", handleServerTyping],
      ["server-not-typing", handleServerNotTyping],
      ["receive-new-message", handleReceiveMessage],
      ["new-message-update-id-user", handleUpdateMessageId],
      ["chat-reaction-receiver", handleNewReaction],
    ];

    listeners.forEach(([event, listener]) => socket.on(event, listener));

    return () => cleanUpSocketEvents(listeners);
  }, [gameId]);

  useEffect(() => {
    scrollChatElementBottom();
  }, [mentionText]);

  const handleReaction = useCallback(
    async (messageId, reaction) => {
      try {
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
    },
    [gameId]
  );

  async function passReactionReference(emojiObject) {
    setTrueFalseStates((prev) => ({ ...prev, isOpenReactionMore: false }));
    await handleReaction(reactionMessageId, emojiObject.emoji);
  }

  return (
    <chatContext.Provider
      value={{
        allRefs, //.
        gameId, //.
        playerInfo, //.
        allMessage, //.
        setAllMessage, //.
        reactionMessageId,
        setReactionMessageId, //.
        trueFalseStates, //.
        setTrueFalseStates, //.
        mentionText, //.
        setMentionText, //.
        isAtBottom, //.
        scrollChatElementBottom, //.
        handleReaction, //.
      }}
    >
      {
        <div className="relative h-full w-full flex flex-col bg-transparent">
          <img
            src="/images/chat.png"
            alt=""
            decoding="sync"
            className="absolute w-full h-full top-0 brightness-[25%] object-cover"
          />

          {/* more reaction */}
          <div
            className="absolute bottom-0 left-0 w-full flex z-[1000] h-[80%] overflow-hidden"
            style={{
              height: trueFalseStates.isOpenReactionMore ? "80%" : "0",
              transition: "height 0.5s ease",
            }}
          >
            <MemoizedEmojiPickerForReaction
              onEmojiClick={passReactionReference}
              isOpenReactionMore={trueFalseStates.isOpenReactionMore}
              setTrueFalseStates={setTrueFalseStates}
            />
          </div>

          {/* Chat Messages */}
          <Chats />
        </div>
      }
    </chatContext.Provider>
  );
}

export default ChatContext;
