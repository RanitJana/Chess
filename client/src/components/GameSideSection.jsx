/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import ChatInGame from "./ChatInGame.jsx";
import Moves from "./Moves.jsx";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import { decryptMessage } from "../utils/encryptDecryptMessage.js";
import { messageGet } from "../api/message.js";
import { socket } from "../socket.js";

function Tab({ isActive, label, onClick, newMessageCount }) {
  return (
    <li
      className={`relative px-4 py-2 text-white border-b-4 transition ${
        isActive ? "border-white" : "border-transparent"
      } cursor-pointer`}
      onClick={onClick}
    >
      {label == "Chat" && newMessageCount > 0 ? (
        <div className="absolute top-0 right-0 aspect-square h-5 rounded-full flex justify-center items-center text-[10px] bg-red-500 translate-x-2">
          {newMessageCount}
        </div>
      ) : (
        ""
      )}
      {label}
    </li>
  );
}

function GameSideSection() {
  const [activeTab, setActiveTab] = useState(0);

  const { gameId } = useParams();

  // { senderId: '674dbfff3b2690acf11ad9cb', message: 'Hey' },
  const [allMessage, setAllMessage] = useState(null);

  const chatSectionRef = useRef(null);

  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        let response = await messageGet(gameId);
        console.log(response);
        if (response) {
          const { success, info } = response.data;
          if (success) {
            setAllMessage(() => {
              return info.map((value) => ({
                senderId: value.senderId,
                message: decryptMessage(value.content),
              }));
            });
          } else setAllMessage([]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Please try to refresh the page");
      }
    })();
  }, [gameId]);

  useEffect(() => {
    const handleReceiveMessage = (info) => {
      const { senderId, message } = info;
      setNewMessageCount((prev) => prev + 1);
      setAllMessage((prev) => [
        ...prev,
        { senderId, message: decryptMessage(message) },
      ]);
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

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <ChatInGame
            allMessage={allMessage}
            setAllMessage={setAllMessage}
            gameId={gameId}
            chatSectionRef={chatSectionRef}
            setNewMessageCount={setNewMessageCount}
          />
        );
      default:
        return <Moves />;
    }
  };

  return (
    <div className="relative h-[38.5rem] w-[100dvw] max-w-[35rem] max-h-[35rem] py-[4px] bg-[rgb(39,37,35)] rounded-md flex flex-col">
      <ul className="flex w-full border-b border-[rgba(255,255,255,0.16)]">
        <Tab
          isActive={activeTab === 0}
          label="Moves"
          onClick={() => setActiveTab(0)}
          newMessageCount={newMessageCount}
        />
        <Tab
          isActive={activeTab === 1}
          label="Chat"
          onClick={() => setActiveTab(1)}
          newMessageCount={newMessageCount}
        />
      </ul>
      <div className="overflow-y-scroll h-full">{renderContent()}</div>
      <div className="flex gap-2 min-h-fit p-2">
        <button className="bg-blackDarkest shadow-sm px-4 text-white py-2 rounded-sm w-[8rem]">
          Back
        </button>
        <button className="bg-blackDarkest shadow-sm px-4 text-white py-2 rounded-sm w-[8rem]">
          Forward
        </button>
      </div>
    </div>
  );
}

export default GameSideSection;
