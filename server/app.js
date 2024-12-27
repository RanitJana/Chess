import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { _env } from "./constants.js";

const app = express();

const origins = _env.ORIGIN.split(",");

app.use(
  cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Home route hit",
  });
});

import login from "./routes/login.route.js";
import signup from "./routes/signup.route.js";
import logout from "./routes/logout.route.js";
import game from "./routes/Game.route.js";
import verify from "./routes/verify.route.js";
import message from "./routes/message.route.js";
import userInfo from "./routes/UserInfo.route.js";
import friends from "./routes/friend.route.js";

app.use("/api/v1/login", login);
app.use("/api/v1/signup", signup);
app.use("/api/v1/logout", logout);
app.use("/api/v1/game", game);
app.use("/api/v1/message", message);
app.use("/api/v1/verify", verify);
app.use("/api/v1/user/info", userInfo);
app.use("/api/v1/friend", friends);

export default app;
