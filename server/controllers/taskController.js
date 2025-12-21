const Task = require("../models/task.model");

// Admin Posting a Task From The Admin Dashboard
const postATask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    console.log("--------> Task Was Added Successfully!");
    console.log("ParticularTask:", task);

    return res.status(201).json({
      task,
    });
  } catch (e) {
    console.error("Error creating task:", e.message);

    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

// Get all tasks (for admin)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get tasks assigned to a specific employee
const getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.employeeId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark task as completed
const markTaskCompleted = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = true;
    await task.save();

    res.status(200).json({ message: "Task marked as completed", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllTasks,
  getEmployeeTasks,
  markTaskCompleted,
  postATask,
};
