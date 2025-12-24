const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");

// This is not being used currently

// POST /api/admins/login
router.post("/login", adminLogin);

module.exports = router;
