const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler.middleware");
const logger = require("./middleware/logger.middleware");

// Express app factory — no side effects (no DB connect, no socket init,
// no listen), so tests can import the app via supertest without booting
// infrastructure. See index.js for the production wiring.
const createApp = () => {
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CORS_ORIGINS?.split(",") || [
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      credentials: true,
    })
  );

  app.use(express.json());

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

  return app;
};

module.exports = createApp;
