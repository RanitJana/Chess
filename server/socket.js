import { Server } from "socket.io";
import { _env } from "./constants.js";
import jwt from "jsonwebtoken";
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
      userIdsave = userId;
      io.emit("online-user", onlineUsers);
    });

    // Mark user as online

    let roomId; // To track which room this socket belongs to

    // Increment total online when a user connects
    totalOnline++;
    io.emit("total-online", totalOnline); // Broadcast the updated total

    // Handle room joining
    socket.on("join-game", (gameId) => {
      roomId = gameId; // Assign the room ID
      socket.join(gameId); // Join the specific game room
    });
    socket.on("new-message", (info) => {
      socket.to(roomId).emit("receive-new-message", info);
    });
    socket.on("chat-reaction", info => {
      socket.to(roomId).emit("chat-reaction-receiver", info);
    })

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
      totalOnline--;
      if (userIdsave) delete onlineUsers[userIdsave];

      io.emit("online-user", onlineUsers);
      io.emit("total-online", totalOnline); // Broadcast the updated total

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
