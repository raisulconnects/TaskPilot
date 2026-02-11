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
    // Here We can Easily Extract the Role Now { userId: '6946aeead571b00dddd4d794', role: 'admin' }
    // console.log(socket.handshake.auth);
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

    // socket.on("join-room", (userId) => {
    //   socket.join(`user_${userId}`);
    // });

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
