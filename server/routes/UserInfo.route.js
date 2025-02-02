import express from "express";
import {
  handlePlayerDetails,
  handleUpdatePlayer,
} from "../controllers/userInfo.controller.js";
import verifyPlayer from "../middlewares/verify.player.js";

const router = express.Router();

router.get("/:userId", verifyPlayer, handlePlayerDetails);
router.post("/", verifyPlayer, handleUpdatePlayer);

export default router;
