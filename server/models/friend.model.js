import { Schema, model } from "mongoose";

const friendSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "Player"
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "Player"
        },
        accept: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

const Friend = model("Friend", friendSchema);

export default Friend;