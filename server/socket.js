import { Server } from "socket.io";
import { _env } from "./constants.js";
import playerSchema from "./models/player.model.js";

const chatSection = function (socket, roomId) {
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
};

const challangeSection = function (socket, userSockets) {
  //challange send
  socket.on("send-challange", (info) => {
    const { game, userId } = info;
    const socketId = userSockets.get(userId);
    socket.to(socketId).emit("receive-challange", game);
  });

  //challange reject
  socket.on("reject-challange", (info) => {
    const { gameId, userId } = info;
    const socketId = userSockets.get(userId);
    socket.to(socketId).emit("delete-challange", gameId);
  });

  //challange accept
  socket.on("accept-challange", (info) => {
    const { game, userId } = info;
    const socketId = userSockets.get(userId);
    socket.to(socketId).emit("init-challange", game);
  });
};

const ongoingGameSection = function (socket, games) {
  socket.on("game-show", (gameId) => {
    socket.join(gameId);
    games.push(gameId);
  });

  socket.on("game-move", (gameId) => {
    socket.to(gameId).emit("update-game-preview", gameId);
  });
};

const ongoingGameSectionPreview = function (socket) {
  socket.on("move-done", (clearedBoard) => {
    socket.to(roomId).emit("opponent-move", clearedBoard);
  });
};

const addSocketOnline = function (io, socket, userIdsave, userSockets) {
  socket.on("add-online-user", (userId) => {
    userSockets.set(userId, socket.id); // Store mapping
    userIdsave.id = userId;
    // Convert the Map to a plain object before emitting
    io.emit("online-user", { onlineUsers: Object.fromEntries(userSockets) });
  });
};

const updateLastSeenUser = async function (io, userIdsave) {
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
};

const deleteSocketOnline = function (io, socket, userIdsave, userSockets) {
  socket.on("disconnect", async () => {
    userSockets.delete(userIdsave.id);

    io.emit("online-user", { onlineUsers: Object.fromEntries(userSockets) });

    //handle last seen
    await updateLastSeenUser(io, userIdsave.id);
  });
};

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

  const userSockets = new Map(); // Store userId -> socketId

  io.on("connection", (socket) => {
    // save user id which will act as key
    const userIdsave = { id: null };

    //handle socket online
    addSocketOnline(io, socket, userIdsave, userSockets);

    //handle chat in game
    let roomId;
    chatSection(socket, roomId);

    //handle challange ongoing
    challangeSection(socket, userSockets);

    //handle onging daily games
    let games = [];
    ongoingGameSection(socket, games);

    //handle ngoing daily games preview
    ongoingGameSectionPreview(socket);

    // Handle disconnection
    deleteSocketOnline(io, socket, userIdsave, userSockets);
  });
};

export default realTimeInit;
