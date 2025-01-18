/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ChatInGame from "../chat/ChatInGame.jsx";
import Moves from "./Moves.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";

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

function GameSideSection({ players }) {
  const { playerInfo } = useAuthContext();
  const [activeTab, setActiveTab] = useState(1);
  const [isViewer, setIsViewer] = useState(true);

  useEffect(() => {
    if (
      !(
        playerInfo._id != players.player1._id &&
        playerInfo._id != players.player2._id
      )
    )
      setIsViewer(false);
  }, [players, playerInfo]);

  const renderContent = () => {
    if (isViewer) return <Moves />;

    switch (activeTab) {
      case 1:
        return <ChatInGame />;
      default:
        return <Moves />;
    }
  };

  return (
    <div className="relative md:h-full md:max-h-[37rem] h-dvh w-full min-h-[35rem] py-[4px] bg-[rgb(39,37,35)] rounded-md flex flex-col">
      <ul className="flex w-full border-b border-[rgba(255,255,255,0.16)]">
        <Tab
          isActive={activeTab === 0}
          label="Moves"
          onClick={() => setActiveTab(0)}
        />
        {!isViewer && (
          <Tab
            isActive={activeTab === 1}
            label="Chat"
            onClick={() => setActiveTab(1)}
          />
        )}
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
