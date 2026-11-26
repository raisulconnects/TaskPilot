import { useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import Dialog, { DialogClose, DialogError } from "../Common/Dialog";
import Segmented from "../Common/Segmented";
import { CATEGORIES, PRIORITIES, PRIORITY_STYLES, STATUS_STYLES } from "../Common/taskStyles";
import { toLocalDateInput } from "../../services/dateLabels";

const STATUSES = ["assigned", "completed", "failed"];

const inputCls =
  "w-full px-3.5 py-2.5 bg-snow border border-mist rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-none focus:border-monday-violet focus:ring-2 focus:ring-monday-violet/15 transition-all";

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate mb-1.5">
      {children}
    </label>
  );
}

// Mounted fresh each time the dialog opens, so state is seeded from the task
// once and realtime re-renders never wipe what the admin is typing.
function EditForm({ task, employees, onSave, onClose }) {
  const original = {
    title: task.title ?? "",
    description: task.description ?? "",
    assignedTo: task.assignedTo?.id ?? "",
    dueDate: toLocalDateInput(task.dueDate),
    category: task.category ?? "General",
    priority: task.priority ?? "General",
    status: task.status ?? "assigned",
  };
  const [form, setForm] = useState(original);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const changes = Object.fromEntries(
    Object.entries(form)
      .map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
      .filter(([k, v]) => v !== (typeof original[k] === "string" ? original[k].trim() : original[k]))
  );
  const dirty = Object.keys(changes).length > 0;
  const pastDue = form.dueDate && form.dueDate < toLocalDateInput(new Date()) && form.status === "assigned";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 3) return setError("Give the task a title of at least 3 characters.");
    if (!form.description.trim()) return setError("The description can't be empty.");
    if (!dirty) return onClose();

    setBusy(true);
    try {
      await onSave(task.id, changes);
      onClose();
    } catch (err) {
      setError(err?.message || "Couldn't save your changes. Please try again.");
      setBusy(false);
    }
  };

  // Keep the current assignee selectable even if they're no longer listed.
  const people = employees.some((e) => e.id === task.assignedTo?.id) || !task.assignedTo
    ? employees
    : [task.assignedTo, ...employees];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
      <div className="flex items-start gap-3 px-6 pt-6 pb-5 border-b border-mist/70">
        <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-2xl bg-periwinkle text-monday-violet">
          <HiOutlinePencilSquare className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h2 id="edit-task-title" className="text-lg font-semibold text-ink tracking-tight">Edit task</h2>
          <p className="text-xs text-iron mt-0.5">Changes reach the assignee instantly.</p>
        </div>
        <DialogClose onClose={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div>
          <Label htmlFor="et-title">Title</Label>
          <input id="et-title" value={form.title} onChange={(e) => set("title")(e.target.value)} className={inputCls} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="et-assignee">Assignee</Label>
            <select
              id="et-assignee"
              value={form.assignedTo}
              onChange={(e) => set("assignedTo")(e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="et-due">Due date</Label>
            <input
              id="et-due"
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate")(e.target.value)}
              className={`${inputCls} cursor-pointer`}
            />
          </div>
        </div>

        <div>
          <Label>Status</Label>
          <Segmented
            name="Status"
            options={STATUSES}
            value={form.status}
            onChange={set("status")}
            render={(s) => (
              <>
                <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[s].dot}`} />
                {STATUS_STYLES[s].label}
              </>
            )}
          />
          {pastDue && (
            <p className="mt-1.5 text-[11px] text-warn">
              The due date has passed, so this task will be marked failed automatically.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Category</Label>
            <Segmented name="Category" options={CATEGORIES} value={form.category} onChange={set("category")} />
          </div>
          <div>
            <Label>Priority</Label>
            <Segmented
              name="Priority"
              options={PRIORITIES}
              value={form.priority}
              onChange={set("priority")}
              render={(p) => (
                <>
                  <span className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[p].dot}`} />
                  {p}
                </>
              )}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="et-desc">Description</Label>
          <textarea
            id="et-desc"
            rows={4}
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>

        <DialogError>{error}</DialogError>
      </div>

      <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-mist/70 bg-cloud/40">
        <p className="text-xs text-iron">
          {dirty ? `${Object.keys(changes).length} change${Object.keys(changes).length === 1 ? "" : "s"}` : "No changes yet"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-pill text-sm font-medium text-slate hover:bg-cloud transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !dirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium text-white bg-monday-violet hover:bg-ultra-violet disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {busy && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

/** task: the task object from the API ({ id, title, assignedTo: { id, name }, … }) */
export default function EditTaskModal({ isOpen, onClose, task, employees = [], onSave }) {
  if (!task) return null;
  return (
    <Dialog open={isOpen} onClose={onClose} size="lg" labelledBy="edit-task-title">
      <EditForm key={task.id} task={task} employees={employees} onSave={onSave} onClose={onClose} />
    </Dialog>
  );
}
