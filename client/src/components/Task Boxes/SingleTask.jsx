import { useTaskContext } from "../../context/TaskContext";
import Swal from "sweetalert2";

export default function SingleTask({
  id,
  dueDate,
  priority,
  description,
  title,
  status,
}) {
  const { updateTaskStatus } = useTaskContext();
  const completed = status === "completed";

  return (
    <div
      className={`h-full shrink-0 w-120 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        completed ? "bg-green-600/80" : "bg-gray-500/80"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-700">
          {priority}
        </span>
        <span className="text-sm opacity-90 font-medium">{dueDate}</span>
      </div>

      <div className="mt-5 space-y-2">
        <h2 className="font-bold text-2xl leading-tight">{title}</h2>
        <p className="text-[15px] font-medium opacity-95 line-clamp-3">
          {description}
        </p>

        {completed ? (
          <span className="inline-block mt-2 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            ✅ Completed
          </span>
        ) : (
          <button
            onClick={() => {
              Swal.fire({
                title: "Mark task as completed?",
                text: "You won’t be able to change this.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Mark as Complete✅",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#22c55e",
                cancelButtonColor: "#374151",
              }).then((result) => {
                if (result.isConfirmed) {
                  updateTaskStatus(id);
                }
              });
            }}
            className="mt-3 px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition"
          >
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}
