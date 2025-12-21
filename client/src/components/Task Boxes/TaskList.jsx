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
        mt-5 h-80
        flex gap-5 items-center
        overflow-auto
        px-4 py-2
        cursor-grab
        select-none
      "
    >
      {tasks.map((t) => (
        <SingleTask
          key={t._id}
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
