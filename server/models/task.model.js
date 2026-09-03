const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task Tilte is missing"],
    },

    description: {
      type: String,
      required: [true, "Task description is missing"],
    },

    category: {
      type: String,
      enum: ["General", "Design", "Development", "Debugging"],
      required: [true, "Please Select Category"],
    },

    priority: {
      type: String,
      enum: ["General", "Average", "High", "Low", "Medium"],
      default: "Medium",
      required: [true, "Please add the task Priority"],
    },

    status: {
      type: String,
      enum: ["assigned", "completed", "failed"],
      default: "assigned",
    },

    dueDate: {
      type: Date,
      required: [true, "Please Set The Due Date!"],
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Please Select who this task is assigned to"],
    },

    assignedBy: {
      type: String,
      default: 1,
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt automatically
  }
);

// Reuse the compiled model when this module is loaded twice (e.g. ESM import
// in tests + CJS require in controllers resolving as separate instances).
module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
