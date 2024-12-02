import express from "express";
import { logout } from "../controllers/auth.controller.js";
import verifyPlayer from "../middlewares/verify.player.js";

const router = express.Router();

router.post("/", verifyPlayer, logout);

export default router;
