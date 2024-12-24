import express from "express";
import { handlePlayerDetails } from "../controllers/userInfo.controller.js";
import verifyPlayer from "../middlewares/verify.player.js";

const router = express.Router();

router.get("/:userId", verifyPlayer, handlePlayerDetails);

export default router;
