import express from "express";
import {
  gameInit,
  gameMove,
  gameInfo,
  gameInfoSingle,
} from "../controllers/game.controller.js";
import verifyPlayer from "../middlewares/verify.player.js";

const router = express.Router();

router.post("/init", verifyPlayer, gameInit);
router.post("/move", verifyPlayer, gameMove);
router.get("/info", verifyPlayer, gameInfo);
router.get("/info/:gameId", verifyPlayer, gameInfoSingle);

export default router;
