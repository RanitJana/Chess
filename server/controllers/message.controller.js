import AsyncHandler from "../utils/AsyncHandler.js";
import conversationShema from "../models/conversation.model.js";
import messageSchema from "../models/message.model.js";
import playerSchema from "../models/player.model.js";
import gameSchema from "../models/game.model.js";

const handlePostMessage = AsyncHandler(async (req, res, _) => {
  const player = req.player;
  const { receiverId, content, gameId, mentionText } = req.body;

  if (!receiverId || !content || !gameId)
    return res.status(400).json({
      success: false,
      message: "Invalid requeset",
    });

  const isReceiverValid = await playerSchema.findById(receiverId);

  if (!isReceiverValid)
    return res.status(400).json({
      success: false,
      message: "Invalid receiver id",
    });

  const isGameValid = await gameSchema.findById(gameId);

  if (!isGameValid)
    return res.status(400).json({
      success: false,
      message: "Invalid game id",
    });

  const message = await messageSchema.create({
    senderId: player._id,
    receiverId,
    content,
    mentionText,
  });

  let conversation = await conversationShema.findOne({ game: gameId });

  if (!conversation) {
    conversation = await conversationShema.create({
      game: gameId,
      messages: [message._id],
    });
  } else {
    conversation.messages.push(message._id);
    await conversation.save({ validateBeforeSave: false });
  }

  return res.status(200).json({
    success: true,
    message: "Success",
    messageId: message._id,
  });
});

const handleGetMessage = AsyncHandler(async (req, res, _) => {
  const { gameId } = req.params;
  const { lengthNow } = req.query; // Number of messages the frontend already has

  const isGameValid = await gameSchema.findById(gameId);

  if (!isGameValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid game id",
    });
  }

  const conversation = await conversationShema.findOne({
    game: gameId,
  });

  if (!conversation) {
    return res.status(200).json({
      success: false,
      message: "Empty",
    });
  }

  // Ensure messages are sorted by createdAt (assuming older messages first)
  const totalMessages = await conversation.populate({
    path: "messages",
    select:
      "senderId receiverId content createdAt updatedAt reaction mentionText",
    populate: {
      path: "mentionText",
      select: "senderId content _id",
    },
  });

  const messages = totalMessages.messages;

  const totalLength = messages.length;
  const startIndex = Math.max(0, totalLength - lengthNow - 30); // Start index for the next 30 messages
  const endIndex = Math.max(0, totalLength - lengthNow); // End index

  const paginatedMessages = messages.slice(startIndex, endIndex);

  return res.status(200).json({
    success: true,
    message: "Success",
    info: paginatedMessages,
    hasMore: startIndex > 0, // Indicates if there are more messages to load
  });
});

const handleReaction = AsyncHandler(async (req, res, _) => {
  const { messageId } = req.params;
  if (!messageId)
    return res.status(400).json({
      success: false,
      message: "Invalid message id",
    });

  const { reaction } = req.body;

  if (!reaction)
    return res.status(200).json({
      success: false,
      message: "Invalid request",
    });

  let message = await messageSchema.findById(messageId);

  const index = message.reaction.findIndex(
    (value) => value.user.toString() === req.player._id.toString()
  );

  if (index !== -1) {
    if (message.reaction[index].symbol == reaction)
      message.reaction.splice(index, 1);
    else message.reaction[index].symbol = reaction;
  } else {
    message.reaction.push({ user: req.player._id, symbol: reaction });
  }

  await message.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    messgae: "Success",
    reaction: message.reaction,
  });
});

export { handleGetMessage, handlePostMessage, handleReaction };
