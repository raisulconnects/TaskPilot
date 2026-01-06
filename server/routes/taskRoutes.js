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

// Admin Posting a Task Through Admin Dashboard
router.post("/", authCheckMiddleware, roleCheckMiddleware("admin"), postATask);

// Admin: get all tasks
router.get(
  "/",
  authCheckMiddleware,
  roleCheckMiddleware("admin", "employee"),
  getAllTasks
);

// // Employee: mark a task completed
router.patch(
  "/:taskId/complete",
  authCheckMiddleware,
  roleCheckMiddleware("employee"),
  markTaskCompleted
);

// Admin Can Delete Any Particular Task
router.delete(
  "/:taskId/delete",
  authCheckMiddleware,
  roleCheckMiddleware("admin"),
  deleteATask
);

// Admin Can Edit Any Particular Task
router.patch(
  "/:taskId/edit",
  authCheckMiddleware,
  roleCheckMiddleware("admin"),
  editATask
);

module.exports = router;
