import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import {
  validateBody,
  validateParams,
} from "../middleware/validate.middleware.js";

const schema = z.object({ title: z.string().min(3) }).strict();

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("validateBody", () => {
  it("replaces req.body with parsed data and calls next() on success", () => {
    const req = { body: { title: "  hello  " } };
    const res = mockRes();
    const next = vi.fn();
    validateBody(schema)(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.body).toEqual({ title: "  hello  " });
  });

  it("returns 400 with issues and never calls next() on failure", () => {
    const req = { body: { title: "ab", extra: 1 } };
    const res = mockRes();
    const next = vi.fn();
    validateBody(schema)(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    const payload = res.json.mock.calls[0][0];
    expect(payload.message).toBe("Validation failed");
    expect(Array.isArray(payload.issues)).toBe(true);
    expect(payload.issues.length).toBeGreaterThan(0);
  });
});

describe("validateParams", () => {
  it("calls next() for valid params", () => {
    const req = { params: { title: "ok-title" } };
    const next = vi.fn();
    validateParams(schema)(req, mockRes(), next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("returns 400 for invalid params", () => {
    const req = { params: { title: "x" } };
    const res = mockRes();
    const next = vi.fn();
    validateParams(schema)(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
