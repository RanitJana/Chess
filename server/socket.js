import { Server } from "socket.io";

const realTimeInit = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  let totalOnline = 0;

  io.on("connection", (socket) => {
    let roomId; // To track which room this socket belongs to

    // Increment total online when a user connects
    totalOnline++;
    io.emit("total-online", totalOnline); // Broadcast the updated total

    // Handle room joining
    socket.on("join-game", (gameId) => {
      roomId = gameId; // Assign the room ID
      socket.join(gameId); // Join the specific game room
    });

    // Handle moves
    socket.on("move-done", (clearedBoard) => {
      // [board,movePieceInfo]
      socket.to(roomId).emit("opponent-move", clearedBoard);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      totalOnline--;
      io.emit("total-online", totalOnline); // Broadcast the updated total
    });
  });
};

export default realTimeInit;
