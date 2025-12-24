const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler.middleware");
const logger = require("./middleware/logger.middleware");

dotenv.config();

connectDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://taskkpilot.netlify.app", // Netlify frontend
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/allemployees", require("./routes/employeeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/healthcheck", (req, res) => {
  res.send("Healthy API!");
});

app.use(logger);
app.use(errorHandler); // ErrorHandler

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
