const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const corsOptions = {
  origin: "https://websocket-client-vkiw.onrender.com",
  credentials: true,
  methods: ["GET", "POST"],
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// app.use(express.static("../client/dist"));

const server = http.createServer(app);

const io = new Server(server, {
  addTrailingSlash: false,
  cors: {
    origin: "https://websocket-client-vkiw.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.chatroomName).emit("receive_message", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
