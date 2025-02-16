/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ChatInGame from "../chat/ChatInGame.jsx";
import Moves from "./Moves.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import GameAction from "./GameAction.jsx";
import { useGameContext } from "../../pages/Game.jsx";

function Tab({ isActive, label, onClick }) {
  return (
    <li
      className={`relative px-6 py-2 text-white border-b-[3px] transition ${
        isActive ? "border-white" : "border-transparent"
      } hover:cursor-pointer hover:bg-blackLight`}
      onClick={onClick}
    >
      {label}
    </li>
  );
}

function GameSideSection() {
  const { users } = useGameContext();

  const { playerInfo } = useAuthContext();
  const [activeTab, setActiveTab] = useState(0);
  const [isViewer, setIsViewer] = useState(true);

  useEffect(() => {
    if (
      !(playerInfo._id != users.you?._id && playerInfo._id != users.opponent?._id)
    )
      setIsViewer(false);
  }, [users, playerInfo]);

  const renderContent = () => {
    if (isViewer) return <Moves />;

    switch (activeTab) {
      case 1:
        return <GameAction />;
      case 2:
        return <ChatInGame />;
      default:
        return <Moves />;
    }
  };

  return (
    <div className="relative md:h-full md:max-h-[37rem] h-dvh w-full min-h-[35rem] py-[4px] bg-[rgb(39,37,35)] rounded-md flex flex-col">
      <ul className="flex w-full border-b border-[rgba(255,255,255,0.16)] text-sm">
        <Tab
          isActive={activeTab === 0}
          label="Moves"
          onClick={() => setActiveTab(0)}
        />
        {!isViewer && (
          <Tab
            isActive={activeTab === 1}
            label="Action"
            onClick={() => setActiveTab(1)}
          />
        )}
        {!isViewer && (
          <Tab
            isActive={activeTab === 2}
            label="Chat"
            onClick={() => setActiveTab(2)}
          />
        )}
      </ul>
      <div className="overflow-y-scroll h-full">{renderContent()}</div>
    </div>
  );
}

export default GameSideSection;
