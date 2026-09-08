import { describe, it, expect } from "vitest";
import { adminRoom, employeeRoom, userRoom } from "../config/rooms.js";

describe("socket room names", () => {
  it("namespaces every room by organization", () => {
    expect(adminRoom("org1")).toBe("org_org1:admin-room");
    expect(employeeRoom("org1")).toBe("org_org1:employee-room");
    expect(userRoom("org1", "user9")).toBe("org_org1:user_user9");
  });

  it("separates rooms across orgs for the same user", () => {
    expect(userRoom("orgA", "u1")).not.toBe(userRoom("orgB", "u1"));
    expect(adminRoom("orgA")).not.toBe(adminRoom("orgB"));
  });
});
