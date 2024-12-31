/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import ChatInGame from "./ChatInGame.jsx";
import Moves from "./Moves.jsx";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import { decryptMessage } from "../utils/encryptDecryptMessage.js";
import { messageGet } from "../api/message.js";
import { socket } from "../socket.js";

function Tab({ isActive, label, onClick }) {
  return (
    <li
      className={`relative px-8 py-2 text-white border-b-[3px] transition ${
        isActive ? "border-white" : "border-transparent"
      } cursor-pointer`}
      onClick={onClick}
    >
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

  useEffect(() => {
    (async () => {
      try {
        let response = await messageGet(gameId);

        if (response) {
          const { success, info } = response.data;
          if (success) {
            setAllMessage(() => {
              return info.map((value) => ({
                senderId: value.senderId,
                message: decryptMessage(value.content),
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
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
      setAllMessage((prev) => [
        ...prev,
        {
          senderId,
          message: decryptMessage(message),
          updatedAt: Date.now(),
          createdAt: Date.now(),
        },
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
          />
        );
      default:
        return <Moves />;
    }
  };

  return (
    <div className="relative h-[40rem] w-[100dvw] lg-976:w-[27rem] max-h-[92%] min-h-[35rem] py-[4px] bg-[rgb(39,37,35)] rounded-md flex flex-col">
      <ul className="flex w-full border-b border-[rgba(255,255,255,0.16)]">
        <Tab
          isActive={activeTab === 0}
          label="Moves"
          onClick={() => setActiveTab(0)}
        />
        <Tab
          isActive={activeTab === 1}
          label="Chat"
          onClick={() => setActiveTab(1)}
        />
      </ul>
      <div className="overflow-y-scroll h-full">{renderContent()}</div>
      <div className="flex gap-2 justify-between min-h-fit p-2 bg-[rgb(33,32,29)]">
        <button className="group relative flex items-center justify-center gap-1 bg-[rgb(57,54,52)] shadow-sm px-4 text-white rounded-md text-[0.8rem] w-[5rem] h-[2.1rem]">
          <img
            src="/images/arrow.png"
            className="w-[0.8rem] rotate-180"
            alt="Back"
          />
          <span>Previous</span>
        </button>
        <button className="group relative flex items-center justify-center gap-1 bg-[rgb(57,54,52)] shadow-sm px-4 text-white rounded-md text-[0.8rem] w-[5rem] h-[2.1rem]">
          <span>Next</span>
          <img src="/images/arrow.png" className="w-[0.8rem]" alt="Back" />
        </button>
      </div>
    </div>
  );
}

export default GameSideSection;
