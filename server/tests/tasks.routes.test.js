import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import createApp from "../app.js";
import Task from "../models/task.model.js";
import Employee from "../models/employee.model.js";
import socketHelper from "./helpers/socket-test-helper.js";

// Models: vi.spyOn works because every model file reuses the compiled model
// off Mongoose's shared singleton (see the `mongoose.models.X ||` guard),
// so the spied object is the exact one the controllers query.
const findSpy = vi.spyOn(Task, "find");
const createSpy = vi.spyOn(Task, "create");
const updateManySpy = vi.spyOn(Task, "updateMany");
const findByIdAndUpdateSpy = vi.spyOn(Task, "findByIdAndUpdate");
const findByIdAndDeleteSpy = vi.spyOn(Task, "findByIdAndDelete");
const empFindSpy = vi.spyOn(Employee, "find");
const empFindOneSpy = vi.spyOn(Employee, "findOne");

// Socket: the helper initializes the REAL Socket.IO server through the same
// CJS pipeline the controllers use (vi.mock/vi.spyOn from ESM tests cannot
// reach it). Spying `to()` captures room-targeted emissions.
const mockEmit = vi.fn();
vi.spyOn(socketHelper.io, "to").mockReturnValue({ emit: mockEmit });

const OID = "507f1f77bcf86cd799439011";
const ADMIN = { id: "admin1", role: "admin", name: "Admin", email: "a@x.com" };
const EMP = { id: "emp1", role: "employee", name: "Emp", email: "e@x.com" };

const app = createApp();
const cookieFor = (user) =>
  `token=${jwt.sign(user, process.env.JWT_SECRET)}`;

const PASSWORD_HASH = bcrypt.hashSync("correct-pw", 4);

const taskDoc = (overrides = {}) => ({
  _id: "task1",
  title: "Fix login bug",
  description: "Fix the OAuth refresh flow",
  category: "Development",
  priority: "High",
  status: "assigned",
  dueDate: "2026-10-01",
  assignedTo: { _id: OID, name: "Emp", email: "e@x.com" },
  ...overrides,
});

const validBody = {
  title: "Fix login bug",
  description: "Fix the OAuth refresh flow",
  category: "Development",
  priority: "High",
  dueDate: "2026-10-01",
  assignedTo: OID,
};

const dbUser = {
  _id: "user1",
  name: "Admin",
  email: "admin@x.com",
  password: PASSWORD_HASH,
  role: "admin",
};

beforeEach(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  vi.clearAllMocks();
  updateManySpy.mockResolvedValue({ modifiedCount: 0 });
  findSpy.mockReturnValue({
    populate: vi.fn().mockReturnValue({
      sort: vi.fn().mockResolvedValue([taskDoc()]),
    }),
  });
  empFindOneSpy.mockResolvedValue(null);
});

describe("GET /api/tasks", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });

  it("auto-expires overdue tasks then returns the list", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(200);
    expect(updateManySpy).toHaveBeenCalledOnce();
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /api/tasks", () => {
  it("returns 403 for employees", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(EMP))
      .send(validBody);
    expect(res.status).toBe(403);
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("returns 400 when description is missing (controller never hit)", async () => {
    const { description, ...rest } = validBody;
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(ADMIN))
      .send(rest);
    expect(res.status).toBe(400);
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("returns 400 for smuggled status/assignedBy keys", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(ADMIN))
      .send({ ...validBody, status: "completed", assignedBy: "hacker" });
    expect(res.status).toBe(400);
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("creates the task, stamps assignedBy from the token, notifies the assignee", async () => {
    const populated = taskDoc();
    createSpy.mockResolvedValue({
      populate: vi.fn().mockResolvedValue(populated),
    });
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(ADMIN))
      .send(validBody);
    expect(res.status).toBe(201);
    expect(createSpy).toHaveBeenCalledWith({
      ...validBody,
      dueDate: expect.any(Date),
      assignedBy: ADMIN.id,
    });
    expect(mockEmit).toHaveBeenCalledWith("task-assigned", populated);
  });
});

describe("PATCH /api/tasks/:taskId/complete", () => {
  it("returns 400 for a malformed id (no CastError 500)", async () => {
    const res = await request(app)
      .patch("/api/tasks/nope/complete")
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(400);
    expect(findByIdAndUpdateSpy).not.toHaveBeenCalled();
  });

  it("marks the task completed and emits to the admin room", async () => {
    const completed = taskDoc({ status: "completed" });
    findByIdAndUpdateSpy.mockReturnValue({
      populate: vi.fn().mockResolvedValue(completed),
    });
    const res = await request(app)
      .patch(`/api/tasks/${OID}/complete`)
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(200);
    expect(mockEmit).toHaveBeenCalledWith("task:updated", completed);
  });

  it("returns 404 when the task does not exist", async () => {
    findByIdAndUpdateSpy.mockReturnValue({
      populate: vi.fn().mockResolvedValue(null),
    });
    const res = await request(app)
      .patch(`/api/tasks/${OID}/complete`)
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/tasks/:taskId/edit", () => {
  it("returns 400 for an empty body", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${OID}/edit`)
      .set("Cookie", cookieFor(ADMIN))
      .send({});
    expect(res.status).toBe(400);
    expect(findByIdAndUpdateSpy).not.toHaveBeenCalled();
  });

  it("returns 400 for unknown keys", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${OID}/edit`)
      .set("Cookie", cookieFor(ADMIN))
      .send({ _id: OID });
    expect(res.status).toBe(400);
  });

  it("applies a partial update and emits to both rooms", async () => {
    const updated = taskDoc({ description: "new desc" });
    findByIdAndUpdateSpy.mockReturnValue({
      populate: vi.fn().mockResolvedValue(updated),
    });
    const res = await request(app)
      .patch(`/api/tasks/${OID}/edit`)
      .set("Cookie", cookieFor(ADMIN))
      .send({ description: "new desc" });
    expect(res.status).toBe(200);
    expect(mockEmit).toHaveBeenCalledWith("task:updated", updated);
  });
});

describe("DELETE /api/tasks/:taskId/delete", () => {
  it("returns 400 for a malformed id", async () => {
    const res = await request(app)
      .delete("/api/tasks/nope/delete")
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(400);
    expect(findByIdAndDeleteSpy).not.toHaveBeenCalled();
  });

  it("deletes and emits to the admin room", async () => {
    findByIdAndDeleteSpy.mockResolvedValue(taskDoc({ assignedTo: OID }));
    const res = await request(app)
      .delete(`/api/tasks/${OID}/delete`)
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(200);
    expect(mockEmit).toHaveBeenCalledWith(
      "task:deleted",
      expect.objectContaining({ _id: "task1" })
    );
  });
});

describe("GET /api/allemployees", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/allemployees");
    expect(res.status).toBe(401);
  });

  it("returns 403 for employees (admin-only)", async () => {
    const res = await request(app)
      .get("/api/allemployees")
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(403);
  });

  it("returns the employee list for admins", async () => {
    empFindSpy.mockReturnValue({
      select: vi.fn().mockResolvedValue([
        { _id: OID, name: "Emp", email: "e@x.com", role: "employee" },
      ]),
    });
    const res = await request(app)
      .get("/api/allemployees")
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("POST /api/ai/gendesc (validation wiring only — Gemini never called)", () => {
  it("returns 400 for a short title before reaching the AI service", async () => {
    const res = await request(app)
      .post("/api/ai/gendesc")
      .set("Cookie", cookieFor(ADMIN))
      .send({ title: "ab" });
    expect(res.status).toBe(400);
  });
});
