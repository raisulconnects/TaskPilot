const prisma = require("../config/prisma");
const { getIO } = require("../config/socket");

const ASSIGNEE_SELECT = { id: true, name: true, email: true };

// Prisma "record not found" → the 404 contract the routes have always kept.
const isNotFound = (e) => e?.code === "P2025";
const sendNotFound = (res) =>
  res.status(404).json({ message: "Task not found" });

// Prisma FK violation (e.g. assignee does not exist) → friendly 400 instead
// of a 500. The database constraint is the backstop behind Zod validation.
const isForeignKeyViolation = (e) => e?.code === "P2003";

// Admin Posting a Task From The Admin Dashboard
// Body validated by createTaskSchema (routes/taskRoutes.js): unknown keys
// (status, assignedBy, _id) are rejected before reaching here.
const postATask = async (req, res) => {
  try {
    // Single-org phase: the creator's org scopes the task. The tenancy phase
    // replaces this lookup with req.orgId stamped by middleware.
    const creator = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { orgId: true },
    });
    if (!creator) return res.status(401).json({ message: "Not authenticated" });

    const { assignedTo, ...rest } = req.body;
    const task = await prisma.task.create({
      data: {
        ...rest,
        orgId: creator.orgId,
        assignedToId: assignedTo,
        assignedById: req.user.id,
      },
      include: { assignedTo: { select: ASSIGNEE_SELECT } },
    });

    const io = getIO();
    const assignedUserId = task.assignedTo.id;
    if (assignedUserId) {
      io.to(`user_${assignedUserId}`).emit("task-assigned", task);
    }

    return res.status(201).json({ task });
  } catch (e) {
    if (isForeignKeyViolation(e)) {
      return res
        .status(400)
        .json({ message: "Assignee does not exist" });
    }
    console.error("Error creating task:", e.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const now = new Date();

    // Only tasks NOT completed and with past dueDate ( age dekhbe status then check kore it does the work )
    await prisma.task.updateMany({
      where: { status: { not: "completed" }, dueDate: { lt: now } },
      data: { status: "failed" },
    });

    const tasks = await prisma.task.findMany({
      include: { assignedTo: { select: ASSIGNEE_SELECT } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark task as completed
const markTaskCompleted = async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: req.params.taskId },
      data: { status: "completed" },
      include: { assignedTo: { select: ASSIGNEE_SELECT } },
    });

    const io = getIO();
    io.to("admin-room").emit("task:updated", task);

    res.status(200).json({ message: "Task marked as completed", task });
  } catch (error) {
    if (isNotFound(error)) return sendNotFound(res);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete A Particular Task
const deleteATask = async (req, res) => {
  try {
    const task = await prisma.task.delete({
      where: { id: req.params.taskId },
    });

    const io = getIO();
    const assignedUserId = task.assignedToId;
    io.to("admin-room").emit("task:deleted", task);
    if (assignedUserId) {
      io.to(`user_${assignedUserId}`).emit("task:deleted", task);
    }

    res.status(200).json({ message: "Task Was Deleted", task });
  } catch (error) {
    if (isNotFound(error)) return sendNotFound(res);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a Particular Task
// Body + params validated (updateTaskSchema + taskIdParamSchema): at least one
// known field, unknown keys rejected.
const editATask = async (req, res) => {
  const { assignedTo, ...rest } = req.body;
  const newTaskData =
    assignedTo === undefined ? rest : { ...rest, assignedToId: assignedTo };
  try {
    const task = await prisma.task.update({
      where: { id: req.params.taskId },
      data: newTaskData,
      include: { assignedTo: { select: ASSIGNEE_SELECT } },
    });

    const io = getIO();
    const assignedUserId = task.assignedTo.id;
    io.to("admin-room").emit("task:updated", task);
    if (assignedUserId) {
      io.to(`user_${assignedUserId}`).emit("task:updated", task);
    }

    res.status(200).json({ message: "Task Was Updated", task });
  } catch (error) {
    if (isNotFound(error)) return sendNotFound(res);
    if (isForeignKeyViolation(error)) {
      return res
        .status(400)
        .json({ message: "Assignee does not exist" });
    }
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
