import AsyncHandler from "../utils/AsyncHandler.js";
import playarSchema from "../models/player.model.js";
import friendSchema from "../models/friend.model.js";
import gameSchema from "../models/game.model.js";
import { cookieOptions } from "../constants.js";

import axios from "axios";

const handleLogin = async function (player, res) {
  const accessToken = await player.generateAccessToken();
  const refreshToken = await player.generateRefreshToken();

  player.refreshToken = refreshToken;

  await player.save({ validateBeforeSave: false });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const totalGamesToday = await gameSchema.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const friendsCount = await friendSchema.countDocuments({
    $or: [
      { sender: player._id, accept: true },
      { receiver: player._id, accept: true },
    ],
  });

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .status(200)
    .json({
      success: true,
      message: "Login successful",
      player: {
        _id: player._id,
        name: player.name,
        email: player.email,
        rating: player.rating,
        avatar: player.avatar,
        about: player.about,
        createdAt: player.createdAt,
        updatedAt: player.updatedAt,
        friendsCount,
        views: player.views,
        lastSeen: player.lastSeen,
        totalGamesToday,
        nationality: player.nationality,
      },
    });
};

const googleLogin = AsyncHandler(async (req, res, _) => {
  const { accessToken } = req.body;

  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
  );

  const email = data.email;
  const name = data.name;

  const player = await playarSchema.findOne({ email });

  //sign up
  if (!player) await playarSchema.create({ email, name, isOAuthUser: true });

  return handleLogin(player, res);
});

export { googleLogin };
