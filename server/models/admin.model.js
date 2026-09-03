/**
 * @deprecated Phase 1 cleanup (chore/phase-1-cleanup) — NOT IN USE.
 * Auth is unified in Employee model with role field (see authController.js).
 * Kept for reference only; scheduled for removal after multi-tenant decision.
 * Do not import this model in new code.
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

// Password hashing
// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Password match method
// adminSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("Admin", adminSchema);
