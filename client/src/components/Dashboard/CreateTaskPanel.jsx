import { useState } from "react";
import Swal from "sweetalert2";
import {
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { useTaskContext } from "../../context/TaskContext";
import { validateTaskForm } from "../../services/validateTaskForm";
import { toLocalDateInput } from "../../services/dateLabels";
import { API_BASE_URL } from "../../api";
import SlideOver from "../Common/SlideOver";
import Segmented from "../Common/Segmented";
import { swalTheme } from "../Common/themeColors";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { CATEGORIES, PRIORITIES, PRIORITY_STYLES } from "../Common/taskStyles";

const EMPTY = { title: "", assignedTo: "", dueDate: "", category: "", priority: "", description: "" };

const inputCls =
  "w-full px-3.5 py-2.5 bg-snow border border-mist rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-none focus:border-monday-violet focus:ring-2 focus:ring-monday-violet/15 transition-all";

function Label({ htmlFor, children, ai }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2 text-xs font-semibold text-slate mb-1.5">
      {children}
      {ai && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-lavender text-ultra-violet text-[10px] font-semibold">
          <HiOutlineSparkles className="w-3 h-3" /> AI
        </span>
      )}
    </label>
  );
}

async function postAI(path, title) {
  const res = await fetch(`${API_BASE_URL}/ai/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("AI request failed");
  return res.json();
}

export default function CreateTaskPanel({ open, onClose, employees }) {
  const { createTask, error } = useTaskContext();
  const { theme } = useDashboardTheme();
  const [form, setForm] = useState(EMPTY);
  const [aiFilled, setAiFilled] = useState({});
  const [busy, setBusy] = useState({ catpri: false, desc: false, submit: false });
  const [message, setMessage] = useState("");
  const [submitFailed, setSubmitFailed] = useState(false);

  const set = (key, value, fromAI = false) => {
    setForm((f) => ({ ...f, [key]: value }));
    setAiFilled((a) => ({ ...a, [key]: fromAI }));
    setMessage("");
    setSubmitFailed(false);
  };

  const needTitle = () => {
    if (form.title.trim()) return false;
    setMessage("Type a task title first so the AI knows what to work with.");
    return true;
  };

  const suggestCatPri = async () => {
    if (needTitle()) return;
    setBusy((b) => ({ ...b, catpri: true }));
    try {
      const data = await postAI("gencatpri", form.title);
      if (data.category) set("category", data.category, true);
      if (data.priority) set("priority", data.priority, true);
    } catch {
      setMessage("The AI model is busy right now. Please try again in a few seconds.");
    } finally {
      setBusy((b) => ({ ...b, catpri: false }));
    }
  };

  const writeDescription = async () => {
    if (needTitle()) return;
    setBusy((b) => ({ ...b, desc: true }));
    try {
      const data = await postAI("gendesc", form.title);
      set("description", data.description || "", true);
    } catch {
      setMessage("The AI model is busy right now. Please try again in a few seconds.");
    } finally {
      setBusy((b) => ({ ...b, desc: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateTaskForm(form);
    if (invalid) {
      setMessage(invalid);
      return;
    }
    setBusy((b) => ({ ...b, submit: true }));
    const ok = await createTask({ ...form, title: form.title.trim(), description: form.description.trim() });
    setBusy((b) => ({ ...b, submit: false }));
    if (!ok) {
      // The context stores the server's reason in `error`; shown below.
      setSubmitFailed(true);
      return;
    }
    setForm(EMPTY);
    setAiFilled({});
    onClose();
    Swal.fire({
      ...swalTheme(theme),
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: "Task created and assigned",
      showConfirmButton: false,
      timer: 2200,
    });
  };

  const today = toLocalDateInput();
  const aiBtn =
    "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer disabled:cursor-wait";

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="New task"
      subtitle="Assign work to someone on your team. They'll see it instantly."
      icon={HiOutlinePlus}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-pill text-sm font-medium text-slate hover:bg-cloud transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-task-form"
            disabled={busy.submit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium text-white bg-monday-violet hover:bg-ultra-violet disabled:opacity-60 transition-colors cursor-pointer"
          >
            {busy.submit && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {busy.submit ? "Creating…" : "Create task"}
          </button>
        </div>
      }
    >
      <form id="create-task-form" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="ct-title">Title</Label>
          <input
            id="ct-title"
            autoFocus
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Fix login redirect bug"
            className={`${inputCls} text-base py-3`}
          />
        </div>

        {/* AI assist */}
        <div className="rounded-2xl border border-lavender bg-linear-to-br from-lavender/50 to-periwinkle/40 p-3.5">
          <div className="flex items-center gap-2 mb-2.5">
            <HiOutlineSparkles className="w-4 h-4 text-ultra-violet" />
            <p className="text-xs font-semibold text-ultra-violet">AI assist</p>
            <p className="text-[11px] text-slate">Powered by Gemini, based on the title</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={suggestCatPri}
              disabled={busy.catpri}
              className={`${aiBtn} bg-snow border-lavender text-ultra-violet hover:border-ultra-violet/50`}
            >
              {busy.catpri ? (
                <span className="w-3.5 h-3.5 border-2 border-ultra-violet border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiOutlineBolt className="w-4 h-4" />
              )}
              {busy.catpri ? "Thinking…" : "Suggest category & priority"}
            </button>
            <button
              type="button"
              onClick={writeDescription}
              disabled={busy.desc}
              className={`${aiBtn} bg-snow border-lavender text-ultra-violet hover:border-ultra-violet/50`}
            >
              {busy.desc ? (
                <span className="w-3.5 h-3.5 border-2 border-ultra-violet border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiOutlineSparkles className="w-4 h-4" />
              )}
              {busy.desc ? "Writing…" : "Write description"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ct-assignee">Assign to</Label>
            <select
              id="ct-assignee"
              value={form.assignedTo}
              onChange={(e) => set("assignedTo", e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="" disabled>
                Choose a teammate
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="ct-due">Due date</Label>
            <input
              id="ct-due"
              type="date"
              min={today}
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
              className={`${inputCls} cursor-pointer`}
            />
          </div>
        </div>

        <div>
          <Label ai={aiFilled.category}>Category</Label>
          <Segmented name="Category" options={CATEGORIES} value={form.category} onChange={(v) => set("category", v)} />
        </div>

        <div>
          <Label ai={aiFilled.priority}>Priority</Label>
          <Segmented
            name="Priority"
            options={PRIORITIES}
            value={form.priority}
            onChange={(v) => set("priority", v)}
            render={(p) => (
              <>
                <span className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[p].dot}`} />
                {p}
              </>
            )}
          />
        </div>

        <div>
          <Label htmlFor="ct-desc" ai={aiFilled.description}>
            Description
          </Label>
          <div className="relative">
            <textarea
              id="ct-desc"
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What needs to be done? Or let AI write it from the title."
              className={`${inputCls} resize-none`}
            />
            {busy.desc && (
              <div className="absolute inset-0 rounded-xl bg-snow/90 p-3.5 space-y-2">
                {["w-full", "w-11/12", "w-4/5", "w-2/3"].map((w) => (
                  <div key={w} className={`h-2.5 ${w} rounded-full bg-lavender animate-pulse`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {(message || submitFailed) && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-peony/30 border border-peony px-3.5 py-3 text-xs font-medium text-red-500">
            <HiOutlineExclamationCircle className="w-4 h-4 shrink-0 mt-px" />
            {message || error || "Could not create the task. Please try again."}
          </div>
        )}
      </form>
    </SlideOver>
  );
}
