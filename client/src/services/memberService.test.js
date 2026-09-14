import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMember, deleteMember } from "./memberService.js";

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("createMember", () => {
  const payload = {
    name: "Jordan Lee",
    email: "jordan@acme.com",
    password: "memberpass1",
    role: "employee",
  };

  it("returns the created user on success", async () => {
    const user = { id: "u9", ...payload };
    delete user.password;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ user }),
      })
    );
    const res = await createMember(payload);
    expect(res).toEqual(user);
    expect(JSON.stringify(res)).not.toContain("password");
  });

  it("surfaces server validation issues readably", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Validation failed",
          issues: [{ path: "email", message: "Invalid email" }],
        }),
      })
    );
    await expect(createMember(payload)).rejects.toThrow(
      "Validation failed — email: Invalid email"
    );
  });

  it("surfaces duplicate and rule messages verbatim", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Email already registered" }),
      })
    );
    await expect(createMember(payload)).rejects.toThrow(
      "Email already registered"
    );
  });
});

describe("deleteMember", () => {
  it("resolves true on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Member removed" }),
      })
    );
    await expect(deleteMember("u9")).resolves.toBe(true);
  });

  it("surfaces rule violations verbatim", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Cannot delete the last admin" }),
      })
    );
    await expect(deleteMember("u9")).rejects.toThrow(
      "Cannot delete the last admin"
    );
  });
});
