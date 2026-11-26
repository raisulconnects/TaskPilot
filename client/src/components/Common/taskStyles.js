// Shared visual tokens for task status / priority / due-date tone so the
// table, cards, charts and modals all speak the same colour language.

export const STATUS_STYLES = {
  assigned: { label: "Assigned", badge: "bg-sky/30 text-monday-violet ring-sky/70", dot: "bg-cornflower", chart: "#8181ff" },
  completed: { label: "Completed", badge: "bg-mint/40 text-forest ring-mint", dot: "bg-green-500", chart: "#4cc38a" },
  failed: { label: "Failed", badge: "bg-peony/40 text-red-500 ring-peony", dot: "bg-red-400", chart: "#f87171" },
};

export const PRIORITY_STYLES = {
  High: { dot: "bg-red-400", label: "High" },
  Average: { dot: "bg-amber-400", label: "Average" },
  General: { dot: "bg-fog", label: "General" },
};

export const DUE_TONE = {
  done: "text-forest",
  overdue: "text-red-500",
  soon: "text-amber-600",
  normal: "text-slate",
};

export const CATEGORIES = ["General", "Design", "Development", "Debugging"];
export const PRIORITIES = ["General", "Average", "High"];
