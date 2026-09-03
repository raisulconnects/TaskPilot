// socket.js
let io;

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(",") || [
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Phase 1 cleanup: handshake.auth debug log removed (was commented out).
    const { userId, role } = socket.handshake.auth;
    console.log("🔌 Socket connected:", socket.id);

    //If It's an Admin, we Join them to Admin room
    if (role === "admin") {
      socket.join("admin-room");
      socket.join(`user_${userId}`);
      console.log("--> An Admin just joined the room. ID:", userId);
    } else {
      socket.join("employee-room");
      socket.join(`user_${userId}`);
      console.log("--> An Employee just joined the room. ID:", userId);
    }

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
