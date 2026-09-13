import { useState } from "react";
import { useTaskContext } from "../../context/TaskContext";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineTag,
} from "react-icons/hi2";
import EditTaskModal from "../Modals/EditTaskModal";
import DeleteTaskModal from "../Modals/DeleteTaskModal";
import TaskDetailModal from "../Modals/TaskDetailModal";

export default function AllTaskTaskCard({
  name,
  title,
  description,
  priority,
  category,
  status,
  id,
  duedate,
}) {
  const { deleteATask, taskEdit } = useTaskContext();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const colorClasses = {
    completed: {
      bg: "bg-mint/15",
      border: "border-mint/40",
      text: "text-forest",
      badge: "bg-mint/30 text-forest",
    },
    assigned: {
      bg: "bg-periwinkle/20",
      border: "border-periwinkle/50",
      text: "text-monday-violet",
      badge: "bg-periwinkle/40 text-monday-violet",
    },
    failed: {
      bg: "bg-peony/15",
      border: "border-peony/40",
      text: "text-red-500",
      badge: "bg-peony/30 text-red-500",
    },
    pending: {
      bg: "bg-cloud",
      border: "border-mist",
      text: "text-iron",
      badge: "bg-cloud text-iron",
    },
  };

  const taskColor = colorClasses[status] || colorClasses.pending;
  const taskTitle = title || (name ? `${name}'s Task` : "Task");
  const isLongDescription = description && description.length > 40;

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-3 md:gap-0 ${taskColor.bg} ${taskColor.border} px-4 py-3.5 rounded-2xl text-ink transition-colors duration-200 border`}
      >
        {/* Assignee */}
        <div className="md:col-span-1">
          <span className="text-xs text-iron md:hidden font-medium">Assigned To:</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white border border-mist/80 flex items-center justify-center text-xs font-bold text-slate shadow-xs shrink-0">
              {name ? name.charAt(0).toUpperCase() : <HiOutlineUser className="w-3.5 h-3.5" />}
            </div>
            <span className="font-semibold text-sm text-ink truncate">{name || "Unassigned"}</span>
          </div>
        </div>

        {/* Task: Title + Description preview + Show more opening modal */}
        <div className="md:col-span-1 pr-2">
          <span className="text-xs text-iron md:hidden font-medium">Task:</span>
          <div className="flex flex-col gap-0.5">
            {/* Title */}
            <span
              onClick={() => setIsDetailOpen(true)}
              className="font-bold text-sm text-ink hover:text-monday-violet transition-colors cursor-pointer block leading-tight truncate max-w-[200px]"
              title="Click to view full details"
            >
              {taskTitle}
            </span>

            {/* Description Preview — inline "…more" trigger */}
            {description && (
              <p className="text-xs text-slate leading-snug">
                {isLongDescription
                  ? description.slice(0, 55).trimEnd()
                  : description}
                {isLongDescription && (
                  <>
                    {"… "}
                    <button
                      type="button"
                      onClick={() => setIsDetailOpen(true)}
                      className="inline text-xs font-semibold text-monday-violet hover:text-[#4e4ee0] transition-colors cursor-pointer"
                    >
                      more
                    </button>
                  </>
                )}
              </p>
            )}

            {/* Due Date + Category Pill */}
            <div className="flex items-center gap-1.5 text-xs text-iron mt-0.5 flex-wrap">
              <HiOutlineCalendar className="w-3.5 h-3.5 shrink-0" />
              <span>Due {new Date(duedate).toLocaleDateString()}</span>
              {category && (
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/90 border border-mist text-slate">
                  {category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="md:col-span-1">
          <span className="text-xs text-iron md:hidden font-medium">Status:</span>
          <span className="md:flex md:justify-end">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize ${taskColor.badge}`}
            >
              {status}
            </span>
          </span>
        </div>

        {/* Options */}
        <div className="md:col-span-1">
          <span className="text-xs text-iron md:hidden mb-2 block font-medium">Options:</span>
          <span className="flex justify-start md:justify-end gap-2">
            {/* EDIT */}
            <button
              onClick={() => setIsEditOpen(true)}
              title="Edit Task"
              className="h-8 w-8 rounded-xl bg-white border border-monday-violet/30 text-monday-violet hover:bg-monday-violet hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              <HiOutlinePencilSquare className="w-4 h-4" />
            </button>

            {/* DELETE */}
            <button
              title="Delete Task"
              className="h-8 w-8 rounded-xl bg-white border border-peony/40 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
              onClick={() => setIsDeleteOpen(true)}
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </span>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={{
          id,
          name,
          title: taskTitle,
          description,
          priority: priority || "General",
          category,
          status,
          dueDate: duedate,
        }}
      />

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={{ id, name, description, status, duedate }}
        onSave={(taskId, taskData) => taskEdit(taskId, taskData)}
      />

      {/* Delete Modal */}
      <DeleteTaskModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        task={{ id, name, description, duedate }}
        onConfirm={(taskId) => deleteATask(taskId)}
      />
    </>
  );
}
