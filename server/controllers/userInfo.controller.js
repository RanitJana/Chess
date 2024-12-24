import playerSchema from "../models/player.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const handlePlayerDetails = AsyncHandler(async (req, res, _) => {
  const { userId } = req.params;
  const player = await playerSchema.findById(userId);

  if (!player)
    return res.status(401).json({
      success: false,
      message: "Please login first",
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
      friends: player.friends,
      views: player.views,
    },
  });
});

export { handlePlayerDetails };
