import { useTaskContext } from "../../context/TaskContext";
import { useEffect } from "react";

export default function NewTask() {
  const { getDashboardStats, fetchTasks, loading } = useTaskContext();

  useEffect(() => {
    fetchTasks(); // fetch tasks when component mounts
  }, []);

  // Recompute stats after tasks are loaded
  const { assigned, in_progress, completed, failed } = getDashboardStats();

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-gray-400 text-lg font-medium animate-pulse">
          Loading tasks…
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 flex gap-5">
      <div className="bg-red-400 w-80 px-10 py-10 rounded-2xl text-black">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">{completed}</div>
          <div className="text-2xl font-semibold">Completed Task</div>
        </div>
      </div>
      <div className="bg-blue-400 w-80 px-10 py-10 rounded-2xl text-black">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">{assigned}</div>
          <div className="text-2xl font-semibold">Assigned Task</div>
        </div>
      </div>
      <div className="bg-yellow-400 w-80 px-10 py-10 rounded-2xl text-black">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">{failed}</div>
          <div className="text-2xl font-semibold">Failed Task</div>
        </div>
      </div>
    </div>
  );
}
