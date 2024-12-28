// import playerSchema from "../models/player.model.js";
import friendSchema from "../models/friend.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const acceptFriendRequest = AsyncHandler(async (req, res, _) => {

    const { modelId } = req.body;

    if (!modelId) return res.status(400).json({
        success: false,
        message: "Please do valid request."
    })

    let friend = await friendSchema.findById(modelId);

    if (!friend) return res.status(400).json({
        success: false,
        message: "Invalid request"
    })

    friend.accept = true;
    await friend.save();

    return res.status(200).json({
        success: true,
        message: "Accepted",
        friend
    })

})

const rejectFriendRequest = AsyncHandler(async (req, res, _) => {
    const { modelId } = req.body;
    if (!modelId) return res.status(400).json({
        success: false,
        message: "Please delete valid request."
    })

    await friendSchema.findByIdAndDelete(modelId);

    return res.status(200).json({
        success: true,
        message: "Rejected!"
    })

})

const getFriends = AsyncHandler(async (req, res, _) => {
    const { _id } = req.player;
    const friends = await friendSchema
        .find({
            $or: [{ sender: _id }, { receiver: _id }]
        })
        .populate("sender", "name _id rating");
    return res.status(200).json({
        success: true,
        message: "Succesful",
        friends
    })
})

const sendFriendRequest = AsyncHandler(async (req, res) => {
    const { sender, receiver } = req.body;

    if (!sender || !receiver) return res.status(400).json({
        success: false,
        message: "Invalid request"
    })

    let existingRequest = await friendSchema.findOne({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    })

    if (existingRequest) return res.status(200).json({
        success: false,
        message: existingRequest.accept ? "Already friends" : "Already friend request is sent",
        info: existingRequest
    })

    let newFriendReq = await friendSchema.create({ sender, receiver });

    return res.status(200).json({
        success: true,
        message: "request send successfully!",
        info: newFriendReq
    })

})

export { acceptFriendRequest, rejectFriendRequest, getFriends, sendFriendRequest }