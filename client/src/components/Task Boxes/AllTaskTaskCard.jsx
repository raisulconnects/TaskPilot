import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineUser,
} from "react-icons/hi2";
import EditTaskModal from "../Modals/EditTaskModal";
import DeleteTaskModal from "../Modals/DeleteTaskModal";

export default function AllTaskTaskCard({
  name,
  description,
  status,
  id,
  duedate,
}) {
  const { deleteATask, taskEdit } = useTaskContext();
  const [expanded, setExpanded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const isLongDescription = description && description.length > 50;

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-3 md:gap-0 ${taskColor.bg} ${taskColor.border} px-4 py-3.5 rounded-2xl text-ink transition-colors duration-200 border`}
      >
        {/* Assignee */}
        <div className="md:col-span-1">
          <span className="text-xs text-iron md:hidden font-medium">Assigned To:</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white border border-mist/80 flex items-center justify-center text-xs font-bold text-slate shadow-xs">
              {name ? name.charAt(0).toUpperCase() : <HiOutlineUser className="w-3.5 h-3.5" />}
            </div>
            <span className="font-semibold text-sm text-ink">{name || "Unassigned"}</span>
          </div>
        </div>

        {/* Task Description & Due Date */}
        <div className="md:col-span-1 pr-2">
          <span className="text-xs text-iron md:hidden font-medium">Task:</span>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-slate">
              <span className={expanded ? "block leading-relaxed" : "line-clamp-1"}>
                {description}
              </span>
              
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-monday-violet hover:text-[#4e4ee0] mt-1 transition-colors cursor-pointer"
                >
                  <span>{expanded ? "Show less" : "Show more"}</span>
                  <HiChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-iron mt-0.5">
              <HiOutlineCalendar className="w-3.5 h-3.5" />
              <span>Due {new Date(duedate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="md:col-span-1">
          <span className="text-xs text-iron md:hidden font-medium">Status:</span>
          <span className="md:flex md:justify-end">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${taskColor.badge}`}
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
