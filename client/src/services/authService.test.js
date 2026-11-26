import { describe, it, expect, vi, afterEach } from "vitest";
import { handleLogin } from "./authService";

afterEach(() => vi.unstubAllGlobals());

describe("handleLogin", () => {
  it("keeps orgId so the socket joins the right org's rooms", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          user: { id: "u1", name: "Rahim", email: "r@x.com", role: "employee", orgId: "org1" },
        }),
      })
    );

    await expect(handleLogin("r@x.com", "pw")).resolves.toEqual({
      id: "u1",
      name: "Rahim",
      email: "r@x.com",
      role: "employee",
      orgId: "org1",
    });
  });

  it("throws the server's message on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: "Invalid email or password" }) })
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(handleLogin("r@x.com", "bad")).rejects.toThrow("Invalid email or password");
  });
});
