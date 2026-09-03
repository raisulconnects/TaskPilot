import { describe, it, expect, vi, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import authCheck from "../middleware/authCheck.middleware.js";
import roleCheck from "../middleware/roleCheck.middleware.js";

beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
});

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const sign = (payload, opts) =>
  jwt.sign(payload, process.env.JWT_SECRET, opts);

describe("authCheck middleware", () => {
  it("returns 401 when no token cookie is present", () => {
    const res = mockRes();
    const next = vi.fn();
    authCheck({ cookies: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for an invalid token", () => {
    const res = mockRes();
    const next = vi.fn();
    authCheck({ cookies: { token: "garbage" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for an expired token", () => {
    const token = sign({ id: "1", role: "admin" }, { expiresIn: "-1s" });
    const res = mockRes();
    const next = vi.fn();
    authCheck({ cookies: { token } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("sets req.user and calls next() for a valid token", () => {
    const token = sign({ id: "1", role: "employee", email: "e@x.com" });
    const req = { cookies: { token } };
    const next = vi.fn();
    authCheck(req, mockRes(), next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.user.role).toBe("employee");
  });
});

describe("roleCheck middleware", () => {
  it("calls next() for an allowed role", () => {
    const next = vi.fn();
    roleCheck("admin")({ user: { role: "admin" } }, mockRes(), next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("returns 403 for a disallowed role", () => {
    const res = mockRes();
    const next = vi.fn();
    roleCheck("admin")({ user: { role: "employee" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 (not a crash) when req.user is missing", () => {
    const res = mockRes();
    const next = vi.fn();
    roleCheck("admin")({}, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
