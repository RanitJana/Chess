import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
