const express = require("express");
const {
  geminiGenerator,
  geminiCategoryPriorityGenerator,
} = require("../controllers/geminiController");
const roleCheckMiddleware = require("../middleware/roleCheck.middleware");
const authCheckMiddleware = require("../middleware/authCheck.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const { aiTitleSchema } = require("../validation/ai.schemas");
const router = express.Router();

// For Generating Task Description based on Title
// Phase 1 cleanup: require auth + admin role (was public, exposed Gemini quota).
// Only used by admin CreateTask AI autofill. Imports were already present but unused.
router.post(
  "/gendesc",
  authCheckMiddleware,
  roleCheckMiddleware("admin"),
  validateBody(aiTitleSchema),
  geminiGenerator
);

// For Generating Category and Priority based on Title
router.post(
  "/gencatpri",
  authCheckMiddleware,
  roleCheckMiddleware("admin"),
  validateBody(aiTitleSchema),
  geminiCategoryPriorityGenerator
);

module.exports = router;
