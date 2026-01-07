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
    <div
      ref={scrollRef}
      {...events}
      id="TaskList"
      className="
        mt-4 sm:mt-5 h-72 sm:h-80
        flex gap-3 sm:gap-4 md:gap-5 items-center
        overflow-auto
        px-2 sm:px-4 py-2
        cursor-grab
        select-none
      "
    >
      {tasks.length > 0 ? (
        tasks.map((t) => (
          <SingleTask
            key={t._id}
            title={t.title}
            description={t.description}
            priority={t.priority}
            dueDate={t.dueDate}
            status={t.status}
            id={t._id}
          />
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-400 text-lg font-medium italic animate-pulse">
            You’re all caught up ✨
          </p>
        </div>
      )}
    </div>
  );
}
