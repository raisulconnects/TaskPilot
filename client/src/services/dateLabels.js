// Pure date helpers for the dashboards. Kept framework-free so they can be
// unit tested (see dateLabels.test.js).

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function formatShortDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Human label + tone for a task's due date.
 * tone: "done" | "overdue" | "soon" | "normal"
 */
export function describeDue(dueDate, status, now = new Date()) {
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return { label: "No due date", tone: "normal", days: null };

  const days = Math.round((startOfDay(due) - startOfDay(now)) / DAY_MS);

  if (status === "completed") return { label: "Done", tone: "done", days };
  if (status === "failed" || days < 0) {
    const late = Math.max(1, -days);
    return { label: `${late} day${late === 1 ? "" : "s"} overdue`, tone: "overdue", days };
  }
  if (days === 0) return { label: "Due today", tone: "soon", days };
  if (days === 1) return { label: "Due tomorrow", tone: "soon", days };
  return { label: `Due in ${days} days`, tone: days <= 3 ? "soon" : "normal", days };
}
