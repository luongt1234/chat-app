const message = require("../models/message.model");
const User = require("../models/user.model")

const messageController = {
    getUsersforSidebar: async (req, res) => {
        try {
            const loggedInUserID = req.user._id;
            const filteredUsers = await User.find({ _id: { $ne: loggedInUserID } }).select("-password");
            res.status(200).json(filteredUsers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "server error" })
        }
    },
    getMessages: async (req, res) => {
        try {
            const { id: userToChatId } = req.params;
            const myId = req.user._id;

            const message = await message.find({
                $or: [
                    { senderId: myId, receiverID: userToChatId },
                    { senderId: userToChatId, receiverID: myId }
                ]
            });
            res.status(200).json(message)
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "server error"});
        }
    }
}

module.exports = messageController;