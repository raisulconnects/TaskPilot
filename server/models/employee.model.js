const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "employee",
  },
});

// NOTE: password hashing hooks intentionally omitted — seeds are pre-hashed
// with bcrypt; login verifies via bcrypt.compare in controllers/authController.js.
// Re-introduce pre("save") hashing only when user registration lands
// (post multi-tenant decision).
module.exports = mongoose.model("Employee", employeeSchema);
