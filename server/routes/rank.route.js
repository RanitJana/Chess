import express from "express";
import verifyPlayer from "../middlewares/verify.player.js";
import { handleRank } from "../controllers/rank.controller.js";

const router = express.Router();

router.get("/", verifyPlayer, handleRank);

export default router;
