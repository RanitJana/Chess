/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket.js";

const socketContext = createContext();

export function useSocketContext() {
  return useContext(socketContext);
}

//this context will hold the all games information that'll be shown in UI
export default function SocketContext({ children }) {
  //all games info array
  const [games, setGames] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("hi", "kire");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return <socketContext.Provider value={{}}>{children}</socketContext.Provider>;
}
