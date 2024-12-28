import verifyPlayer from "../middlewares/verify.player.js";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  sendFriendRequest,
} from "../controllers/friend.controller.js";
import express from "express";

const router = express.Router();

router.post("/send", verifyPlayer, sendFriendRequest);
router.get("/all", verifyPlayer, getFriends);
router.put("/accept", verifyPlayer, acceptFriendRequest);
router.put("/reject", verifyPlayer, rejectFriendRequest);

export default router;
