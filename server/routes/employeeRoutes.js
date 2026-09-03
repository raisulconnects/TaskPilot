const express = require("express");
const router = express.Router();
const { allEmployees } = require("../controllers/employeeController");
const authCheckMiddleware = require("../middleware/authCheck.middleware");
const roleCheckMiddleware = require("../middleware/roleCheck.middleware");

// Phase 1 cleanup: require auth + admin role (was public, leaked user PII).
// Only used by admin CreateTask assignment dropdown.
router.get(
  "/",
  authCheckMiddleware,
  roleCheckMiddleware("admin"),
  allEmployees
);

module.exports = router;
