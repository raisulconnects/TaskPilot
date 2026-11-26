// socket.js
const { adminRoom, employeeRoom, userRoom } = require("./rooms");
const { socketAuthMiddleware } = require("./socketAuth");

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

  // Every connection must carry a valid auth cookie; identity (and so the
  // rooms joined) comes from the verified token, not from the client.
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    // Tenancy: rooms are namespaced per org via config/rooms.js — no
    // cross-tenant delivery.
    const { id: userId, role, orgId } = socket.data.user;
    console.log("🔌 Socket connected:", socket.id);

    //If It's an Admin, we Join them to Admin room
    if (role === "admin") {
      socket.join(adminRoom(orgId));
      socket.join(userRoom(orgId, userId));
      console.log("--> An Admin just joined the room. ID:", userId);
    } else {
      socket.join(employeeRoom(orgId));
      socket.join(userRoom(orgId, userId));
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
