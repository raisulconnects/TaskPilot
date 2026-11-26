import { describe, it, expect } from "vitest";
import { passwordStrength } from "./passwordStrength";

describe("passwordStrength", () => {
  it("rejects anything under 8 characters", () => {
    expect(passwordStrength("")).toEqual({ score: 0, label: "Too short" });
    expect(passwordStrength("Ab1!xyz")).toEqual({ score: 0, label: "Too short" });
  });

  it("rates a plain 8-character password as weak", () => {
    expect(passwordStrength("abcdefgh").score).toBe(1);
  });

  it("rewards length, mixed case, and digits with symbols", () => {
    expect(passwordStrength("abcdefghijkl").score).toBe(2);
    expect(passwordStrength("Abcdefghijkl").score).toBe(3);
    expect(passwordStrength("Abcdefghij1!")).toEqual({ score: 4, label: "Strong" });
  });

  it("needs both a digit and a symbol for the last point", () => {
    expect(passwordStrength("Abcdefghijk1").score).toBe(3);
  });
});
