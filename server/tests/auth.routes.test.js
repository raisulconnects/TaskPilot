import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createApp from "../app.js";
import prismaHelper from "./helpers/prisma-test-helper.js";

// Prisma stubs are installed on the controllers' instance via the CJS helper
// (see helpers/prisma-test-helper.js). No database is touched; bcrypt.compare
// stays real.
const user = {
  findUnique: vi.fn(),
  findMany: vi.fn(),
};

const PASSWORD_HASH = bcrypt.hashSync("correct-pw", 4);

const dbUser = {
  id: "user1",
  orgId: "org1",
  name: "Admin",
  email: "admin@x.com",
  password: PASSWORD_HASH,
  role: "admin",
};

const app = createApp();

beforeEach(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  vi.clearAllMocks();
  prismaHelper.stubPrisma({ user });
  user.findUnique.mockResolvedValue(null);
});

describe("POST /api/auth/login", () => {
  it("returns 400 for an empty body (validation, no DB hit)", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(user.findUnique).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nope", password: "x" });
    expect(res.status).toBe(400);
  });

  it("returns 401 for an unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ghost@x.com", password: "whatever" });
    expect(res.status).toBe(401);
  });

  it("returns 401 for a wrong password (real bcrypt compare)", async () => {
    user.findUnique.mockResolvedValue(dbUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@x.com", password: "wrong-pw" });
    expect(res.status).toBe(401);
  });

  it("returns 200, sets the auth cookie, and returns the user on success", async () => {
    user.findUnique.mockResolvedValue(dbUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@x.com", password: "correct-pw" });
    expect(res.status).toBe(200);
    expect(user.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@x.com" },
    });
    expect(res.body.user).toMatchObject({
      id: "user1",
      name: "Admin",
      email: "admin@x.com",
      role: "admin",
      orgId: "org1",
    });
    expect(res.headers["set-cookie"].join(";")).toContain("token=");
    const token = res.headers["set-cookie"]
      .join(";")
      .match(/token=([^;]+)/)[1];
    expect(jwt.decode(token)).toMatchObject({ id: "user1", orgId: "org1" });
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
