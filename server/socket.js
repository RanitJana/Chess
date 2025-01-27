import { Server } from "socket.io";
import { _env } from "./constants.js";
import playerSchema from "./models/player.model.js";

const realTimeInit = function (server) {
  const io = new Server(server, {
    cors: {
      origin: _env.ORIGIN.split(","),
      credentials: true,
    },
    reconnection: true, // Reconnection is enabled
    reconnectionAttempts: 5, // Retry 5 times before giving up
    reconnectionDelay: 1000, // Wait 1 second between reconnection attempts
    timeout: 20000, // Wait up to 20 seconds for a connection before timing out
  });

  const onlineUsers = {};
  let totalOnline = 0;

  io.on("connection", (socket) => {
    let userIdsave = null; // Assume user ID is sent when connecting

    socket.on("add-online-user", (userId) => {
      onlineUsers[userId] = true;
      totalOnline = totalOnline + 1;
      userIdsave = userId;
      io.emit("online-user", { onlineUsers, totalOnline });
    });

    let roomId; // To track which room this socket belongs to

    // Handle room joining
    socket.on("join-game", (gameId) => {
      roomId = gameId; // Assign the room ID
      socket.join(gameId); // Join the specific game room
    });
    socket.on("new-message", (info) => {
      socket.to(roomId).emit("receive-new-message", info);
    });
    socket.on("chat-reaction", (info) => {
      socket.to(roomId).emit("chat-reaction-receiver", info);
    });
    socket.on("new-message-update-id", (info) => {
      socket.to(roomId).emit("new-message-update-id-user", info);
    });

    socket.on("typing", (value) => {
      socket.to(roomId).emit("server-typing", value);
    });

    socket.on("not-typing", (value) => {
      socket.to(roomId).emit("server-not-typing", value);
    });

    // Handle moves
    socket.on("move-done", (clearedBoard) => {
      // [board,movePieceInfo]
      socket.to(roomId).emit("opponent-move", clearedBoard);
    });

    let games = [];

    socket.on("game-show", (gameId) => {
      socket.join(gameId);
      games.push(gameId);
    });

    socket.on("game-move", (gameId) => {
      socket.to(gameId).emit("update-game-preview", gameId);
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      totalOnline = Math.max(0, totalOnline - 1);
      if (userIdsave) delete onlineUsers[userIdsave];

      io.emit("online-user", { onlineUsers, totalOnline });

      try {
        if (userIdsave) {
          io.emit("fix-time", userIdsave);
          await playerSchema.findOneAndUpdate(
            { _id: userIdsave },
            { lastSeen: Date.now() }
          );
        }
      } catch (error) {
        console.error("Error while handling cookies:", error);
      }
    });
  });
};

export default realTimeInit;
