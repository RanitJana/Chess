import AsyncHandler from "../utils/AsyncHandler.js";
import playarSchema from "../models/player.model.js";

const login = AsyncHandler(async (req, res, _) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: "Please fill the required fields",
    });

  let player = await playarSchema.findOne({ email });

  if (!player)
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });

  if (!(await player.matchPassword(password)))
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });

  const accessToken = await player.generateAccessToken();
  const refreshToken = await player.generateRefreshToken();

  player.refreshToken = refreshToken;

  await player.save({ validateBeforeSave: false });

  return res.cookie("accessToken", accessToken).status(200).json({
    success: true,
    message: "Login successful",
  });
});
const signup = AsyncHandler(async (req, res, _) => {
  const { email, password, confirmPassword, name } = req.body;

  if (!email || !password || !confirmPassword || !name)
    return res.status(400).json({
      success: false,
      message: "Please fill the required fields",
    });

  if (password !== confirmPassword)
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });

  let player = await playarSchema.findOne({ email });

  if (player)
    return res.status(400).json({
      success: false,
      message: "User already exist",
    });

  await playarSchema.create({ email, password, name });

  return res.status(200).json({
    success: true,
    message: "Account created",
  });
});
const logout = AsyncHandler(async (req, res, _) => {
  const player = req.player;
  player.refreshToken = "";

  await player.save({ validateBeforeSave: false });

  return res.clearCookie("accessToken").status(200).json({
    success: true,
    message: "Logged out succesfully",
  });
});

const verify = AsyncHandler(async (req, res, _) => {
  return res.status(200).json({
    success: true,
    message: "Verified",
  });
});

export { login, signup, logout, verify };
