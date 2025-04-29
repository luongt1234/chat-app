const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mogodbDB = {
    connectDB: async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URL);
            console.log(`mogoose connecting... ${conn.connection.host}`)
        } catch (error) {
            console.log("mongo not connect");
        }
    }
}

module.exports = mogodbDB;