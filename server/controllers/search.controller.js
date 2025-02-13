import playerSchema from "../models/player.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const handleSearch = AsyncHandler(async (req, res, _) => {
  const { username } = req.query;

  if (!username)
    return res.status(400).json({
      success: true,
      message: "Invalid request",
      users: [],
    });

  const users = await playerSchema
    .find({
      name: {
        $regex: username,
        $options: "i",
      },
    })
    .select("_id name nationality rating");

  return res.status(200).json({
    success: true,
    message: "found some",
    users,
  });
});

export { handleSearch };
