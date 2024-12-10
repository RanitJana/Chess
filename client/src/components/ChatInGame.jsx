/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { getCookie } from "../context/AuthContext.jsx";
import { messageGet, messagePost } from "../api/message.js";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { socket } from "../socket.js";
import "./Chat.css";

function ChatInGame({ opponent }) {
  const { gameId } = useParams();

  // { senderId: '674dbfff3b2690acf11ad9cb', message: 'Hey' },
  const [allMessage, setAllMessage] = useState([]);

  const [isTyping, setTyping] = useState(false);

  const [text, setText] = useState("");

  const userId = getCookie("userId");

  const chatSectionRef = useRef(null);

  let typingRef = useRef(null);

  const handleSendMessage = useCallback(async () => {
    if (!text || !opponent || !userId) return;

    try {
      let info = { senderId: userId, message: text };
      socket.emit("new-message", { senderId: userId, message: text });
      setAllMessage((prev) => [...prev, info]);
      let response = await messagePost({
        receiverId: opponent._id,
        gameId,
        content: text,
      });
    } catch (error) {
      console.log(error);
      toast.error("Unable to send the message");
    } finally {
      setText("");
      chatSectionRef.current?.scrollTo(0, chatSectionRef.current.scrollHeight);
    }
  }, [gameId, opponent, text, userId]);

  useEffect(() => {
    const handleReceiveMessage = (info) => {
      setAllMessage((prev) => [...prev, info]);
      setTimeout(() => {
        chatSectionRef.current?.scrollTo(
          0,
          chatSectionRef.current.scrollHeight
        );
      }, 0);
    };

    // Register socket event listener
    socket.on("receive-new-message", handleReceiveMessage);

    // Cleanup function to avoid multiple registrations
    return () => {
      socket.off("receive-new-message", handleReceiveMessage);
    };
  }, []);

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

  useEffect(() => {
    (async () => {
      try {
        let response = await messageGet(gameId);
        console.log(response);
        const { success, info } = response?.data;
        if (success) {
          setAllMessage(() => {
            return info.map((value) => ({
              senderId: value.senderId,
              message: value.content,
            }));
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Please try to refresh the page");
      }
    })();
  }, [gameId]);

  return (
    <div className="relative h-[38.5rem] w-[100dvw] max-w-[35rem] max-h-[35rem] py-[4px] bg-[rgb(39,37,35)] rounded-md flex flex-col">
      {/* Chat Messages */}
      <div
        className="w-full h-full text-white overflow-y-auto p-2 space-y-2"
        ref={chatSectionRef}
      >
        <div className=" flex justify-center">
          <p className="max-w-[80%] w-full bg-black rounded-lg p-2 text-center text-pretty mb-4 text-[0.8rem]">
            <img
              src="/images/lock.png"
              alt=""
              className="w-3 aspect-square inline mr-1 mt-[-3px]"
            />
            Messages are end-to-end encrypted. No one outside of this chat, not
            even chess2.com, can read them.
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
        {isTyping && (
          <div className="bg-white p-2 w-fit px-[15px] rounded-lg rounded-bl-none">
            <div className="typing">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="w-full relative flex gap-2 p-2">
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
    </div>
  );
}

export default ChatInGame;
