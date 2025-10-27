const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    io.emit("message", { sender: socket.id, text: data });
  });
});

server.listen(8080, (req, res) => {
  console.log("Server live");
});
