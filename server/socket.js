import { Server } from "socket.io";

const realTimeInit = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  let totalOnline = 0;

  io.on("connection", (socket) => {
    // Increment total online when a user connects
    totalOnline++;
    io.emit("total-online", totalOnline); // Broadcast the updated total

    // Decrement total online when a user disconnects
    socket.on("disconnect", () => {
      totalOnline--;
      io.emit("total-online", totalOnline); // Broadcast the updated total
    });

    // socket.on("game-init")
  });
};

export default realTimeInit;
