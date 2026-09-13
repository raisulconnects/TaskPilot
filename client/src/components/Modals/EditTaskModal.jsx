import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePencilSquare,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  onSave,
}) {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("assigned");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
      setStatus(task.status || "assigned");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave(task.id, {
        description: description.trim(),
        status,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setIsSubmitting(false);
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
          className="relative bg-white rounded-3xl border border-mist shadow-elevated w-full max-w-lg p-6 sm:p-7 z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-periwinkle/40 border border-periwinkle/60 text-monday-violet flex items-center justify-center shadow-xs">
                <HiOutlinePencilSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Edit Task</h3>
                <p className="text-xs text-iron">Update the task details and status</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-iron hover:text-ink hover:bg-cloud transition-colors cursor-pointer"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Assignee Field (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                Assigned To
              </label>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-cloud/70 border border-mist rounded-2xl text-ink text-sm">
                <HiOutlineUser className="w-4 h-4 text-iron" />
                <span className="font-medium">{task.name || "Assigned Employee"}</span>
                {task.duedate && (
                  <span className="ml-auto text-xs text-iron">
                    Due: {new Date(task.duedate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                Task Description
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed task description..."
                  required
                  className="w-full px-4 py-3 bg-cloud/40 border border-mist rounded-2xl text-ink text-sm placeholder:text-iron/50 focus:outline-none focus:border-monday-violet focus:ring-2 focus:ring-monday-violet/20 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-cloud/40 border border-mist rounded-2xl text-ink text-sm focus:outline-none focus:border-monday-violet focus:ring-2 focus:ring-monday-violet/20 focus:bg-white transition-all cursor-pointer font-medium"
              >
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate bg-cloud hover:bg-mist/30 border border-mist transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-monday-violet hover:bg-[#4e4ee0] shadow-soft transition-all cursor-pointer disabled:opacity-50"
              >
                <HiOutlineCheckCircle className="w-4 h-4" />
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
