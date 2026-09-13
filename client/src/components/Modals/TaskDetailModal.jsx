import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineXMark,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineFlag,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onMarkComplete,
}) {
  if (!isOpen || !task) return null;

  const priorityColors = {
    High: {
      badge: "bg-peony/30 text-red-500 border border-peony/50",
      icon: "text-red-500",
    },
    Average: {
      badge: "bg-lavender/60 text-ultra-violet border border-lavender",
      icon: "text-ultra-violet",
    },
    General: {
      badge: "bg-cloud text-iron border border-mist",
      icon: "text-iron",
    },
  };

  const statusConfig = {
    completed: {
      badge: "bg-mint/30 text-forest border border-mint/60",
      label: "Completed",
      icon: HiOutlineCheckCircle,
    },
    failed: {
      badge: "bg-peony/30 text-red-500 border border-peony/60",
      label: "Overdue / Failed",
      icon: HiOutlineExclamationTriangle,
    },
    assigned: {
      badge: "bg-periwinkle/30 text-monday-violet border border-periwinkle/60",
      label: "In Progress",
      icon: HiOutlineClock,
    },
  };

  const priorityStyle = priorityColors[task.priority] || priorityColors.General;
  const statusStyle = statusConfig[task.status] || statusConfig.assigned;
  const StatusIcon = statusStyle.icon;

  const isCompleted = task.status === "completed";
  const isFailed = task.status === "failed";

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
          className="relative bg-white rounded-3xl border border-mist shadow-elevated w-full max-w-xl p-6 sm:p-8 z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.badge}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusStyle.label}
              </span>

              {task.priority && (
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${priorityStyle.badge}`}
                >
                  <HiOutlineFlag className="w-3.5 h-3.5" />
                  {task.priority} Priority
                </span>
              )}

              {task.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-cloud border border-mist text-slate">
                  <HiOutlineTag className="w-3.5 h-3.5 text-iron" />
                  {task.category}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-iron hover:text-ink hover:bg-cloud transition-colors cursor-pointer"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-iron mt-2">
              <HiOutlineCalendar className="w-4 h-4 text-iron" />
              <span>Due Date: {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Description Body */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-iron uppercase tracking-wider">
              Task Description
            </h4>
            <div className="bg-cloud/60 border border-mist rounded-2xl p-4 sm:p-5 text-sm text-ink leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
              {task.description || "No description provided."}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-mist/60">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate bg-cloud hover:bg-mist/30 border border-mist transition-all cursor-pointer"
            >
              Close
            </button>

            {!isCompleted && !isFailed && onMarkComplete && (
              <button
                type="button"
                onClick={() => {
                  onMarkComplete(task.id, task.title);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-monday-violet hover:bg-[#4e4ee0] shadow-soft transition-all cursor-pointer"
              >
                <HiOutlineCheckCircle className="w-4 h-4" />
                Mark as Completed
              </button>
            )}

            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest bg-mint/30 border border-mint/60 px-4 py-2 rounded-full">
                <HiOutlineCheckCircle className="w-4 h-4" />
                Task Completed
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
