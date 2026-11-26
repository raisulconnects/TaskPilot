import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import Dialog, { DialogError } from "../Common/Dialog";

export default function CompleteTaskModal({ isOpen, onClose, taskTitle, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (busy) return;
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err?.message || "Couldn't mark this task complete. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={close} size="sm" labelledBy="complete-task-title" dismissible={!busy}>
      <div className="px-6 pt-7 pb-6 space-y-5">
        <div className="flex items-start gap-4">
          <span className="inline-flex w-11 h-11 shrink-0 items-center justify-center rounded-2xl bg-mint/50 text-forest">
            <HiCheck className="w-5 h-5" />
          </span>
          <div>
            <h2 id="complete-task-title" className="text-lg font-semibold text-ink tracking-tight">
              Mark as complete?
            </h2>
            <p className="mt-1 text-sm text-slate leading-relaxed">
              Your admin sees it the moment you confirm.
            </p>
          </div>
        </div>

        {taskTitle && (
          <div className="rounded-2xl border border-mist/70 bg-cloud/60 px-4 py-3.5">
            <p className="text-sm font-semibold text-ink line-clamp-2">{taskTitle}</p>
          </div>
        )}

        <DialogError>{error}</DialogError>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={close}
            disabled={busy}
            className="px-4 py-2.5 rounded-pill text-sm font-medium text-slate border border-mist hover:bg-cloud transition-colors cursor-pointer"
          >
            Not yet
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-pill text-sm font-medium text-white bg-monday-violet hover:bg-ultra-violet disabled:opacity-60 transition-colors cursor-pointer"
          >
            {busy ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiCheck className="w-4 h-4" />
            )}
            {busy ? "Saving…" : "Yes, it's done"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
