const express = require("express");
const router = express.Router();
const { login, logout, authCheck } = require("../controllers/authController");
const { validateBody } = require("../middleware/validate.middleware");
const { loginSchema } = require("../validation/auth.schemas");

router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authCheck);

module.exports = router;
