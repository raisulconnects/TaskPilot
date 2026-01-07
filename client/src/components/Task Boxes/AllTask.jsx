import { useEffect, useState } from "react";
import { useTaskContext } from "../../context/TaskContext";
import AllTaskTaskCard from "./AllTaskTaskCard";

export default function AllTask() {
  const { fetchTasks, tasks } = useTaskContext();

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter logic
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="bg-gray-900/70 p-4 sm:p-6 rounded-2xl space-y-4">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">All Tasks</h2>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <FilterButton
            label="All"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterButton
            label="Assigned"
            active={filter === "assigned"}
            onClick={() => setFilter("assigned")}
          />

          <FilterButton
            label="Failed"
            active={filter === "failed"}
            onClick={() => setFilter("failed")}
          />

          <FilterButton
            label="Completed"
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
          />
        </div>
      </div>

      {/* Table Header - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:grid grid-cols-4 items-center text-gray-400 text-sm font-semibold px-4 py-3">
        <span>Assigned To</span>
        <span>Task</span>
        <span className="text-right">Status</span>
        <span className="text-right">Options</span>
      </div>

      {/* Task Cards */}
      {filteredTasks.length > 0 ? (
        filteredTasks.map((t) => (
          <AllTaskTaskCard
            key={t._id}
            id={t._id}
            name={t?.assignedTo?.name}
            description={t?.description}
            status={t?.status}
            duedate={t?.dueDate}
          />
        ))
      ) : (
        <p className="text-center text-gray-400 py-6">
          No tasks found for this filter.
        </p>
      )}
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
        ${
          active
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }
      `}
    >
      {label}
    </button>
  );
}
