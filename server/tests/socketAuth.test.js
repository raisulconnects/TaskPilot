import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { readCookie, identityFromCookie, socketAuthMiddleware } from "../config/socketAuth.js";

const SECRET = "test-secret";
const USER = { id: "u1", role: "employee", orgId: "org1", name: "Emp", email: "e@x.com" };
const cookieFor = (payload, secret = SECRET) => `theme=dark; token=${jwt.sign(payload, secret)}; other=1`;

describe("readCookie", () => {
  it("finds a cookie among several", () => {
    expect(readCookie("a=1; token=abc; b=2", "token")).toBe("abc");
  });

  it("returns undefined when missing or no header", () => {
    expect(readCookie("a=1", "token")).toBeUndefined();
    expect(readCookie(undefined, "token")).toBeUndefined();
  });
});

describe("identityFromCookie", () => {
  it("returns id, role and orgId from a valid token", () => {
    expect(identityFromCookie(cookieFor(USER), SECRET)).toEqual({ id: "u1", role: "employee", orgId: "org1" });
  });

  it("rejects a missing cookie", () => {
    expect(() => identityFromCookie("theme=dark", SECRET)).toThrow("Not authenticated");
  });

  it("rejects a token signed with another secret", () => {
    expect(() => identityFromCookie(cookieFor(USER, "wrong"), SECRET)).toThrow();
  });

  it("rejects an expired token", () => {
    const expired = `token=${jwt.sign({ ...USER, exp: Math.floor(Date.now() / 1000) - 10 }, SECRET)}`;
    expect(() => identityFromCookie(expired, SECRET)).toThrow();
  });

  it("rejects a token without orgId", () => {
    const { orgId: _orgId, ...noOrg } = USER;
    expect(() => identityFromCookie(cookieFor(noOrg), SECRET)).toThrow("Invalid token payload");
  });
});

describe("socketAuthMiddleware", () => {
  const socketWith = (cookie) => ({ handshake: { headers: { cookie } }, data: {} });

  it("attaches the verified identity and ignores client-claimed fields", () => {
    process.env.JWT_SECRET = SECRET;
    const socket = socketWith(cookieFor(USER));
    socket.handshake.auth = { userId: "someone-else", role: "admin", orgId: "other-org" };
    const next = vi.fn();
    socketAuthMiddleware(socket, next);
    expect(next).toHaveBeenCalledWith();
    expect(socket.data.user).toEqual({ id: "u1", role: "employee", orgId: "org1" });
  });

  it("refuses the connection without a valid cookie", () => {
    process.env.JWT_SECRET = SECRET;
    const next = vi.fn();
    socketAuthMiddleware(socketWith(undefined), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe("Not authenticated");
  });
});
