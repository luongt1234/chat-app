const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = {
    protectRoute: async (req, res, next) => {
        try {
            const token = req.cookies.jwt;

            if (!token) return res.status(401).json({message: "token not exist"});
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) return res.status(401).json({message: "Unauthorized - invaild Token"});
            // console.log(decoded);
            const user = await User.findById(decoded.userid).select("-password");
            if (!user) return res.status(401).json({message: "user not found"});

            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(400).json("server error");
        }
    }
} 

module.exports = authMiddleware;