import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { _env } from "./constants.js";

const app = express();

const origins = _env.ORIGIN.split(",");

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    origin: origins,
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

app.use("/api/v1/login", login);
app.use("/api/v1/signup", signup);
app.use("/api/v1/logout", logout);

export default app;