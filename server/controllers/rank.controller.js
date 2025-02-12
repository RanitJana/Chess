import playerSchema from "../models/player.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const handleRank = AsyncHandler(async (req, res) => {
  let { page, count } = req.query;

  page = parseInt(page, 10);
  count = parseInt(count, 10);

  if (!page || !count || page < 1 || count < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid page or count. Must be positive numbers.",
    });
  }

  const users = await playerSchema
    .find()
    .sort({ rating: -1, _id: 1 }) // Sort by rating DESC, then by _id ASC
    .skip((page - 1) * count)
    .limit(count)
    .select("_id name nationality rating")
    .lean();

  const totalPlayers = await playerSchema.countDocuments();

  return res.status(200).json({
    success: true,
    message: "Found",
    info: {
      users,
      total: totalPlayers,
    },
  });
});

export { handleRank };
