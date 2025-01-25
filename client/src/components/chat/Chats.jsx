/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import SingleChat from "./SingleChat.jsx";
import { useChatContext } from "../../context/ChatContext.jsx";
import { decryptMessage } from "../../utils/encryptDecryptMessage.js";
import { messageGet } from "../../api/message.js";
import toast from "react-hot-toast";
import Typing from "./Typing.jsx";
import FetchingMoreLoader from "./FetchingMoreLoader.jsx";
import TypingArea from "./TypingArea.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyChat from "./EmptyChat.jsx";

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

  // Function to load more messages
  const loadMessages = useCallback(async () => {
    try {
      const response = await messageGet(gameId, allMessage?.length || 0);
      if (response) {
        const { success, info, hasMore } = response.data;
        setHasMoreMessages(hasMore);

        if (success) {
          const decryptedMessages = info
            .map((value) => ({
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
            }))
            .reverse();

          setAllMessage((prev) => [...(prev || []), ...decryptedMessages]);
        } else {
          setAllMessage([]);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("An error occurred. Please try refreshing the page.");
    }
  }, [allMessage, gameId]);

  // Update scrolling state
  const handleScroll = () => {
    const container = allRefs.current.chatSectionRef;
    setTrueFalseStates((prev) => ({
      ...prev,
      isChatSectionBottom: isAtBottom(container, 200),
    }));
  };

  // Initial load of messages
  useEffect(() => {
    loadMessages();
  }, [gameId]);

  // Render a loader if messages are not available
  if (!allMessage)
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );

  return (
    <div className="absolute top-0 h-full flex flex-col w-full">
      <div
        className="w-full h-full text-white overflow-y-auto space-y-1 flex flex-col-reverse"
        ref={(el) => (allRefs.current.chatSectionRef = el)}
        id="scrollableDiv"
        onScroll={handleScroll}
      >
        <InfiniteScroll
          dataLength={allMessage.length}
          next={loadMessages}
          hasMore={hasMoreMessages}
          loader={<FetchingMoreLoader />}
          endMessage={<EmptyChat />}
          scrollableTarget="scrollableDiv"
          inverse={true}
          scrollThreshold={1} // Adjusted for smooth loading
          className="flex flex-col-reverse h-full w-full min-h-full overflow-auto space-y-1 z-30"
        >
          <>
            {/* Typing Indicator */}
            <Typing isTyping={trueFalseStates.isTyping} />

            {/* Messages */}
            {allMessage.map((info, idx) => (
              <div key={info._id}>
                <SingleChat
                  prevBubble={
                    idx + 1 === allMessage.length ? null : allMessage[idx + 1]
                  }
                  info={info}
                  idx={allMessage.length - 1 - idx}
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
            ))}
          </>
        </InfiniteScroll>
      </div>

      {/* Typing Area */}
      <TypingArea />

      <div ref={(el) => (allRefs.current.textAreaFocus = el)}></div>
    </div>
  );
}

export default Chats;
