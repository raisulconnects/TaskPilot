const dotenv = require("dotenv").config({ quiet: true, path: "../.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully!");
  } catch (e) {
    console.log("Database Couldn't Connect.", e.message);
  }
};

// Phase 1 cleanup: removed stale commented `// connectDB();` (was dead code).

module.exports = connectDB;
