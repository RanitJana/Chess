import express from "express";
import verifyPlayer from "../middlewares/verify.player.js";
import {
  handleGetMessage,
  handlePostMessage,
  handleReaction,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", verifyPlayer, handlePostMessage);
router.get("/:gameId", verifyPlayer, handleGetMessage);
router.put("/:messageId", verifyPlayer, handleReaction);

export default router;
