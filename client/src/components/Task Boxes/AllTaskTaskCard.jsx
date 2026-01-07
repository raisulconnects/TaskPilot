import { useState } from "react";
import { useTaskContext } from "../../context/TaskContext";
import Swal from "sweetalert2";

export default function AllTaskTaskCard({
  name,
  description,
  status,
  id,
  duedate,
}) {
  const { deleteATask, updateTask, taskEdit } = useTaskContext();
  const [expanded, setExpanded] = useState(false);

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

  const handleEdit = () => {
    Swal.fire({
      title: "Edit Task",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Task Name" value="${name}" disabled>
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${description}</textarea>
        <select id="swal-status" class="swal2-select">
          <option value="assigned" ${
            status === "assigned" ? "selected" : ""
          }>Assigned</option>
          <option value="completed" ${
            status === "completed" ? "selected" : ""
          }>Completed</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        return {
          description: document.getElementById("swal-desc").value,
          status: document.getElementById("swal-status").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        taskEdit(id, result.value);
        // console.log(result.value);
      }
    });
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-3 md:gap-0 ${taskColor.bg} ${taskColor.border} px-4 py-4 rounded-xl text-white ${taskColor.hover} transition border`}
    >
      <div className="md:col-span-1">
        <span className="text-xs text-gray-400 md:hidden">Assigned To:</span>
        <span className="font-medium block">{name}</span>
      </div>
      <div className="md:col-span-1">
        <span className="text-xs text-gray-400 md:hidden">Task:</span>
        <span
          className="flex flex-col gap-1"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span
            className={`text-gray-200 ${
              expanded ? "" : "truncate"
            } cursor-pointer`}
          >
            {description}
          </span>
          <span className="text-xs text-gray-400">
            Due: {new Date(duedate).toLocaleDateString()}
          </span>
        </span>
      </div>
      <div className="md:col-span-1">
        <span className="text-xs text-gray-400 md:hidden">Status:</span>
        <span className={`md:text-right ${taskColor.text} font-semibold block`}>
          {status}
        </span>
      </div>

      <div className="md:col-span-1">
        <span className="text-xs text-gray-400 md:hidden mb-2 block">Options:</span>
        <span className="flex justify-start md:justify-end gap-2">
        {/* EDIT */}
        <button
          onClick={handleEdit}
          title="Edit Task"
          className="
            h-9 w-9
            rounded-lg
            border border-yellow-500/40
            text-yellow-400
            hover:bg-yellow-500/15
            hover:text-yellow-300
            transition
            font-semibold
          "
        >
          ✎
        </button>

        {/* DELETE */}
        <button
          title="Delete Task"
          className="
            h-9 w-9
            rounded-lg
            border border-red-500/40
            text-red-400
            hover:bg-red-500/15
            hover:text-red-300
            transition
            font-semibold
          "
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
    </div>
  );
}
