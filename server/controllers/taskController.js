const Task = require("../models/task.model");
const { getIO } = require("../config/socket");

// Admin Posting a Task From The Admin Dashboard
const postATask = async (req, res) => {
  try {
    const raw = await Task.create(req.body);
    const task = await raw.populate("assignedTo", "name email");

    const io = getIO();
    const assignedUserId = task.assignedTo._id.toString();
    if (assignedUserId) {
      io.to(`user_${assignedUserId}`).emit("task-assigned", task);
    }

    return res.status(201).json({ task });
  } catch (e) {
    console.error("Error creating task:", e.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const now = new Date();

    // Only tasks NOT completed and with past dueDate ( age dekhbe status then check kore it does the work )
    await Task.updateMany(
      { status: { $ne: "completed" }, dueDate: { $lt: now } },
      { $set: { status: "failed" } },
    );

    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark task as completed
const markTaskCompleted = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status: "completed" },
      { new: true },
    ).populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const io = getIO();
    io.to("admin-room").emit("task:updated", task);

    res.status(200).json({ message: "Task marked as completed", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete A Particular Task
const deleteATask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const io = getIO();
    const assignedUserId = task.assignedTo.toString();
    io.to("admin-room").emit("task:deleted", task);
    if (assignedUserId) {
      io.to(`user_${assignedUserId}`).emit("task:deleted", task);
    }

    res.status(200).json({ message: "Task Was Deleted", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a Particular Task
const editATask = async (req, res) => {
  const newTaskData = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, newTaskData, {
      new: true,
    }).populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const io = getIO();
    const assignedUserId = task.assignedTo._id.toString();
    io.to("admin-room").emit("task:updated", task);
    if (assignedUserId) {
      io.to(`user_${assignedUserId}`).emit("task:updated", task);
    }

    res.status(200).json({ message: "Task Was Updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllTasks,
  markTaskCompleted,
  postATask,
  deleteATask,
  editATask,
};
