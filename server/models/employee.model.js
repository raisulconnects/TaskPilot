const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// NOTE (Phase 1 cleanup): password hashing hooks are intentionally disabled.
// Seeds are expected pre-hashed with bcrypt; login verifies via bcrypt.compare
// in controllers/authController.js. Re-enable pre("save") hashing only when
// introducing user registration (post multi-tenant decision).
// Password hashing (DISABLED — see NOTE above)
// employeeSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Password match method
// employeeSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
module.exports = mongoose.model("Employee", employeeSchema);
