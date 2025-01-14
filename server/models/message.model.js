import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mentionText: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    reaction: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "Player",
          },
          symbol: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
