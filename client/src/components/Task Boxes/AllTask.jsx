import { useEffect } from "react";
import { useTaskContext } from "../../context/TaskContext";
import AllTaskTaskCard from "./AllTaskTaskCard";

export default function AllTask() {
  const { fetchTasks, tasks } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="bg-gray-900/70 p-6 rounded-2xl space-y-4">
      {/* Header */}
      <div className="grid grid-cols-3 text-gray-400 text-sm font-semibold px-4">
        <span>Assigned To</span>
        <span>Task</span>
        <span className="text-right">Status</span>
      </div>

      {/* Task Card */}
      {tasks.map((t) => (
        <AllTaskTaskCard
          name={t?.assignedTo?.name}
          description={t?.description}
          status={t?.status}
          key={t?._id}
        />
      ))}
    </div>
  );
}
