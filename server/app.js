import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { _env } from "./constants.js";

const app = express();


const origins = _env.ORIGIN.split(',');

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  origin: origins
}));
app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Home route hit",
  });
});

export default app;
