const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getEmployeeTasks,
  markTaskCompleted,
  postATask,
  deleteATask,
} = require("../controllers/taskController");

// Admin Posting a Task Through Admin Dashboard
router.post("/", postATask);

// Admin: get all tasks
router.get("/", getAllTasks);

// // Employee: mark a task completed
router.patch("/:taskId/complete", markTaskCompleted);

// Admin Can Delete Any Particular Task
router.delete("/:taskId/delete", deleteATask);

// // Employee: get tasks assigned to them
// router.get("/:employeeId", getEmployeeTasks);

module.exports = router;
