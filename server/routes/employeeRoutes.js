const express = require("express");
const router = express.Router();
const { employeeLogin } = require("../controllers/employeeController");

// POST /api/employees/login
router.post("/login", employeeLogin);

module.exports = router;
