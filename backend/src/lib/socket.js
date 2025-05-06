const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});
const userSocketMap = {} //{userId: socket.id}
io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});


const Socket = {
  app,
  server,
  io,
  getReceiverSocketId: (userId) => {
    return userSocketMap[userId]; 
  }
};

module.exports = Socket;
