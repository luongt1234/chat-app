const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// const mongoDB = require("./lib/db");


//routes
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const PORT = process.env.PORT || 300;
const hostname = process.env.HOSTNAME || "hostname";

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.listen(PORT, hostname, ()=>{
    console.log(`server is running on port http://${hostname}:${PORT}`);
});