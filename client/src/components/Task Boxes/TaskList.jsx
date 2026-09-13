import { useEffect, useRef } from "react";
import { useTaskContext } from "../../context/TaskContext";
import { useDraggable } from "react-use-draggable-scroll";
import SingleTask from "./SingleTask";

export default function TaskList() {
  const { tasks, fetchTasks } = useTaskContext();
  const scrollRef = useRef(null);

  const { events } = useDraggable(scrollRef);

  useEffect(() => {
    fetchTasks(); // load tasks on mount
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-mist shadow-card p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink mb-4">Your Tasks</h2>

      <div
        ref={scrollRef}
        {...events}
        id="TaskList"
        className="
          h-72 sm:h-80
          flex gap-4 items-stretch
          overflow-x-auto overflow-y-hidden
          pb-2
          cursor-grab
          select-none
        "
      >
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <SingleTask
              key={t.id}
              title={t.title}
              description={t.description}
              priority={t.priority}
              dueDate={t.dueDate}
              status={t.status}
              id={t.id}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-iron text-sm font-medium italic">
              You're all caught up ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
