const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Average", "General"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["assigned", "completed"],
      default: "assigned",
    },

    dueDate: {
      type: Date,
      required: [true, "Please Set The Due Date!"],
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
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

module.exports = mongoose.model("Task", taskSchema);
