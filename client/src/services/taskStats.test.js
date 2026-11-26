import { describe, it, expect } from "vitest";
import { computeStats, workloadByPerson } from "./taskStats";

const rahim = { id: "u1", name: "Rahim" };
const karim = { id: "u2", name: "Karim" };
const nusrat = { id: "u3", name: "Nusrat" };

const tasks = [
  { status: "assigned", assignedTo: rahim },
  { status: "failed", assignedTo: rahim },
  { status: "completed", assignedTo: karim },
  { status: "assigned", assignedTo: karim },
];

describe("computeStats", () => {
  it("counts tasks by status and computes the completion rate", () => {
    expect(computeStats(tasks)).toEqual({ total: 4, assigned: 2, completed: 1, failed: 1, rate: 25 });
  });

  it("returns zeros for an empty list", () => {
    expect(computeStats([])).toEqual({ total: 0, assigned: 0, completed: 0, failed: 0, rate: 0 });
  });

  it("ignores unknown statuses in the breakdown but still counts them in the total", () => {
    expect(computeStats([{ status: "weird" }])).toMatchObject({ total: 1, assigned: 0, rate: 0 });
  });
});

describe("workloadByPerson", () => {
  it("groups counts per assignee", () => {
    const rows = workloadByPerson(tasks);
    expect(rows).toEqual([
      { id: "u1", name: "Rahim", assigned: 1, completed: 0, failed: 1, total: 2 },
      { id: "u2", name: "Karim", assigned: 1, completed: 1, failed: 0, total: 2 },
    ]);
  });

  it("keeps seeded people with no tasks", () => {
    const rows = workloadByPerson(tasks, [nusrat]);
    expect(rows[0]).toEqual({ id: "u3", name: "Nusrat", assigned: 0, completed: 0, failed: 0, total: 0 });
    expect(rows).toHaveLength(3);
  });

  it("skips tasks without an assignee", () => {
    expect(workloadByPerson([{ status: "assigned" }])).toEqual([]);
  });
});
