import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import Dialog, { DialogError } from "../Common/Dialog";
import Avatar from "../Common/Avatar";
import { describeDue, formatShortDate } from "../../services/dateLabels";

/** task: { id, title, name, description, duedate } */
export default function DeleteTaskModal({ isOpen, onClose, task, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!task) return null;

  const close = () => {
    if (busy) return;
    setError("");
    onClose();
  };

  const handleDelete = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm(task.id);
      onClose();
    } catch (err) {
      setError(err?.message || "Couldn't delete this task. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={close} size="sm" labelledBy="delete-task-title" dismissible={!busy}>
      <div className="px-6 pt-7 pb-6 space-y-5">
        <div className="flex items-start gap-4">
          <span className="inline-flex w-11 h-11 shrink-0 items-center justify-center rounded-2xl bg-peony/50 text-red-500">
            <HiOutlineTrash className="w-5 h-5" />
          </span>
          <div>
            <h2 id="delete-task-title" className="text-lg font-semibold text-ink tracking-tight">
              Delete this task?
            </h2>
            <p className="mt-1 text-sm text-slate leading-relaxed">
              It's removed for everyone{task.name ? `, including ${task.name.split(" ")[0]}` : ""}. This can't be undone.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-mist/70 bg-cloud/60 px-4 py-3.5">
          <p className="text-sm font-semibold text-ink line-clamp-2">{task.title || task.description}</p>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-iron">
            {task.name && (
              <span className="flex items-center gap-1.5 min-w-0">
                <Avatar name={task.name} size="xs" />
                <span className="truncate">{task.name}</span>
              </span>
            )}
            {task.duedate && (
              <span className="shrink-0">
                {describeDue(task.duedate).label} · {formatShortDate(task.duedate)}
              </span>
            )}
          </div>
        </div>

        <DialogError>{error}</DialogError>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={close}
            disabled={busy}
            className="px-4 py-2.5 rounded-pill text-sm font-medium text-slate border border-mist hover:bg-cloud transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-pill text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {busy && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {busy ? "Deleting…" : "Delete task"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
