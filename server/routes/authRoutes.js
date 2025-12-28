const express = require("express");
const router = express.Router();
const { login, logout, authCheck } = require("../controllers/authController");

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authCheck);

module.exports = router;
