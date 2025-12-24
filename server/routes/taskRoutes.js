const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  markTaskCompleted,
  postATask,
  deleteATask,
  editATask,
} = require("../controllers/taskController");

// Admin Posting a Task Through Admin Dashboard
router.post("/", postATask);

// Admin: get all tasks
router.get("/", getAllTasks);

// // Employee: mark a task completed
router.patch("/:taskId/complete", markTaskCompleted);

// Admin Can Delete Any Particular Task
router.delete("/:taskId/delete", deleteATask);

// Admin Can Edit Any Particular Task
router.patch("/:taskId/edit", editATask);

module.exports = router;
