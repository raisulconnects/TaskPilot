// socket.js
let io;

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://taskkpilot.netlify.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("join-room", (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
