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
      // "       k      pp    Q                                          K"
    },

    caslingRights: {
      type: String,
      default: "KQkq",
    },

    enPassant: {
      position: {
        row: {
          type: Number,
          default: -1,
        },
        col: {
          type: Number,
          default: -1,
        },
      },
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

    turn: {
      type: String,
      enum: ["white", "black"],
      default: "white",
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
