import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";
import { computeStats } from "../../services/taskStats";
import SingleTask from "./SingleTask";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "assigned", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Overdue" },
];

// In-progress work first (soonest due on top), then completed, then missed.
const RANK = { assigned: 0, completed: 1, failed: 2 };
const byUrgency = (a, b) =>
  (RANK[a.status] ?? 3) - (RANK[b.status] ?? 3) || new Date(a.dueDate) - new Date(b.dueDate);

export default function TaskList({ tasks, loading }) {
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const s = computeStats(tasks);
    return { all: s.total, assigned: s.assigned, completed: s.completed, failed: s.failed };
  }, [tasks]);

  const visible = useMemo(
    () => tasks.filter((t) => filter === "all" || t.status === filter).sort(byUrgency),
    [tasks, filter]
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Your tasks</h2>
          <p className="text-xs text-iron">Sorted by what needs attention first</p>
        </div>
        <div role="tablist" aria-label="Filter by status" className="flex items-center gap-1 p-1 rounded-pill bg-snow border border-mist/70 overflow-x-auto">
          {FILTERS.map((f) => {
            const on = filter === f.key;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f.key)}
                className={`relative shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-medium transition-colors cursor-pointer ${
                  on ? "text-monday-violet" : "text-slate hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="my-task-filter"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-pill bg-periwinkle/70"
                  />
                )}
                <span className="relative">{f.label}</span>
                <span className={`relative tabular-nums ${on ? "text-monday-violet" : "text-iron"}`}>{counts[f.key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-snow border border-mist/70 animate-pulse" />
          ))}
        </div>
      ) : visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((t) => (
            <SingleTask
                key={t.id}
                id={t.id}
                title={t.title}
                description={t.description}
                priority={t.priority}
                category={t.category}
                dueDate={t.dueDate}
                status={t.status}
              />
            ))}
        </div>
      ) : (
        <div className="py-14 text-center rounded-3xl border border-dashed border-mist bg-snow">
          <span className="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-periwinkle text-monday-violet mb-3">
            <HiOutlineSparkles className="w-6 h-6" />
          </span>
          <p className="text-sm font-semibold text-ink">
            {filter === "all" ? "You're all caught up" : "Nothing here"}
          </p>
          <p className="text-xs text-iron mt-1">
            {filter === "all"
              ? "New tasks from your admin will show up here instantly."
              : `You have no ${FILTERS.find((f) => f.key === filter).label.toLowerCase()} tasks.`}
          </p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="mt-4 px-4 py-1.5 rounded-pill text-xs font-medium text-monday-violet border border-monday-violet/30 hover:bg-periwinkle/50 transition-colors cursor-pointer"
            >
              Show all tasks
            </button>
          )}
        </div>
      )}
    </section>
  );
}
