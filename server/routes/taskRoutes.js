const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getEmployeeTasks,
  markTaskCompleted,
  postATask,
} = require("../controllers/taskController");

// Admin Posting a Task Through Admin Dashboard
router.post("/", postATask);

// Admin: get all tasks
router.get("/", getAllTasks);

// // Employee: mark a task completed
router.patch("/:taskId/complete", markTaskCompleted);

// // Employee: get tasks assigned to them
// router.get("/:employeeId", getEmployeeTasks);

module.exports = router;
