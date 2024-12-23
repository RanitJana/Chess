/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { messagePost } from "../api/message.js";
import { toast } from "react-hot-toast";
import { socket } from "../socket.js";
import "./Chat.css";
import { encryptMessage } from "../utils/encryptDecryptMessage.js";
import { useGameContext } from "../pages/Game.jsx";
import EmojiPicker from "emoji-picker-react";

function ChatInGame({
  allMessage,
  setAllMessage,
  gameId,
  userId,
  chatSectionRef,
  setNewMessageCount,
}) {
  const { opponent } = useGameContext();

  useEffect(() => {
    setNewMessageCount(0);
  }, []);

  const [isTyping, setTyping] = useState(false);

  const [text, setText] = useState("");

  const [isEmojiPickerTrue, setIsEmojiPickerTrue] = useState(false);

  let typingRef = useRef(null);

  const handleSendMessage = useCallback(async () => {
    if (!text.trim() || !opponent || !userId) return;

    setIsEmojiPickerTrue(false);

    try {
      let encryptedText = encryptMessage(text.trim());

      let info = { senderId: userId, message: text.trim() };

      setText("");
      socket.emit("new-message", { senderId: userId, message: encryptedText });

      setAllMessage((prev) => [...prev, info]);
      await messagePost({
        receiverId: opponent._id,
        gameId,
        content: encryptedText,
      });
    } catch (error) {
      console.log(error);
      toast.error("Unable to send the message");
    } finally {
      chatSectionRef.current?.scrollTo(0, chatSectionRef.current.scrollHeight);
    }
  }, [gameId, opponent, text, userId]);

  useEffect(() => {
    chatSectionRef.current?.scrollTo(0, chatSectionRef.current.scrollHeight);
  }, [allMessage]);

  useEffect(() => {
    socket.on("server-typing", (value) => {
      if (userId !== value.userId && gameId == value.gameId) setTyping(true);
    });

    socket.on("server-not-typing", () => {
      setTyping(false);
    });

    return () => {
      socket.off("server-typing");
      socket.off("server-not-typing");
    };
  }, [gameId, userId]);

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Chat Messages */}
      {allMessage ? (
        <>
          <div
            className="w-full h-full text-white overflow-y-auto px-3 space-y-1"
            ref={chatSectionRef}
          >
            <div className=" flex justify-center mt-2">
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
            {allMessage?.map((info, idx) => (
              <div
                key={idx}
                className={`flex ${info.senderId === userId ? "justify-end" : "justify-start"}`}
                style={info.senderId == userId ? {} : {}}
              >
                <div
                  className={`p-1 px-2 rounded-lg ${info.senderId == userId ? "bg-blue-500 rounded-br-none" : "bg-white text-black rounded-bl-none"} max-w-[90%]`}
                >
                  {info.message}
                </div>
              </div>
            ))}
            <div
              className="bg-white w-fit px-[15px] rounded-lg rounded-bl-none overflow-hidden transition-all"
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
          <div className="w-full relative flex gap-2 items-center p-2">
            <div
              className="w-10 hover:cursor-pointer h-8"
            >
              <img
                src="/images/smile.png"
                alt="E"
                onClick={() => setIsEmojiPickerTrue((prev) => !prev)}
              />
            </div>
            {isEmojiPickerTrue && (
              <EmojiPicker
                theme="dark"
                style={{
                  position: "absolute",
                  bottom: "3.5rem",
                  left: "0.5rem",
                  height: "25rem"
                }}
                lazyLoadEmojis={true}
                onEmojiClick={(e) => setText((prev) => prev + e.emoji)}
              />
            )}
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent border-[1px] p-2 px-4 text-white outline-none rounded-3xl"
              placeholder="Send a message..."
              onKeyDown={(e) => {
                if (typingRef.current) clearTimeout(typingRef.current);
                if (e.key == "Enter") {
                  socket.emit("not-typing", userId);
                  handleSendMessage();
                } else {
                  socket.emit("typing", { userId, gameId });
                }
              }}
              onKeyUp={() => {
                typingRef.current = setTimeout(() => {
                  socket.emit("not-typing", userId);
                }, 2000);
              }}
              onFocus={() => setIsEmojiPickerTrue(false)}
              onBlur={() => {
                typingRef.current = setTimeout(() => {
                  socket.emit("not-typing", userId);
                }, 2000);
              }}
            />
            <button
              className="h-full flex justify-center items-center text-white border rounded-[50%] aspect-square bg-slate-100"
              onClick={handleSendMessage}
            >
              <img src="/images/send.png" alt="" className="w-6" />
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
