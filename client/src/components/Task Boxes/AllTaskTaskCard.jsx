import { useTaskContext } from "../../context/TaskContext";
import Swal from "sweetalert2";

export default function AllTaskTaskCard({ name, description, status, id }) {
  const { deleteATask } = useTaskContext();

  // Map status to Tailwind classes
  const colorClasses = {
    completed: {
      bg: "bg-green-500/15",
      border: "border-green-500/30",
      text: "text-green-400",
      hover: "hover:bg-green-500/25",
    },
    assigned: {
      bg: "bg-blue-500/15",
      border: "border-blue-500/30",
      text: "text-blue-400",
      hover: "hover:bg-blue-500/25",
    },
    pending: {
      bg: "bg-red-500/15",
      border: "border-red-500/30",
      text: "text-red-400",
      hover: "hover:bg-red-500/25",
    },
  };

  const taskColor = colorClasses[status] || colorClasses.pending;

  return (
    <div
      className={`grid grid-cols-4 items-center ${taskColor.bg} ${taskColor.border} px-4 py-4 rounded-xl text-white ${taskColor.hover} transition`}
    >
      <span className="font-medium">{name}</span>
      <span className="text-gray-200 truncate">{description}</span>
      <span className={`text-right ${taskColor.text} font-semibold`}>
        {status}
      </span>
      <span className="text-right">
        <button
          className="
      inline-flex items-center justify-center
      h-9 w-9
      rounded-lg
      border border-red-500/40
      text-red-400
      hover:bg-red-500/15
      hover:text-red-300
      transition
      font-semibold
    "
          title="Delete Task"
          onClick={() => {
            Swal.fire({
              title: "Delete this task?",
              text: "This action cannot be undone.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, delete",
              cancelButtonText: "Cancel",
              confirmButtonColor: "#ef4444",
              cancelButtonColor: "#374151",
            }).then((result) => {
              if (result.isConfirmed) {
                deleteATask(id);
              }
            });
          }}
        >
          ✕
        </button>
      </span>
    </div>
  );
}
