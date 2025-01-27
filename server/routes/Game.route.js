import express from "express";
import {
  gameInit,
  gameMove,
  gameOngoing,
  gameDone,
  gameInfoSingle,
  gameEnd,
  gameDelete,
  gameChallanges,
  gameAccept,
} from "../controllers/game.controller.js";
import verifyPlayer from "../middlewares/verify.player.js";

const router = express.Router();

router.post("/init", verifyPlayer, gameInit);
router.post("/move", verifyPlayer, gameMove);
router.get("/ongoing/:userId", verifyPlayer, gameOngoing);
router.get("/done/:userId/:total", verifyPlayer, gameDone);
router.get("/info/:gameId", verifyPlayer, gameInfoSingle);
router.post("/end", verifyPlayer, gameEnd);

router.get("/challange/:userId", verifyPlayer, gameChallanges);
router.delete("/challange/:gameId", verifyPlayer, gameDelete);
router.put("/challange/:gameId", verifyPlayer, gameAccept);

export default router;
