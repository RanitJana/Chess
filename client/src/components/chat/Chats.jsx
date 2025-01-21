/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import SingleChat from "./SingleChat.jsx";
import { useChatContext } from "../../context/ChatContext.jsx";
import { decryptMessage } from "../../utils/encryptDecryptMessage.js";
import { messageGet } from "../../api/message.js";
import toast from "react-hot-toast";
import Typing from "./Typing.jsx";
import FetchingMoreLoader from "./FetchingMoreLoader.jsx";
import EmptyChat from "./EmptyChat.jsx";
import TypingArea from "./TypingArea.jsx";

function Chats() {
  const {
    allRefs,
    setTrueFalseStates,
    isAtBottom,
    allMessage,
    trueFalseStates,
    gameId,
    setAllMessage,
    scrollChatElementBottom,
    playerInfo,
    setMentionText,
    setReactionMessageId,
    handleReaction,
  } = useChatContext();

  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const loadMessages = useCallback(async () => {
    try {
      let response = await messageGet(gameId, allMessage?.length || 0);

      if (response) {
        const { success, info, hasMore } = response.data;
        setHasMoreMessages(hasMore);
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

    if (container.scrollTop <= 0 && hasMoreMessages && allMessage) {
      loadMessages();
    }
  };

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
        className="w-full h-full text-white overflow-y-auto px-4 space-y-1 overflow-x-hidden"
        ref={(el) => (allRefs.current.chatSectionRef = el)}
        onScroll={handleScroll}
      >
        {/* for empty chat */}
        <EmptyChat length={allMessage?.length} />

        {/* loader when fetching more messgae */}
        <FetchingMoreLoader hasMoreMessages={hasMoreMessages} />

        {allMessage.map((info, idx) => {
          return (
            <div key={info._id}>
              <SingleChat
                prevBubble={idx == 0 ? null : allMessage[idx - 1]}
                info={info}
                idx={idx}
                scrollChatElementBottom={scrollChatElementBottom}
                playerInfo={playerInfo}
                allRefs={allRefs}
                setMentionText={setMentionText}
                setTrueFalseStates={setTrueFalseStates}
                setReactionMessageId={setReactionMessageId}
                handleReaction={handleReaction}
                hasMoreMessages={hasMoreMessages}
              />
            </div>
          );
        })}

        <Typing isTyping={trueFalseStates.isTyping} />
      </div>

      {/* Input Box */}
      <TypingArea />

      <div ref={(el) => (allRefs.current.textAreaFocus = el)}></div>
    </div>
  );
}

export default Chats;
