const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser")

const utils = {
    generateToken: (userid, res) => {
        const token = jwt.sign({userid}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("jwt", token, {
            maxAge: 7*24 *60 *60 * 1000,
            httpOnly: true,
            sameSite: "Strict",
            secure: false
        })
        return token;
    }

}

module.exports = utils;