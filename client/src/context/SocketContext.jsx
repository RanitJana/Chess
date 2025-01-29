/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket.js";
import { useAuthContext } from "./AuthContext.jsx";

const socketContext = createContext();

export function useSocketContext() {
  return useContext(socketContext);
}

//this context will hold the all games information that'll be shown in UI
export default function SocketContext({ children }) {
  const { playerInfo } = useAuthContext();
  const [totalOnline, setTotalOnline] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (playerInfo) socket.emit("add-online-user", playerInfo._id);
  }, [playerInfo]);

  useEffect(() => {
    const handleOnlineOfflineEvents = ({ onlineUsers }) => {
      setTotalOnline(Object.keys(onlineUsers).length);
      setOnlineUsers(onlineUsers);
    };
    socket.on("online-user", handleOnlineOfflineEvents);

    return () => socket.off("online-user", handleOnlineOfflineEvents);
  }, []);

  return (
    <socketContext.Provider value={{ totalOnline, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
}
