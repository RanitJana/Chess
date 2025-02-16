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
      default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },

    moves: {
      type: [String],
      default: [],
    },

    winner: {
      type: String,
      enum: ["white", "black", "draw", null],
      default: null,
    },

    score: {
      white: {
        type: Number,
        default: 0,
      },
      black: {
        type: Number,
        default: 0,
      },
    },

    winReason: {
      type: String,
      enum: [
        "by checkmate",
        "by draw",
        "by white resigns",
        "by black resigns",
        "by stalemate",
        null,
      ],
      default: null,
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

gameSchema.index({ player1: 1 });
gameSchema.index({ player2: 1 });

const Game = model("Game", gameSchema);

export default Game;
