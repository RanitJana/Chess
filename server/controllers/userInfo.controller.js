import playerSchema from "../models/player.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import friendSchema from "../models/friend.model.js";

const handlePlayerDetails = AsyncHandler(async (req, res, _) => {
  const { userId } = req.params;
  const player = await playerSchema.findById(userId);

  if (!player)
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });

  const friend = await friendSchema.findOne({
    $or: [
      { sender: req.player._id, receiver: userId },
      { receiver: req.player._id, sender: userId },
    ],
  });
  const friendsCount = await friendSchema.countDocuments({
    $or: [
      { sender: userId, accept: true },
      { receiver: userId, accept: true },
    ],
  });
  return res.status(200).json({
    success: true,
    message: "Success",
    player: {
      _id: player._id,
      name: player.name,
      rating: player.rating,
      avatar: player.avatar,
      about: player.about,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
      friend,
      friendsCount,
      views: player.views,
      lastSeen: player.lastSeen,
      nationality: player.nationality,
      isOAuthUser: player.isOAuthUser,
    },
  });
});

const handleUpdatePlayer = AsyncHandler(async (req, res, _) => {
  const { name, email, about, nationality } = req.body;
  if (!name || !email || !about)
    return res.status(400).json({
      success: false,
      message: "All fields must be filled",
    });

  const player = req.player;

  const isAnotherPlayerSameEmail = await playerSchema.findOne({ email });

  if (
    isAnotherPlayerSameEmail &&
    isAnotherPlayerSameEmail._id.toString() != player._id.toString()
  )
    return res.status(400).json({
      success: false,
      message: "Email is already being by another user",
    });

  if (player.isOAuthUser)
    return res.status(400).json({
      success: false,
      message: "You can't change your email!",
    });

  player.name = name;
  player.email = email;
  player.about = about;
  player.nationality = nationality;

  await player.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    player: {
      name: player.name,
      email: player.email,
      about: player.about,
      nationality: player.nationality,
    },
  });
});

export { handlePlayerDetails, handleUpdatePlayer };
