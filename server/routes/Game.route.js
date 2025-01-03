import express from "express";
import {
  gameInit,
  gameMove,
  gameOngoing,
  gameDone,
  gameInfoSingle,
  gameEnd,
} from "../controllers/game.controller.js";
import verifyPlayer from "../middlewares/verify.player.js";

const router = express.Router();

router.post("/init", verifyPlayer, gameInit);
router.post("/move", verifyPlayer, gameMove);
router.get("/ongoing/:userId", verifyPlayer, gameOngoing);
router.get("/done/:userId/:total", verifyPlayer, gameDone);
router.get("/info/:gameId", verifyPlayer, gameInfoSingle);
router.post("/end", verifyPlayer, gameEnd);

export default router;
