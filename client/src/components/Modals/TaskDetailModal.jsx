import { useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
  HiOutlineCalendar,
  HiOutlineFlag,
  HiOutlineTag,
  HiOutlineUser,
} from "react-icons/hi2";
import Dialog, { DialogClose, DialogError } from "../Common/Dialog";
import Avatar from "../Common/Avatar";
import { STATUS_STYLES, PRIORITY_STYLES, DUE_TONE } from "../Common/taskStyles";
import { describeDue } from "../../services/dateLabels";

const longDate = (v) =>
  new Date(v).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function Meta({ icon, label, children }) {
  const Icon = icon;
  return (
    <div className="rounded-2xl bg-cloud/70 border border-mist/60 px-3.5 py-3 min-w-0">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-iron">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </p>
      <div className="mt-1.5 text-sm text-ink min-w-0">{children}</div>
    </div>
  );
}

/**
 * task: { id, title, description, priority, category, status, dueDate, name? }
 * onMarkComplete (employee) and onEdit (admin) are optional.
 */
export default function TaskDetailModal({ isOpen, onClose, task, onMarkComplete, onEdit }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!task) return null;

  const status = STATUS_STYLES[task.status] ?? STATUS_STYLES.assigned;
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.General;
  const dueValue = task.dueDate || task.duedate;
  const due = describeDue(dueValue, task.status);
  const canComplete = onMarkComplete && task.status === "assigned";

  const close = () => {
    setError("");
    onClose();
  };

  const complete = async () => {
    setBusy(true);
    setError("");
    try {
      await onMarkComplete(task.id, task.title);
      onClose();
    } catch (err) {
      setError(err?.message || "Couldn't mark this task complete. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={close} size="lg" labelledBy="task-detail-title">
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium ring-1 ring-inset ${status.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        <DialogClose onClose={close} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-3 pb-6 space-y-5">
        <h2 id="task-detail-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-ink leading-snug break-words">
          {task.title || "Task details"}
        </h2>

        <div className={`grid gap-2.5 ${task.name ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
          {task.name && (
            <Meta icon={HiOutlineUser} label="Assignee">
              <span className="flex items-center gap-2 min-w-0">
                <Avatar name={task.name} size="xs" />
                <span className="truncate">{task.name}</span>
              </span>
            </Meta>
          )}
          <Meta icon={HiOutlineCalendar} label="Due">
            <p className={`font-medium ${DUE_TONE[due.tone]}`}>{due.label}</p>
            {dueValue && <p className="text-xs text-iron">{longDate(dueValue)}</p>}
          </Meta>
          <Meta icon={HiOutlineFlag} label="Priority">
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
          </Meta>
          <Meta icon={HiOutlineTag} label="Category">
            {task.category || "—"}
          </Meta>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-iron mb-2">Description</p>
          <div className="text-sm text-slate leading-relaxed whitespace-pre-line">
            {task.description || <span className="text-iron italic">No description provided.</span>}
          </div>
        </div>

        <DialogError>{error}</DialogError>
      </div>

      <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-mist/70 bg-cloud/40">
        <button
          type="button"
          onClick={close}
          className="px-4 py-2.5 rounded-pill text-sm font-medium text-slate hover:bg-cloud transition-colors cursor-pointer"
        >
          Close
        </button>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill text-sm font-medium text-white bg-monday-violet hover:bg-ultra-violet transition-colors cursor-pointer"
          >
            <HiOutlinePencilSquare className="w-4 h-4" />
            Edit task
          </button>
        )}
        {canComplete && (
          <button
            type="button"
            onClick={complete}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill text-sm font-medium text-white bg-monday-violet hover:bg-ultra-violet disabled:opacity-60 transition-colors cursor-pointer"
          >
            {busy ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineCheckCircle className="w-4 h-4" />
            )}
            {busy ? "Completing…" : "Mark complete"}
          </button>
        )}
      </div>
    </Dialog>
  );
}
