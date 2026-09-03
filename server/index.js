const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const { initSocket } = require("./config/socket");
const createApp = require("./app");

dotenv.config({ quiet: true });

connectDB();

const app = createApp();
const server = http.createServer(app);

// Initializing WebSocket For LIVE Interaction
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server + Socket running on port ${PORT}`),
);
