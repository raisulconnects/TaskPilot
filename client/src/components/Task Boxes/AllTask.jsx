import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import AllTaskTaskCard from "./AllTaskTaskCard";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AllTask() {
  const { fetchTasks, tasks } = useTaskContext();

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter logic
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const filters = [
    { key: "all", label: "All" },
    { key: "assigned", label: "Assigned" },
    { key: "failed", label: "Failed" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-3xl border border-mist shadow-card p-5 sm:p-6 space-y-4"
    >
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-ink">All Tasks</h2>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          {filters.map((f) => (
            <motion.button
              key={f.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === f.key
                  ? "bg-monday-violet text-white shadow-sm"
                  : "bg-cloud text-slate border border-mist hover:border-monday-violet hover:text-monday-violet"
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Table Header - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:grid grid-cols-4 items-center text-xs font-semibold text-iron uppercase tracking-wider px-4 py-2 border-b border-mist">
        <span>Assigned To</span>
        <span>Task</span>
        <span className="text-right">Status</span>
        <span className="text-right">Options</span>
      </div>

      {/* Task Cards */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
            >
              <AllTaskTaskCard
                id={t.id}
                name={t?.assignedTo?.name}
                description={t?.description}
                status={t?.status}
                duedate={t?.dueDate}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-iron text-sm font-medium">
            No tasks found for this filter.
          </p>
          <p className="text-xs text-iron/60 mt-1">
            Try selecting a different filter above.
          </p>
        </div>
      )}
    </motion.div>
  );
}
