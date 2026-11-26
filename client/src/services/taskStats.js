// Pure aggregations over the task list, shared by the admin and employee
// dashboards (stat cards + charts). Unit tested in taskStats.test.js.

const STATUSES = ["assigned", "completed", "failed"];

export function computeStats(tasks = []) {
  const stats = { total: tasks.length, assigned: 0, completed: 0, failed: 0, rate: 0 };
  for (const t of tasks) {
    if (STATUSES.includes(t.status)) stats[t.status] += 1;
  }
  stats.rate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  return stats;
}

/**
 * Per-person task counts by status. `people` (optional) seeds the list so
 * members with zero tasks still show up.
 */
export function workloadByPerson(tasks = [], people = []) {
  const map = new Map();
  for (const p of people) {
    map.set(p.id, { id: p.id, name: p.name, assigned: 0, completed: 0, failed: 0, total: 0 });
  }
  for (const t of tasks) {
    const who = t.assignedTo;
    if (!who?.id) continue;
    if (!map.has(who.id)) {
      map.set(who.id, { id: who.id, name: who.name, assigned: 0, completed: 0, failed: 0, total: 0 });
    }
    const row = map.get(who.id);
    if (STATUSES.includes(t.status)) row[t.status] += 1;
    row.total += 1;
  }
  return [...map.values()];
}
