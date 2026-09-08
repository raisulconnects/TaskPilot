const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  markTaskCompleted,
  postATask,
  deleteATask,
  editATask,
} = require("../controllers/taskController");
const roleCheckMiddleware = require("../middleware/roleCheck.middleware");
const authCheckMiddleware = require("../middleware/authCheck.middleware");
const orgScopeMiddleware = require("../middleware/orgScope.middleware");
const {
  validateBody,
  validateParams,
} = require("../middleware/validate.middleware");
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} = require("../validation/task.schemas");

// Admin Posting a Task Through Admin Dashboard
router.post(
  "/",
  authCheckMiddleware,
  orgScopeMiddleware,
  roleCheckMiddleware("admin"),
  validateBody(createTaskSchema),
  postATask
);

// Admin: get all tasks
router.get(
  "/",
  authCheckMiddleware,
  orgScopeMiddleware,
  roleCheckMiddleware("admin", "employee"),
  getAllTasks,
);

// // Employee: mark a task completed
router.patch(
  "/:taskId/complete",
  authCheckMiddleware,
  orgScopeMiddleware,
  roleCheckMiddleware("employee"),
  validateParams(taskIdParamSchema),
  markTaskCompleted,
);

// Admin Can Delete Any Particular Task
router.delete(
  "/:taskId/delete",
  authCheckMiddleware,
  orgScopeMiddleware,
  roleCheckMiddleware("admin"),
  validateParams(taskIdParamSchema),
  deleteATask,
);

// Admin Can Edit Any Particular Task
router.patch(
  "/:taskId/edit",
  authCheckMiddleware,
  orgScopeMiddleware,
  roleCheckMiddleware("admin"),
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  editATask,
);

module.exports = router;
