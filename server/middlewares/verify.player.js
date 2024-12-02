import AsyncHandler from "../utils/AsyncHandler.js";
import playerSchema from "../models/player.model.js";
import jwt from "jsonwebtoken";
import { _env } from "../constants.js";

const verifyPlayer = AsyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken)
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });

  try {
    const decodedAccessToken = await jwt.verify(
      accessToken,
      _env.ACCESS_TOKEN_SEC
    );

    const _id = decodedAccessToken._id;

    if (!_id)
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });

    const player = await playerSchema.findById(_id);

    if (!player)
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });

    req.player = player;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again",
      });
    throw error;
  }
});

export default verifyPlayer;
