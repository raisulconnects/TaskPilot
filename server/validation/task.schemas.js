const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const category = z.enum(["General", "Design", "Development", "Debugging"]);

const priority = z.enum(["General", "Average", "High", "Low", "Medium"]);

const status = z.enum(["assigned", "completed", "failed"]);

// Past dates allowed: overdue tasks are auto-marked as failed by getAllTasks.
const dueDate = z.coerce.date({ invalid_type_error: "Invalid due date" });

const createTaskSchema = z
  .object({
    title: z.string().trim().min(3).max(200),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(1, "Description is required")
      .max(2000),
    category,
    priority,
    dueDate,
    assignedTo: objectId,
  })
  .strict();

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    category: category.optional(),
    priority: priority.optional(),
    dueDate: dueDate.optional(),
    assignedTo: objectId.optional(),
    status: status.optional(),
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, "Nothing to update");

const taskIdParamSchema = z
  .object({
    taskId: objectId,
  })
  .strict();

module.exports = {
  objectId,
  taskCategory: category,
  taskPriority: priority,
  taskStatus: status,
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
};
