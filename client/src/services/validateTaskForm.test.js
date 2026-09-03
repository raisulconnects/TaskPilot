import { describe, it, expect } from "vitest";
import {
  validateTaskForm,
  FORM_ERROR_MESSAGE,
} from "./validateTaskForm.js";

const validForm = {
  title: "Fix login bug",
  assignedTo: "507f1f77bcf86cd799439011",
  dueDate: "2026-10-01",
  category: "Development",
  priority: "High",
  description: "Fix the OAuth refresh flow",
};

describe("validateTaskForm", () => {
  it("returns null for a complete form", () => {
    expect(validateTaskForm(validForm)).toBeNull();
  });

  it.each([
    ["blank title", { ...validForm, title: "   " }],
    ["missing assignee", { ...validForm, assignedTo: "" }],
    ["missing due date", { ...validForm, dueDate: "" }],
    ["missing category", { ...validForm, category: "" }],
    ["missing priority", { ...validForm, priority: "" }],
    ["blank description", { ...validForm, description: "  \n " }],
    ["missing description", { ...validForm, description: undefined }],
  ])("returns the error message for %s", (_label, form) => {
    expect(validateTaskForm(form)).toBe(FORM_ERROR_MESSAGE);
  });
});
