import "dotenv/config";
import app from "./app.js";
import { _env } from "./constants.js";

import { createServer } from "http";
import connectDB from "./db/index.js";
import realTimeInit from "./socket.js";

connectDB()
  .then(() => {
    console.log("DB connection succesful\n");

    const port = _env.PORT || 3000;

    const server = createServer(app);

    realTimeInit(server);

    server.listen(port, () => {
      console.log(`Server started at port : ${port}\nhttp://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("DB connection failed");
  });
