const express = require("express");
const {
  geminiGenerator,
  geminiCategoryPriorityGenerator,
} = require("../controllers/geminiController");
const roleCheckMiddleware = require("../middleware/roleCheck.middleware");
const authCheckMiddleware = require("../middleware/authCheck.middleware");
const router = express.Router();

// For Generating Task Description based on Title
router.post("/gendesc", geminiGenerator);

// For Generating Category and Priority based on Title
router.post("/gencatpri", geminiCategoryPriorityGenerator);

module.exports = router;
