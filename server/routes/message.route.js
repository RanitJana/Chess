import express from "express";
import verifyPlayer from "../middlewares/verify.player.js";
import {
  handleGetMessage,
  handlePostMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", verifyPlayer, handlePostMessage);
router.get("/:gameId", verifyPlayer, handleGetMessage);

export default router;
