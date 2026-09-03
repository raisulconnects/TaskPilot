import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTask } from "./taskService.js";

const taskData = {
  title: "Fix login bug",
  assignedTo: "507f1f77bcf86cd799439011",
  dueDate: "2026-10-01",
  category: "Development",
  priority: "High",
  description: "Fix the OAuth refresh flow",
};

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("createTask", () => {
  it("returns the created task on success", async () => {
    const task = { _id: "task1", ...taskData };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ task }),
      })
    );
    await expect(createTask(taskData)).resolves.toEqual(task);
  });

  it("surfaces the server validation message with per-field issues", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Validation failed",
          issues: [{ path: "description", message: "Description is required" }],
        }),
      })
    );
    await expect(createTask(taskData)).rejects.toThrow(
      "Validation failed — description: Description is required"
    );
  });

  it("falls back to a generic message when the body is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => {
          throw new SyntaxError("empty body");
        },
      })
    );
    await expect(createTask(taskData)).rejects.toThrow("Failed to create task");
  });
});
