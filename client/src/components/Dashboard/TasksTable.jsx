import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineInboxStack,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useTaskContext } from "../../context/TaskContext";
import { describeDue, formatShortDate } from "../../services/dateLabels";
import { computeStats } from "../../services/taskStats";
import { STATUS_STYLES, PRIORITY_STYLES, DUE_TONE } from "../Common/taskStyles";
import Avatar from "../Common/Avatar";
import TaskDetailModal from "../Modals/TaskDetailModal";
import EditTaskModal from "../Modals/EditTaskModal";
import DeleteTaskModal from "../Modals/DeleteTaskModal";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "assigned", label: "Assigned" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
];

const GRID = "md:grid md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1fr)_112px] md:items-center md:gap-4";

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.assigned;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium ring-1 ring-inset ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function Priority({ priority }) {
  const p = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.General;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate">
      <span className={`w-2 h-2 rounded-full ${p.dot}`} />
      {p.label}
    </span>
  );
}

function Due({ task }) {
  const due = describeDue(task.dueDate, task.status);
  return (
    <div className="leading-tight">
      <p className={`text-sm font-medium ${DUE_TONE[due.tone]}`}>{due.label}</p>
      <p className="text-xs text-iron">{formatShortDate(task.dueDate)}</p>
    </div>
  );
}

function RowActions({ onView, onEdit, onDelete }) {
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg text-iron hover:bg-snow hover:shadow-soft transition-all cursor-pointer";
  return (
    <div className="flex items-center justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
      <button onClick={onView} title="View" aria-label="View task" className={`${btn} hover:text-ink`}>
        <HiOutlineEye className="w-4 h-4" />
      </button>
      <button onClick={onEdit} title="Edit" aria-label="Edit task" className={`${btn} hover:text-monday-violet`}>
        <HiOutlinePencilSquare className="w-4 h-4" />
      </button>
      <button onClick={onDelete} title="Delete" aria-label="Delete task" className={`${btn} hover:text-red-500`}>
        <HiOutlineTrash className="w-4 h-4" />
      </button>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2 p-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-16 rounded-2xl bg-cloud animate-pulse" />
      ))}
    </div>
  );
}

export default function TasksTable({ tasks, loading }) {
  const { taskEdit, deleteATask, allEmployees } = useTaskContext();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({ type: null, task: null });

  const counts = useMemo(() => {
    const s = computeStats(tasks);
    return { all: s.total, assigned: s.assigned, completed: s.completed, failed: s.failed };
  }, [tasks]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (!q) return true;
      return [t.title, t.assignedTo?.name, t.category, t.description]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [tasks, filter, query]);

  const employees = useMemo(() => (allEmployees ?? []).filter((e) => e.role !== "admin"), [allEmployees]);

  const open = (type, task) => setModal({ type, task });
  // Keep the task while the dialog animates out.
  const close = () => setModal((m) => ({ ...m, type: null }));
  const t = modal.task;

  return (
    <section className="rounded-3xl border border-mist/70 bg-snow">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 pb-4 sm:pb-4">
        <div>
          <h2 className="text-base font-semibold text-ink">All tasks</h2>
          <p className="text-xs text-iron">Search, filter and manage everything assigned in your workspace</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div role="tablist" aria-label="Filter by status" className="flex items-center gap-1 p-1 rounded-pill bg-cloud overflow-x-auto">
            {FILTERS.map((f) => {
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(f.key)}
                  className={`relative shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-medium transition-colors cursor-pointer ${
                    on ? "text-ink" : "text-slate hover:text-ink"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="task-filter"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-pill bg-snow shadow-soft"
                    />
                  )}
                  <span className="relative">{f.label}</span>
                  <span className={`relative tabular-nums ${on ? "text-monday-violet" : "text-iron"}`}>{counts[f.key]}</span>
                </button>
              );
            })}
          </div>
          <label className="relative block">
            <span className="sr-only">Search tasks</span>
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-iron pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks or people"
              className="w-full sm:w-64 h-9 pl-9 pr-8 rounded-pill border border-mist bg-snow text-sm text-ink placeholder:text-iron/70 focus:outline-none focus:border-monday-violet focus:ring-2 focus:ring-monday-violet/15 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-iron hover:text-ink cursor-pointer"
              >
                <HiOutlineXMark className="w-3.5 h-3.5" />
              </button>
            )}
          </label>
        </div>
      </div>

      {/* Column headers */}
      <div className={`hidden ${GRID} px-6 py-2.5 border-y border-mist/70 bg-cloud/50 text-[11px] font-semibold uppercase tracking-wider text-iron`}>
        <span>Task</span>
        <span>Assignee</span>
        <span>Priority</span>
        <span>Due</span>
        <span>Status</span>
        <span className="sr-only">Actions</span>
      </div>

      {/* Rows */}
      {loading && tasks.length === 0 ? (
        <SkeletonRows />
      ) : rows.length === 0 ? (
        <div className="py-14 text-center">
          <span className="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-periwinkle text-monday-violet mb-3">
            <HiOutlineInboxStack className="w-6 h-6" />
          </span>
          <p className="text-sm font-semibold text-ink">No tasks match</p>
          <p className="text-xs text-iron mt-1">
            {tasks.length === 0 ? "Create your first task to get started." : "Try a different filter or search."}
          </p>
          {(filter !== "all" || query) && (
            <button
              onClick={() => {
                setFilter("all");
                setQuery("");
              }}
              className="mt-4 px-4 py-1.5 rounded-pill text-xs font-medium text-monday-violet border border-monday-violet/30 hover:bg-periwinkle/50 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-mist/60 md:px-2 md:py-1">
          <AnimatePresence initial={false}>
            {rows.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`group ${GRID} px-5 md:px-4 py-4 md:py-3 md:rounded-2xl md:hover:bg-cloud/70 transition-colors`}
              >
                {/* Task */}
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3 md:block">
                    <button
                      onClick={() => open("view", task)}
                      className="text-left text-sm font-semibold text-ink hover:text-monday-violet transition-colors truncate max-w-full cursor-pointer"
                    >
                      {task.title}
                    </button>
                    <span className="md:hidden shrink-0">
                      <StatusBadge status={task.status} />
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 min-w-0">
                    {task.category && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-cloud border border-mist/70 text-[11px] font-medium text-slate">
                        {task.category}
                      </span>
                    )}
                    <span className="text-xs text-iron truncate">{task.description}</span>
                  </div>
                </div>

                {/* Assignee */}
                <div className="mt-3 md:mt-0 flex items-center gap-2 min-w-0">
                  <Avatar name={task.assignedTo?.name} size="xs" />
                  <span className="text-sm text-ink truncate">{task.assignedTo?.name ?? "Unassigned"}</span>
                </div>

                {/* Mobile: priority + due inline */}
                <div className="mt-2 md:mt-0 flex items-center justify-between md:contents">
                  <div className="md:block">
                    <Priority priority={task.priority} />
                  </div>
                  <div className="text-right md:text-left">
                    <Due task={task} />
                  </div>
                </div>

                <div className="hidden md:block">
                  <StatusBadge status={task.status} />
                </div>

                <div className="mt-2 md:mt-0">
                  <RowActions
                    onView={() => open("view", task)}
                    onEdit={() => open("edit", task)}
                    onDelete={() => open("delete", task)}
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="px-6 py-3 border-t border-mist/70 text-xs text-iron">
        Showing {rows.length} of {tasks.length} task{tasks.length === 1 ? "" : "s"}
      </div>

      {/* Modals (existing components, one instance for the whole table) */}
      {t && (
        <>
          <TaskDetailModal
            isOpen={modal.type === "view"}
            onClose={close}
            task={{
              id: t.id,
              name: t.assignedTo?.name,
              title: t.title,
              description: t.description,
              priority: t.priority || "General",
              category: t.category,
              status: t.status,
              dueDate: t.dueDate,
            }}
            onEdit={() => open("edit", t)}
          />
          <EditTaskModal
            isOpen={modal.type === "edit"}
            onClose={close}
            task={t}
            employees={employees}
            onSave={(taskId, data) => taskEdit(taskId, data)}
          />
          <DeleteTaskModal
            isOpen={modal.type === "delete"}
            onClose={close}
            task={{ id: t.id, title: t.title, name: t.assignedTo?.name, description: t.description, duedate: t.dueDate }}
            onConfirm={(taskId) => deleteATask(taskId)}
          />
        </>
      )}
    </section>
  );
}
