const express = require("express");
const router = express.Router();
const { allEmployees } = require("../controllers/employeeController");

router.get("/", allEmployees);

module.exports = router;
