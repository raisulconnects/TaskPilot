const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local React (CRA)
      "http://localhost:5173", // local React (Vite)
      "https://taskkpilot.netlify.app", // ✅ Netlify frontend
    ],
    credentials: true,
  })
);

app.use(express.json()); // for parsing JSON requests

// Routes
app.use("/api/allemployees", require("./routes/employeeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/healthcheck", (req, res) => {
  res.send("Healthy API!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
