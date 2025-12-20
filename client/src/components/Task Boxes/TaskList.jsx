import { useTaskContext } from "../../context/TaskContext";
import SingleTask from "./SingleTask";
import { useEffect } from "react";

export default function TaskList() {
  const { tasks, fetchTasks } = useTaskContext();

  useEffect(() => {
    fetchTasks(); // load tasks on mount
  }, []);

  return (
    <div
      className="mt-5 h-80 flex gap-5 items-center overflow-auto px-4 py-2"
      id="TaskList"
    >
      {tasks.map((t) => (
        <SingleTask
          key={t.id}
          title={t.title}
          description={t.description}
          priority={t.priority}
          dueDate={t.dueDate}
          status={t.status}
        />
      ))}
    </div>
  );
}
