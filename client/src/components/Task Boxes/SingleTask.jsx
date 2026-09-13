import { useState } from "react";
import { motion } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import CompleteTaskModal from "../Modals/CompleteTaskModal";
import TaskDetailModal from "../Modals/TaskDetailModal";
import {
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineTag,
} from "react-icons/hi2";

export default function SingleTask({
  id,
  dueDate,
  priority,
  category,
  description,
  title,
  status,
}) {
  const { updateTaskStatus } = useTaskContext();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Determine if task is completed or failed
  const completed = status === "completed";
  const failed = status === "failed";

  /* ── Visual config per status ── */
  const statusConfig = {
    completed: {
      border: "border-mint/60",
      accentLine: "bg-emerald-400",
      bg: "bg-white",
      badgeBg: "bg-mint/30 text-forest border border-mint/60",
      badgeLabel: "Completed",
    },
    failed: {
      border: "border-peony/60",
      accentLine: "bg-red-400",
      bg: "bg-white",
      badgeBg: "bg-peony/30 text-red-500 border border-peony/60",
      badgeLabel: "Due Date Passed",
    },
    assigned: {
      border: "border-mist",
      accentLine: "bg-monday-violet",
      bg: "bg-white",
      badgeBg: "bg-periwinkle/30 text-monday-violet border border-periwinkle/60",
      badgeLabel: "In Progress",
    },
  };

  const config = statusConfig[status] || statusConfig.assigned;

  /* ── Priority badge colors ── */
  const priorityColors = {
    High: "bg-peony/30 text-red-500 border border-peony/50",
    Average: "bg-lavender/60 text-ultra-violet border border-lavender",
    General: "bg-cloud text-iron border border-mist",
  };

  const isLongDescription = description && description.length > 80;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          relative bg-white rounded-3xl p-5 sm:p-6
          border ${config.border} shadow-card hover:shadow-soft
          transition-all duration-200 flex flex-col justify-between overflow-hidden
        `}
      >
        {/* Left Color Accent Bar */}
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${config.accentLine}`} />

        {/* Top Header: Badges */}
        <div className="flex items-center justify-between gap-2 pl-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Priority */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold uppercase tracking-wider ${
                priorityColors[priority] || priorityColors.General
              }`}
            >
              {priority || "General"}
            </span>

            {/* Category if available */}
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-medium bg-cloud border border-mist text-slate">
                <HiOutlineTag className="w-3 h-3 text-iron" />
                {category}
              </span>
            )}
          </div>
        </div>

        {/* Middle: Title & Description */}
        <div className="my-4 pl-2 space-y-2">
          <h3
            onClick={() => setIsDetailModalOpen(true)}
            className="font-bold text-base sm:text-lg text-ink leading-snug hover:text-monday-violet transition-colors cursor-pointer"
          >
            {title}
          </h3>

          <div className="text-xs sm:text-sm text-slate leading-relaxed">
            <p className="line-clamp-2">
              {description}
            </p>

            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-monday-violet hover:text-[#4e4ee0] mt-1.5 transition-colors cursor-pointer"
              >
                <span>Read full description</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar: Due Date & Action */}
        <div className="pt-3 border-t border-mist/60 flex flex-wrap items-center justify-between gap-3 pl-2">
          {/* Due Date */}
          <div className="flex items-center gap-1.5 text-xs text-iron font-medium">
            <HiOutlineCalendar className="w-4 h-4 text-iron" />
            <span>Due {new Date(dueDate).toLocaleDateString()}</span>
          </div>

          {/* Status or Mark Complete */}
          <div>
            {completed ? (
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${config.badgeBg} px-3 py-1 rounded-full`}
              >
                <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                {config.badgeLabel}
              </span>
            ) : failed ? (
              <span
                className={`inline-flex items-center text-xs font-semibold ${config.badgeBg} px-3 py-1 rounded-full`}
              >
                {config.badgeLabel}
              </span>
            ) : (
              <button
                onClick={() => setIsCompleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-monday-violet hover:bg-[#4e4ee0] text-white text-xs font-semibold transition-all shadow-xs hover:shadow-soft cursor-pointer"
              >
                <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modern Complete Task Modal */}
      <CompleteTaskModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        taskTitle={title}
        onConfirm={() => updateTaskStatus(id)}
      />

      {/* Task Full Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={{ id, title, description, priority, category, dueDate, status }}
        onMarkComplete={() => updateTaskStatus(id)}
      />
    </>
  );
}
