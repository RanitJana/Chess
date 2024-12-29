import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { _env } from "../constants.js";

const playerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      default: 200,
    },
    friends: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Player",
        },
      ],
    },
    views: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      default: "Chess is the gymnasium of the mind.",
    },
    refreshToken: {
      type: String,
      trim: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

playerSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      avatar: this.avatar,
      rating: this.rating,
    },
    _env.ACCESS_TOKEN_SEC,
    {
      expiresIn: _env.ACCESS_TOKEN_EXP,
    }
  );
};

playerSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    _env.REFRESH_TOKEN_SEC,
    {
      expiresIn: _env.REFRESH_TOKEN_EXP,
    }
  );
};

playerSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

playerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  return next();
});

const Player = model("Player", playerSchema);

export default Player;
