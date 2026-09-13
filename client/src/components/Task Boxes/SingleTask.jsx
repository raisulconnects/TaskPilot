import { useState } from "react";
import { useTaskContext } from "../../context/TaskContext";
import CompleteTaskModal from "../Modals/CompleteTaskModal";

export default function SingleTask({
  id,
  dueDate,
  priority,
  description,
  title,
  status,
}) {
  const { updateTaskStatus } = useTaskContext();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // Determine if task is completed
  const completed = status === "completed";
  const failed = status === "failed";

  /* ── Visual config per status ── */
  const statusConfig = {
    completed: {
      borderColor: "border-l-emerald-400",
      bg: "bg-white",
      badgeBg: "bg-mint/30",
      badgeText: "text-forest",
      badgeLabel: "✅ Completed",
    },
    failed: {
      borderColor: "border-l-red-400",
      bg: "bg-white",
      badgeBg: "bg-peony/30",
      badgeText: "text-red-500",
      badgeLabel: "❌ Due Date Passed",
    },
    assigned: {
      borderColor: "border-l-monday-violet",
      bg: "bg-white",
      badgeBg: "bg-periwinkle/30",
      badgeText: "text-monday-violet",
      badgeLabel: null,
    },
  };

  const config = statusConfig[status] || statusConfig.assigned;

  /* ── Priority badge colors ── */
  const priorityColors = {
    High: "bg-peony/30 text-red-500",
    Average: "bg-lavender/60 text-ultra-violet",
    General: "bg-cloud text-iron",
  };

  return (
    <>
      <div
        className={`
          h-full shrink-0 w-72 sm:w-80 md:w-96
          rounded-2xl p-5 shadow-card border border-mist
          border-l-4 ${config.borderColor} ${config.bg}
          hover:shadow-elevated
          transition-all duration-300
          flex flex-col
        `}
      >
        {/* Header: Priority and Due Date */}
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              priorityColors[priority] || priorityColors.General
            }`}
          >
            {priority}
          </span>
          <span className="text-xs text-iron font-medium">
            {new Date(dueDate).toLocaleDateString()}
          </span>
        </div>

        {/* Task Content */}
        <div className="mt-4 space-y-2 flex-1">
          <h2 className="font-bold text-lg text-ink leading-tight">{title}</h2>
          <p className="text-sm text-slate font-medium line-clamp-3">
            {description}
          </p>
        </div>

        {/* Status / Action Section */}
        <div className="mt-4">
          {completed ? (
            <span
              className={`inline-flex items-center text-xs font-semibold ${config.badgeBg} ${config.badgeText} px-3 py-1.5 rounded-full`}
            >
              {config.badgeLabel}
            </span>
          ) : failed ? (
            <span
              className={`inline-flex items-center text-xs font-semibold ${config.badgeBg} ${config.badgeText} px-3 py-1.5 rounded-full`}
            >
              {config.badgeLabel}
            </span>
          ) : (
            <button
              onClick={() => setIsCompleteModalOpen(true)}
              className="px-4 py-2 rounded-full bg-monday-violet hover:bg-[#4e4ee0] text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>

      {/* Modern Complete Task Modal */}
      <CompleteTaskModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        taskTitle={title}
        onConfirm={() => updateTaskStatus(id)}
      />
    </>
  );
}
