const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Socket = require("./lib/socket")
// const mongoDB = require("./lib/db");


//routes
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const PORT = process.env.PORT || 3001;
const hostname = process.env.HOSTNAME || "hostname";

Socket.app.use(express.json());
Socket.app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
Socket.app.use(express.urlencoded({ extended: true }));
Socket.app.use(cookieParser());

Socket.app.use("/api/auth", authRoute);
Socket.app.use("/api/message", messageRoute);

Socket.server.listen(PORT, hostname, () => {
  console.log(`server is running on port http://${hostname}:${PORT}`);
});