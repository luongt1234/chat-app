const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const utils = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");

const authController = {
    signup: async (req, res) => {
        const {fullName, email, password} = req.body;
        try {
            if (!fullName || !email || !password) {
                res.status(401).json({message: "fill to full information"})
            }
            if (password.length < 6) {
                return res.status(401).json({message: "password must be a least 6 characters"});
            }

            const user = await User.findOne({email});
            if (user) return res.status(401).json({message : "email alreafy exists"});
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                fullName: fullName,
                email: email,
                password: hashPassword
            })

            if (newUser) {
                utils.generateToken(newUser._id, res);
                await newUser.save();
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                });
            } else {
                res.status(402).json({message: "invalid user data"})
            }

            
        } catch (error) {
            console.log(error);
            res.status(400).json({message: "server error"});
        }
    },
    login: async (req, res) => {
        const {email, password} = req.body;
        try {
            const user = await User.findOne({email});
            if (!user) return res.status(401).json({message: "user not exist"});
            const isPasswordCorect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorect) return res.status(401).json({message: "password is not correct"});
            
            utils.generateToken(user._id, res);
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({messsage: "server error"})
        }
    },
    logout: (req, res) => {
        try {
            res.cookie("jwt", "", {maxAge: 0});
            res.status(200).json({message: "Logged out Successfully"});
        } catch (error) {
            console.log(error);
            res.status(400).json({message: "server error"})
        }
    },
    updateProfile: async (req, res) => {
        try {
            const {profilePic} = req.body;
            const userid = req.user._id;

            if (!profilePic) return res.status(401).json({message: "Profile pic is required"});

            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            const updateUser = await User.findByIdAndUpdate(userid, {profilePic: uploadResponse.secure_url}, {new: true});

            res.status(200).json({message: "update successful"});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "server error"})
        }
    }
}

module.exports = authController;