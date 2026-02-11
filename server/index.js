const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler.middleware");
const logger = require("./middleware/logger.middleware");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const { initSocket } = require("./config/socket");

dotenv.config({ quiet: true });

connectDB();

const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://taskkpilot.netlify.app", // Netlify frontend
    ],
    credentials: true,
  }),
);

app.use(express.json());

// Initializing WebSocket For LIVE Interaction
initSocket(server);

// Routes
app.use("/api/allemployees", require("./routes/employeeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// AI Route (Special)
app.use("/api/ai/", require("./routes/geminiRoutes"));

app.get("/healthcheck", (req, res) => {
  res.send("Healthy API!");
});

app.use(logger);
app.use(errorHandler); // ErrorHandler

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server + Socket running on port ${PORT}`),
);
