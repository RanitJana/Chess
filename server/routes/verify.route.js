import express from "express";
import { verify } from "../controllers/auth.controller.js";
import verifyPlayer from "../middlewares/verify.player.js";

const router = express.Router();

router.post("/", verifyPlayer, verify);

export default router;
