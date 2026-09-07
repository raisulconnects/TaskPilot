import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import createApp from "../app.js";
import prismaHelper from "./helpers/prisma-test-helper.js";
import socketHelper from "./helpers/socket-test-helper.js";

// Prisma stubs are installed on the controllers' instance via the CJS helper
// (see helpers/prisma-test-helper.js for why vi.mock/vi.spyOn can't reach it).
// No database is touched; bcrypt.compare stays real.
const task = {
  create: vi.fn(),
  findMany: vi.fn(),
  updateMany: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
const user = {
  findUnique: vi.fn(),
  findMany: vi.fn(),
};

// Socket: the helper boots the REAL server through the controllers' CJS
// pipeline (see helpers/socket-test-helper.js); spying `to()` captures
// room-targeted emissions without any client connections.
const mockEmit = vi.fn();
vi.spyOn(socketHelper.io, "to").mockReturnValue({ emit: mockEmit });

const OID = "123e4567-e89b-12d3-a456-426614174000";
const ADMIN_ID = "123e4567-e89b-12d3-a456-426614174001";
const ORG_ID = "123e4567-e89b-12d3-a456-426614174002";
const ADMIN = { id: ADMIN_ID, role: "admin", name: "Admin", email: "a@x.com" };
const EMP = { id: OID, role: "employee", name: "Emp", email: "e@x.com" };

const app = createApp();
const cookieFor = (user) =>
  `token=${jwt.sign(user, process.env.JWT_SECRET)}`;

const PASSWORD_HASH = bcrypt.hashSync("correct-pw", 4);

const taskDoc = (overrides = {}) => ({
  id: "task1",
  orgId: ORG_ID,
  title: "Fix login bug",
  description: "Fix the OAuth refresh flow",
  category: "Development",
  priority: "High",
  status: "assigned",
  dueDate: "2026-10-01",
  assignedToId: OID,
  assignedById: ADMIN_ID,
  assignedTo: { id: OID, name: "Emp", email: "e@x.com" },
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
  id: "user1",
  orgId: ORG_ID,
  name: "Admin",
  email: "admin@x.com",
  password: PASSWORD_HASH,
  role: "admin",
};

beforeEach(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  vi.clearAllMocks();
  prismaHelper.stubPrisma({ task, user });
  task.updateMany.mockResolvedValue({ count: 0 });
  task.findMany.mockResolvedValue([taskDoc()]);
  user.findUnique.mockResolvedValue(null);
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
    expect(task.updateMany).toHaveBeenCalledOnce();
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
    expect(task.create).not.toHaveBeenCalled();
  });

  it("returns 400 when description is missing (controller never hit)", async () => {
    const { description, ...rest } = validBody;
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(ADMIN))
      .send(rest);
    expect(res.status).toBe(400);
    expect(task.create).not.toHaveBeenCalled();
  });

  it("returns 400 for smuggled status/assignedBy keys", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(ADMIN))
      .send({ ...validBody, status: "completed", assignedBy: "hacker" });
    expect(res.status).toBe(400);
    expect(task.create).not.toHaveBeenCalled();
  });

  it("creates the task, stamps org + author from the server side, notifies the assignee", async () => {
    const populated = taskDoc();
    user.findUnique.mockResolvedValue({ orgId: ORG_ID });
    task.create.mockResolvedValue(populated);
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(ADMIN))
      .send(validBody);
    expect(res.status).toBe(201);
    const { assignedTo, ...restBody } = validBody;
    expect(task.create).toHaveBeenCalledWith({
      data: {
        ...restBody,
        dueDate: expect.any(Date),
        orgId: ORG_ID,
        assignedToId: OID,
        assignedById: ADMIN.id,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
    expect(mockEmit).toHaveBeenCalledWith("task-assigned", populated);
    expect(res.body.task.assignedTo).toMatchObject({ id: OID });
  });

  it("returns 400 when the assignee does not exist (FK backstop)", async () => {
    user.findUnique.mockResolvedValue({ orgId: ORG_ID });
    task.create.mockRejectedValue({ code: "P2003", message: "FK violation" });
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieFor(ADMIN))
      .send(validBody);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Assignee does not exist");
  });
});

describe("PATCH /api/tasks/:taskId/complete", () => {
  it("returns 400 for a malformed id (no CastError 500)", async () => {
    const res = await request(app)
      .patch("/api/tasks/nope/complete")
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(400);
    expect(task.update).not.toHaveBeenCalled();
  });

  it("marks the task completed and emits to the admin room", async () => {
    const completed = taskDoc({ status: "completed" });
    task.update.mockResolvedValue(completed);
    const res = await request(app)
      .patch(`/api/tasks/${OID}/complete`)
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(200);
    expect(mockEmit).toHaveBeenCalledWith("task:updated", completed);
  });

  it("returns 404 when the task does not exist", async () => {
    task.update.mockRejectedValue({ code: "P2025", message: "Not found" });
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
    expect(task.update).not.toHaveBeenCalled();
  });

  it("returns 400 for unknown keys", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${OID}/edit`)
      .set("Cookie", cookieFor(ADMIN))
      .send({ _id: OID });
    expect(res.status).toBe(400);
  });

  it("applies a partial update", async () => {
    const updated = taskDoc({ description: "new desc" });
    task.update.mockResolvedValue(updated);
    const res = await request(app)
      .patch(`/api/tasks/${OID}/edit`)
      .set("Cookie", cookieFor(ADMIN))
      .send({ description: "new desc" });
    expect(res.status).toBe(200);
    expect(task.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: OID },
        data: { description: "new desc" },
      })
    );
    expect(mockEmit).toHaveBeenCalledWith("task:updated", updated);
  });
});

describe("DELETE /api/tasks/:taskId/delete", () => {
  it("returns 400 for a malformed id", async () => {
    const res = await request(app)
      .delete("/api/tasks/nope/delete")
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(400);
    expect(task.delete).not.toHaveBeenCalled();
  });

  it("deletes the task", async () => {
    task.delete.mockResolvedValue(taskDoc({ assignedToId: OID }));
    const res = await request(app)
      .delete(`/api/tasks/${OID}/delete`)
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(200);
    expect(res.body.task).toMatchObject({ id: "task1" });
    expect(mockEmit).toHaveBeenCalledWith(
      "task:deleted",
      expect.objectContaining({ id: "task1" })
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
    user.findMany.mockResolvedValue([
      { id: OID, name: "Emp", email: "e@x.com", role: "employee" },
    ]);
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
