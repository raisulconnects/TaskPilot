import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import createApp from "../app.js";
import Employee from "../models/employee.model.js";

// vi.spyOn works on the models because every model file reuses the compiled
// model off Mongoose's shared singleton (see the `mongoose.models.X ||`
// guard), so the spied object is the exact one the controllers query.
const findOneSpy = vi.spyOn(Employee, "findOne");

const PASSWORD_HASH = bcrypt.hashSync("correct-pw", 4);

const dbUser = {
  _id: "user1",
  name: "Admin",
  email: "admin@x.com",
  password: PASSWORD_HASH,
  role: "admin",
};

const app = createApp();

beforeEach(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  vi.clearAllMocks();
  findOneSpy.mockResolvedValue(null);
});

describe("POST /api/auth/login", () => {
  it("returns 400 for an empty body (validation, no DB hit)", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(findOneSpy).not.toHaveBeenCalled();
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
    findOneSpy.mockResolvedValue(dbUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@x.com", password: "wrong-pw" });
    expect(res.status).toBe(401);
  });

  it("returns 200, sets the auth cookie, and returns the user on success", async () => {
    findOneSpy.mockResolvedValue(dbUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@x.com", password: "correct-pw" });
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      name: "Admin",
      email: "admin@x.com",
      role: "admin",
    });
    expect(res.headers["set-cookie"].join(";")).toContain("token=");
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
