import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

export default function DeleteTaskModal({
  isOpen,
  onClose,
  task,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(task.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative bg-white rounded-3xl border border-mist shadow-elevated w-full max-w-md p-6 sm:p-7 z-10 space-y-5 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-iron hover:text-ink hover:bg-cloud transition-colors cursor-pointer"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>

          {/* Warning Icon Badge */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-peony/30 border border-peony/60 text-red-500 flex items-center justify-center shadow-xs">
            <HiOutlineTrash className="w-7 h-7" />
          </div>

          {/* Title and Message */}
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-ink">Delete Task</h3>
            <p className="text-xs text-iron">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
          </div>

          {/* Task preview snippet */}
          <div className="bg-cloud/60 border border-mist rounded-2xl p-3.5 text-left space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate">
              <span>Assigned: {task.name || "Employee"}</span>
              {task.duedate && (
                <span className="text-iron font-normal">
                  Due {new Date(task.duedate).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-xs text-ink line-clamp-2 italic">
              "{task.description}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-5 py-2.5 rounded-full text-xs font-semibold text-slate bg-cloud hover:bg-mist/30 border border-mist transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <HiOutlineTrash className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
