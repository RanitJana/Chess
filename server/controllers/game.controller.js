import gameSchema from "../models/game.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const gameInit = AsyncHandler(async (req, res, _) => {
  const player = req.player;

  //search for a game which needs another player
  const games = await gameSchema.findOne({ player2: { $exists: false } });

  //create a new game
  if (!games) {
    let newGame = await gameSchema.create({ player1: player._id });
    newGame.player1 = null;

    return res.status(200).json({
      success: true,
      message: "Waiting for opponent",
      info: newGame,
    });
  }

  if (games.player1._id.toString() == player._id.toString())
    return res.status(300).json({
      success: false,
      message: "Searching for an opponent",
    });

  //found a game
  games.player2 = player._id;

  await games.save();
  games.player2 = null;
  await games.populate("player1", "name _id");

  return res.status(200).json({
    success: true,
    message: "Game started",
    info: games,
  });
});

const gameMove = AsyncHandler(async (req, res, _) => {
  //get gameid,board and moves-array from user
  let { moves, gameId, board } = req.body;

  let game = await gameSchema.findById(gameId);

  moves = moves.map((val) => JSON.stringify(val));

  //board must be in string format ans moves in array
  game.set("moves", moves);
  //assuming the board is already rotated if the player er black(from frontend)
  game.board = board;

  game.userMove = !game.userMove;

  //save the info
  await game.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Success",
    info: {
      game,
    },
  });
});

//get all games for a user
const gameOngoing = AsyncHandler(async (req, res, _) => {
  const { userId } = req.params;

  if (!userId)
    return res.status(400).json({
      success: true,
      message: "Successful",
      info: [],
    });

  let games = await gameSchema
    .find({
      $and: [
        { $or: [{ player1: userId }, { player2: userId }] },
        { winner: 0 },
      ],
    })
    .populate("player1", "name _id")
    .populate("player2", "name _id");

  //nullify the player which mathces with requested user
  games = games.map((game) => {
    if (game.player1._id.toString() == userId.toString()) game.player1 = null;
    else if (game.player2._id.toString() == userId.toString())
      game.player2 = null;

    game.moves = game.moves.length;

    return game;
  });
  games.reverse();

  //return the info
  return res.status(200).json({
    success: true,
    message: "Successful",
    info: games,
  });
});

const gameDone = AsyncHandler(async (req, res, _) => {
  const { total, userId } = req.params;

  // Query to find games based on player and winner
  const query = {
    $and: [
      { $or: [{ player1: userId }, { player2: userId }] },
      { $nor: [{ winner: 0 }] },
    ],
  };

  // Get the total document count
  const totalDocuments = await gameSchema.countDocuments(query);

  // Fetch games and sort them by createdAt (most recent first)
  let games = await gameSchema
    .find(query)
    .sort({ createdAt: -1 })
    .limit(total ? parseInt(total) : undefined)
    .populate("player1", "name _id rating")
    .populate("player2", "name _id rating");

  const gameRequiredInfo = games.map((value) => ({
    board: value.board,
    updatedAt: value.updatedAt,
    totalMoves: value.moves.length,
    _id: value._id,
    player1: {
      name: value.player1.name,
      _id: value.player1._id,
      rating: value.player1.rating,
      won: value.winner == 1,
      draw: value.winner == 3,
    },
    player2: {
      name: value.player2.name,
      _id: value.player2._id,
      rating: value.player2.rating,
      won: value.winner == 2,
      draw: value.winner == 3,
    },
  }));

  return res.status(200).json({
    success: true,
    message: "Successful",
    info: gameRequiredInfo,
    totalDocuments,
  });
});

//get a single game's info for a user
const gameInfoSingle = AsyncHandler(async (req, res, _) => {
  //get game id
  const gameId = req.params.gameId;

  //search for the game
  const game = await gameSchema
    .findById(gameId)
    .populate("player1", "name _id rating")
    .populate("player2", "name _id rating");

  //if game id is invalid or game is not found
  if (!game)
    return res.status(400).json({
      success: false,
      message: "Game not found",
    });

  let board = game.board.split("").join("");

  //if the player is 1 then he is white otherwiese black
  if (game.player1._id.toString() == req.player._id.toString()) {
    game.board = board;
    return res.status(200).json({
      success: true,
      message: "Game found",
      info: {
        color: "white",
        game,
      },
    });
  }

  //reverse the board for black
  board = board.split("").reverse().join("");

  //
  game.board = board;

  //return info as black
  return res.status(200).json({
    success: true,
    message: "Game found",
    info: {
      color: "black",
      game,
    },
  });
});

const gameEnd = AsyncHandler(async (req, res, _) => {
  let { winner, gameId } = req.body;

  let game = await gameSchema.findById(gameId);

  game.winner = winner;

  //save the info
  await game.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "Success",
  });
});

export { gameInit, gameMove, gameOngoing, gameDone, gameInfoSingle, gameEnd };
