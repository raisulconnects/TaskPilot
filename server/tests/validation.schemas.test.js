import { describe, it, expect } from "vitest";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} from "../validation/task.schemas.js";
import { loginSchema } from "../validation/auth.schemas.js";
import { aiTitleSchema } from "../validation/ai.schemas.js";

const OID = "507f1f77bcf86cd799439011";

const validTask = {
  title: "Fix login bug",
  description: "Fix the OAuth refresh flow",
  category: "Development",
  priority: "High",
  dueDate: "2026-10-01",
  assignedTo: OID,
};

describe("createTaskSchema", () => {
  it("accepts a valid task", () => {
    expect(createTaskSchema.safeParse(validTask).success).toBe(true);
  });

  it("accepts a past due date (auto-fail handles it at runtime)", () => {
    const r = createTaskSchema.safeParse({
      ...validTask,
      dueDate: "2020-01-01",
    });
    expect(r.success).toBe(true);
  });

  it("rejects a missing description", () => {
    const { description, ...rest } = validTask;
    const r = createTaskSchema.safeParse(rest);
    expect(r.success).toBe(false);
  });

  it("rejects a blank description", () => {
    const r = createTaskSchema.safeParse({ ...validTask, description: "   " });
    expect(r.success).toBe(false);
  });

  it("rejects short titles, bad enums, bad dates, bad ids", () => {
    const r = createTaskSchema.safeParse({
      ...validTask,
      title: "ab",
      category: "Nope",
      priority: "Urgent",
      dueDate: "not-a-date",
      assignedTo: "abc",
    });
    expect(r.success).toBe(false);
    expect(r.error.issues.length).toBeGreaterThanOrEqual(5);
  });

  it("rejects mass-assignment keys (status, assignedBy)", () => {
    const r = createTaskSchema.safeParse({
      ...validTask,
      status: "completed",
      assignedBy: "hacker",
    });
    expect(r.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("accepts a partial update", () => {
    expect(
      updateTaskSchema.safeParse({ description: "new desc" }).success
    ).toBe(true);
  });

  it("rejects an empty update", () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });

  it("rejects unknown keys", () => {
    expect(updateTaskSchema.safeParse({ _id: OID }).success).toBe(false);
  });
});

describe("taskIdParamSchema", () => {
  it("accepts a valid ObjectId", () => {
    expect(taskIdParamSchema.safeParse({ taskId: OID }).success).toBe(true);
  });

  it("rejects a malformed id", () => {
    expect(taskIdParamSchema.safeParse({ taskId: "nope" }).success).toBe(
      false
    );
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials and normalizes email", () => {
    const r = loginSchema.safeParse({ email: "Admin@X.com", password: "pw" });
    expect(r.success).toBe(true);
    expect(r.data.email).toBe("admin@x.com");
  });

  it("rejects empty bodies, bad emails, missing passwords", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "pw" }).success
    ).toBe(false);
    expect(loginSchema.safeParse({ email: "a@x.com" }).success).toBe(false);
  });

  it("rejects non-string email (NoSQL-injection shaped input)", () => {
    expect(
      loginSchema.safeParse({ email: { $gt: "" }, password: "pw" }).success
    ).toBe(false);
  });
});

describe("aiTitleSchema", () => {
  it("accepts a proper title", () => {
    expect(aiTitleSchema.safeParse({ title: "Build dashboard" }).success).toBe(
      true
    );
  });

  it("rejects short/blank titles", () => {
    expect(aiTitleSchema.safeParse({ title: "ab" }).success).toBe(false);
    expect(aiTitleSchema.safeParse({ title: "   " }).success).toBe(false);
  });
});
