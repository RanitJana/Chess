import express from "express";
import verifyPlayer from "../middlewares/verify.player.js";
import { handleSearch } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", verifyPlayer, handleSearch);

export default router;
