import { describe, it, expect } from "vitest";
import {
  validateSignupForm,
  SIGNUP_ERRORS,
} from "./validateSignupForm.js";

const validForm = {
  orgName: "Acme Studios",
  name: "Alex Morgan",
  email: "alex@acme.com",
  password: "supersecret1",
  confirmPassword: "supersecret1",
};

describe("validateSignupForm", () => {
  it("returns null for a complete form", () => {
    expect(validateSignupForm(validForm)).toBeNull();
  });

  it.each([
    ["short org name", { ...validForm, orgName: "A" }, "ORG_NAME"],
    ["blank org name", { ...validForm, orgName: "   " }, "ORG_NAME"],
    ["short name", { ...validForm, name: "A" }, "NAME"],
    ["bad email", { ...validForm, email: "not-an-email" }, "EMAIL"],
    ["short password", { ...validForm, password: "short", confirmPassword: "short" }, "PASSWORD"],
    ["mismatched confirm", { ...validForm, confirmPassword: "different1" }, "CONFIRM"],
  ])("returns the %s error for %s", (_label, form, key) => {
    expect(validateSignupForm(form)).toBe(SIGNUP_ERRORS[key]);
  });
});
