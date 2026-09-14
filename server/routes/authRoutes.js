const express = require("express");
const router = express.Router();
const { login, logout, authCheck, signup } = require("../controllers/authController");
const { validateBody } = require("../middleware/validate.middleware");
const { loginSchema, signupSchema } = require("../validation/auth.schemas");

router.post("/login", validateBody(loginSchema), login);
// TODO(rate-limit): public signup needs express-rate-limit before launch
// (open endpoint + expensive bcrypt hashing = CPU-burn target). Attempts are
// logged in the controller until then.
router.post("/signup", validateBody(signupSchema), signup);
router.post("/logout", logout);
router.get("/me", authCheck);

module.exports = router;
