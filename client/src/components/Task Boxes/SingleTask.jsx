import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiCheck,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { useTaskContext } from "../../context/TaskContext";
import { describeDue, formatShortDate } from "../../services/dateLabels";
import { PRIORITY_STYLES, DUE_TONE } from "../Common/taskStyles";
import CompleteTaskModal from "../Modals/CompleteTaskModal";
import TaskDetailModal from "../Modals/TaskDetailModal";

const ACCENT = {
  assigned: "from-monday-violet to-prism",
  completed: "from-green-400 to-mint",
  failed: "from-red-400 to-peony",
};

export default function SingleTask({ id, dueDate, priority, category, description, title, status }) {
  const { updateTaskStatus } = useTaskContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const due = describeDue(dueDate, status);
  const p = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.General;

  const complete = async () => {
    await updateTaskStatus(id);
    setCelebrate(true);
  };

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col rounded-3xl border border-mist/70 bg-snow p-5 sm:p-6 overflow-hidden hover:shadow-card transition-shadow"
      >
        <span className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${ACCENT[status] ?? ACCENT.assigned}`} />

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate">
            <span className={`w-2 h-2 rounded-full ${p.dot}`} />
            {p.label} priority
          </span>
          {category && (
            <span className="px-1.5 py-0.5 rounded-md bg-cloud border border-mist/70 text-[11px] font-medium text-slate">
              {category}
            </span>
          )}
        </div>

        {/* Title + description */}
        <button
          onClick={() => setDetailOpen(true)}
          className="mt-3 text-left text-base sm:text-lg font-semibold text-ink leading-snug hover:text-monday-violet transition-colors cursor-pointer"
        >
          {title}
        </button>
        {description && <p className="mt-1.5 text-sm text-slate leading-relaxed line-clamp-2">{description}</p>}

        {/* Footer */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-mist/60">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-xl ${
                  due.tone === "overdue" ? "bg-peony/50" : due.tone === "soon" ? "bg-amber-50" : due.tone === "done" ? "bg-mint/40" : "bg-cloud"
                } ${DUE_TONE[due.tone]}`}
              >
                <HiOutlineCalendar className="w-4 h-4" />
              </span>
              <div className="leading-tight min-w-0">
                <p className={`text-sm font-medium truncate ${DUE_TONE[due.tone]}`}>{due.label}</p>
                <p className="text-xs text-iron">{formatShortDate(dueDate)}</p>
              </div>
            </div>

            {status === "completed" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-mint/40 text-forest text-xs font-medium">
                <HiOutlineCheckCircle className="w-4 h-4" /> Completed
              </span>
            ) : status === "failed" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-peony/40 text-red-500 text-xs font-medium">
                <HiOutlineExclamationTriangle className="w-4 h-4" /> Missed
              </span>
            ) : (
              <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-monday-violet hover:bg-ultra-violet text-snow text-xs font-medium transition-all active:scale-[0.97] cursor-pointer"
              >
                <HiOutlineCheckCircle className="w-4 h-4" />
                Mark complete
              </button>
            )}
          </div>
        </div>

        {/* Completion celebration */}
        <AnimatePresence>
          {celebrate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-snow/90 backdrop-blur-sm"
            >
              <motion.span
                initial={{ scale: 0.4, rotate: -20 }}
                animate={{ scale: [0.4, 1.15, 1], rotate: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onAnimationComplete={() => setTimeout(() => setCelebrate(false), 900)}
                className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-green-500 text-snow shadow-[0_10px_30px_-10px_rgb(34_197_94/0.8)]"
              >
                <HiCheck className="w-7 h-7" />
              </motion.span>
              <p className="text-sm font-semibold text-forest">Nice work — task completed</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>

      <CompleteTaskModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        taskTitle={title}
        onConfirm={complete}
      />
      <TaskDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={{ id, title, description, priority, category, dueDate, status }}
        onMarkComplete={complete}
      />
    </>
  );
}
