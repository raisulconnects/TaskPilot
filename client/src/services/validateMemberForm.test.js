import { describe, it, expect } from "vitest";
import { validateMemberForm } from "./validateMemberForm.js";

const validForm = {
  name: "Jordan Lee",
  email: "jordan@acme.com",
  password: "memberpass1",
  role: "employee",
};

describe("validateMemberForm", () => {
  it("returns null for a complete form (either role)", () => {
    expect(validateMemberForm(validForm)).toBeNull();
    expect(validateMemberForm({ ...validForm, role: "admin" })).toBeNull();
  });

  it.each([
    ["blank name", { ...validForm, name: "  " }],
    ["bad email", { ...validForm, email: "not-an-email" }],
    ["short password", { ...validForm, password: "short" }],
    ["bad role", { ...validForm, role: "owner" }],
    ["missing role", { ...validForm, role: "" }],
  ])("returns an error message for %s", (_label, form) => {
    expect(typeof validateMemberForm(form)).toBe("string");
  });
});
