const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getEmployeeTasks,
  markTaskCompleted,
} = require("../controllers/taskController");

// Admin: get all tasks
router.get("/", getAllTasks);

// Employee: get tasks assigned to them
router.get("/:employeeId", getEmployeeTasks);

// Employee: mark a task completed
router.patch("/:taskId/complete", markTaskCompleted);

module.exports = router;
