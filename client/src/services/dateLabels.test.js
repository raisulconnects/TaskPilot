import { describe, it, expect } from "vitest";
import { describeDue, greeting, formatShortDate } from "./dateLabels";

const NOW = new Date(2026, 10, 26, 15, 0); // Nov 26 2026, 3pm local
const day = (offset) => new Date(2026, 10, 26 + offset, 9, 0);

describe("describeDue", () => {
  it("labels completed tasks as done regardless of date", () => {
    expect(describeDue(day(-5), "completed", NOW)).toMatchObject({ label: "Done", tone: "done" });
  });

  it("labels past-due tasks as overdue with a day count", () => {
    expect(describeDue(day(-1), "assigned", NOW)).toMatchObject({ label: "1 day overdue", tone: "overdue" });
    expect(describeDue(day(-7), "failed", NOW)).toMatchObject({ label: "7 days overdue", tone: "overdue" });
  });

  it("treats failed tasks as overdue even if the date is today", () => {
    expect(describeDue(day(0), "failed", NOW)).toMatchObject({ label: "1 day overdue", tone: "overdue" });
  });

  it("flags today, tomorrow and the next few days as soon", () => {
    expect(describeDue(day(0), "assigned", NOW)).toMatchObject({ label: "Due today", tone: "soon" });
    expect(describeDue(day(1), "assigned", NOW)).toMatchObject({ label: "Due tomorrow", tone: "soon" });
    expect(describeDue(day(3), "assigned", NOW)).toMatchObject({ label: "Due in 3 days", tone: "soon" });
  });

  it("uses a normal tone further out", () => {
    expect(describeDue(day(10), "assigned", NOW)).toMatchObject({ label: "Due in 10 days", tone: "normal" });
  });

  it("handles invalid dates", () => {
    expect(describeDue("nope", "assigned", NOW)).toMatchObject({ label: "No due date", days: null });
    expect(formatShortDate("nope")).toBe("—");
  });
});

describe("greeting", () => {
  it("follows the time of day", () => {
    expect(greeting(new Date(2026, 0, 1, 8))).toBe("Good morning");
    expect(greeting(new Date(2026, 0, 1, 14))).toBe("Good afternoon");
    expect(greeting(new Date(2026, 0, 1, 20))).toBe("Good evening");
  });
});
