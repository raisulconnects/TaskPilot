const express = require("express");
const router = express.Router();
const { createUser, deleteUser } = require("../controllers/userController");
const authCheckMiddleware = require("../middleware/authCheck.middleware");
const orgScopeMiddleware = require("../middleware/orgScope.middleware");
const roleCheckMiddleware = require("../middleware/roleCheck.middleware");
const { validateBody, validateParams } = require("../middleware/validate.middleware");
const {
  createUserSchema,
  userIdParamSchema,
} = require("../validation/user.schemas");

// TODO(rate-limit): same pre-launch hardening as signup — admin-only narrows
// exposure, but authenticated endpoints still deserve limits before traffic.
router.post(
  "/",
  authCheckMiddleware,
  orgScopeMiddleware,
  roleCheckMiddleware("admin"),
  validateBody(createUserSchema),
  createUser
);

router.delete(
  "/:userId",
  authCheckMiddleware,
  orgScopeMiddleware,
  roleCheckMiddleware("admin"),
  validateParams(userIdParamSchema),
  deleteUser
);

module.exports = router;
