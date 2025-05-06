const Message = require("../models/message.model");
const User = require("../models/user.model");
const Socket = require("../lib/socket");

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
        // console.log(req.params);
        try {
            const { id: userToChatId } = req.params;
            const myId = req.user._id;

            const message = await Message.find({
                $or: [
                    { senderId: myId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: myId }
                ]
            });
            res.status(200).json(message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "server error" });
        }
    },
    sendMessage: async (req, res) => {
        try {
            const { id: userToChatId } = req.params;
            const myId = req.user._id;
            const { text, image } = req.body;

            let imageUrl;
            if (image) {
                // Upload base64 image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            }

            const newMessage = new Message({
                senderId: myId,
                receiverId: userToChatId,
                text: text,
                image: imageUrl
            })

            await newMessage.save();

            const receiverSocketId = Socket.getReceiverSocketId(userToChatId);
            if (receiverSocketId) {
                Socket.io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            res.status(201).json(newMessage);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "server error" });
        }
    }
}

module.exports = messageController;