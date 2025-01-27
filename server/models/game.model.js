import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    //white player
    player1: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },

    //black player
    player2: {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },

    board: {
      type: String,
      default:
        "rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR",
    },

    moves: {
      type: [String],
      default: [],
    },

    winner: {
      type: Number,
      default: 0,
    },

    userMove: {
      type: Number,
      default: 0,
    },

    isGameStarted: {
      type: Boolean,
      default: false,
    },

    withRandom: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Game = model("Game", gameSchema);

export default Game;
