/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ChessBoard from "../components/ChessBoard.jsx";
import ChatInGame from "../components/ChatInGame.jsx";

export default function Game() {
  const [opponent, setOpponent] = useState(null);
  return (
    <div className="relative w-full h-[100dvh] min-h-fit overflow-scroll flex items-center justify-center gap-8 flex-wrap p-4">
      <ChessBoard setOpponent={setOpponent} />
      <ChatInGame opponent={opponent} />
    </div>
  );
}
