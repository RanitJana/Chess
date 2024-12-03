import "dotenv/config";
import app from "./app.js";
import { _env } from "./constants.js";

import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    console.log("DB connection succesful\n");

    const port = _env.PORT | 3000;

    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
      },
    });

    io.on("connection", (socket) => {
      console.log("a user connected", socket.id);
      socket.on("hi", (value) => {
        console.log(value);
      });
    });

    server.listen(port, () => {
      console.log(`Server started at port : ${port}\nhttp://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("DB connection failed");
  });
