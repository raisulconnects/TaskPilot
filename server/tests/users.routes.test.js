import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createApp from "../app.js";
import prismaHelper from "./helpers/prisma-test-helper.js";

// Same seams as the auth/task suites: stubs on the controllers' Prisma
// instance, real bcrypt. No database is touched.
const user = {
  findUnique: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
};

const ORG_ID = "123e4567-e89b-12d3-a456-426614174002";
const OTHER_ORG_ID = "123e4567-e89b-12d3-a456-426614174003";
const ADMIN_ID = "123e4567-e89b-12d3-a456-426614174001";
const ADMIN = { id: ADMIN_ID, role: "admin", name: "Admin", email: "a@x.com", orgId: ORG_ID };
const EMP = { id: "123e4567-e89b-12d3-a456-426614174000", role: "employee", name: "Emp", email: "e@x.com", orgId: ORG_ID };

const app = createApp();
const cookieFor = (u) => `token=${jwt.sign(u, process.env.JWT_SECRET)}`;

const validBody = {
  name: "New Member",
  email: "new@x.com",
  password: "memberpass1",
  role: "employee",
};

beforeEach(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  vi.clearAllMocks();
  prismaHelper.stubPrisma({ user });
  user.findUnique.mockResolvedValue(null);
});

describe("POST /api/users", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).post("/api/users").send(validBody);
    expect(res.status).toBe(401);
  });

  it("returns 403 for employees", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Cookie", cookieFor(EMP))
      .send(validBody);
    expect(res.status).toBe(403);
    expect(user.create).not.toHaveBeenCalled();
  });

  it("returns 400 for bad payloads (controller never hit)", async () => {
    for (const body of [
      {},
      { ...validBody, email: "nope" },
      { ...validBody, password: "short" },
      { ...validBody, role: "superadmin" },
    ]) {
      const res = await request(app)
        .post("/api/users")
        .set("Cookie", cookieFor(ADMIN))
        .send(body);
      expect(res.status).toBe(400);
    }
    expect(user.create).not.toHaveBeenCalled();
  });

  it("returns 409 for duplicate email", async () => {
    user.findUnique.mockResolvedValue({ id: "u1" });
    const res = await request(app)
      .post("/api/users")
      .set("Cookie", cookieFor(ADMIN))
      .send(validBody);
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already registered");
    expect(user.create).not.toHaveBeenCalled();
  });

  it("creates the member in the caller's org with a real hash, never leaking it", async () => {
    const created = {
      id: "user9",
      name: "New Member",
      email: "new@x.com",
      role: "employee",
    };
    user.create.mockResolvedValue(created);
    const res = await request(app)
      .post("/api/users")
      .set("Cookie", cookieFor(ADMIN))
      .send(validBody);
    expect(res.status).toBe(201);
    const arg = user.create.mock.calls[0][0];
    expect(arg.data).toMatchObject({
      orgId: ORG_ID,
      name: "New Member",
      email: "new@x.com",
      role: "employee",
    });
    expect(arg.data.password).not.toBe("memberpass1");
    expect(await bcrypt.compare("memberpass1", arg.data.password)).toBe(true);
    expect(res.body.user).toEqual(created);
    expect(JSON.stringify(res.body)).not.toContain("password");
  });
});

describe("DELETE /api/users/:userId", () => {
  const target = {
    id: "123e4567-e89b-12d3-a456-426614174009",
    orgId: ORG_ID,
    name: "Gone",
    email: "gone@x.com",
    role: "employee",
  };

  it("returns 400 for a malformed id", async () => {
    const res = await request(app)
      .delete("/api/users/nope")
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(400);
    expect(user.delete).not.toHaveBeenCalled();
  });

  it("returns 403 for employees", async () => {
    const res = await request(app)
      .delete(`/api/users/${target.id}`)
      .set("Cookie", cookieFor(EMP));
    expect(res.status).toBe(403);
  });

  it("returns 409 when deleting your own account", async () => {
    const res = await request(app)
      .delete(`/api/users/${ADMIN_ID}`)
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(409);
    expect(user.delete).not.toHaveBeenCalled();
  });

  it("returns 409 when deleting the last admin", async () => {
    user.findUnique.mockResolvedValue({ ...target, role: "admin" });
    user.count.mockResolvedValue(1);
    const res = await request(app)
      .delete(`/api/users/${target.id}`)
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Cannot delete the last admin");
    expect(user.delete).not.toHaveBeenCalled();
  });

  it("returns 404 for another org's user", async () => {
    user.findUnique.mockResolvedValue({ ...target, orgId: OTHER_ORG_ID });
    const res = await request(app)
      .delete(`/api/users/${target.id}`)
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(404);
    expect(user.delete).not.toHaveBeenCalled();
  });

  it("returns 409 when the member still has tasks (no cascading deletes)", async () => {
    user.findUnique.mockResolvedValue(target);
    user.count.mockResolvedValue(3);
    user.delete.mockRejectedValue({ code: "P2003", message: "FK violation" });
    const res = await request(app)
      .delete(`/api/users/${target.id}`)
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Reassign or resolve their tasks first");
  });

  it("deletes the member", async () => {
    user.findUnique.mockResolvedValue(target);
    user.count.mockResolvedValue(3);
    user.delete.mockResolvedValue(target);
    const res = await request(app)
      .delete(`/api/users/${target.id}`)
      .set("Cookie", cookieFor(ADMIN));
    expect(res.status).toBe(200);
    expect(user.delete).toHaveBeenCalledWith({ where: { id: target.id } });
  });
});
