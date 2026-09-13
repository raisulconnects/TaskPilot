import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import SingleTask from "./SingleTask";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function TaskList() {
  const { tasks, fetchTasks } = useTaskContext();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Compute counts for filter pills
  const counts = useMemo(() => {
    const res = { all: tasks.length, assigned: 0, completed: 0, failed: 0 };
    tasks.forEach((t) => {
      if (res[t.status] !== undefined) res[t.status]++;
    });
    return res;
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const filterTabs = [
    { key: "all", label: "All Tasks", count: counts.all },
    { key: "assigned", label: "In Progress", count: counts.assigned },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "failed", label: "Overdue", count: counts.failed },
  ];

  return (
    <div className="bg-white rounded-3xl border border-mist shadow-card p-5 sm:p-7 space-y-6">
      {/* Header + Filter Tabs in a single clean row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Your Tasks</h2>
          <p className="text-xs text-iron mt-0.5">
            View details and update the status of your assigned tasks
          </p>
        </div>

        {/* Clean Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(tab.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.key
                  ? "bg-monday-violet text-white shadow-soft"
                  : "bg-cloud text-slate hover:bg-white hover:border-monday-violet/50 border border-mist"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-2xs ${
                  filter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-white text-iron border border-mist"
                }`}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((t) => (
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
        /* Empty State */
        <div className="py-12 text-center space-y-3 bg-cloud/30 rounded-3xl border border-dashed border-mist">
          <div className="w-12 h-12 rounded-2xl bg-periwinkle/30 border border-periwinkle/60 text-monday-violet flex items-center justify-center mx-auto">
            <HiOutlineSparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-ink">No tasks found</h4>
            <p className="text-xs text-iron max-w-sm mx-auto">
              {filter !== "all"
                ? `You have no tasks marked as "${filter}".`
                : "You have no assigned tasks in your queue right now."}
            </p>
          </div>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-monday-violet bg-white border border-monday-violet/30 hover:bg-periwinkle/20 transition-all cursor-pointer"
            >
              Show All Tasks
            </button>
          )}
        </div>
      )}
    </div>
  );
}
