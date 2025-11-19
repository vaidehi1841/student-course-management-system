const { Server } = require("socket.io");

let io;

module.exports.initializeWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected via WebSocket");

    socket.on("notify", (msg) => {
      io.emit("broadcast", msg);
    });
  });
};

module.exports.getIO = () => io;
