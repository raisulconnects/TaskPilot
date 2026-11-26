import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  HiOutlineUserPlus,
  HiOutlineTrash,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineMagnifyingGlass,
  HiOutlineExclamationCircle,
  HiOutlineUsers,
} from "react-icons/hi2";
import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";
import { createMember, deleteMember } from "../../services/memberService";
import { validateMemberForm } from "../../services/validateMemberForm";
import { workloadByPerson } from "../../services/taskStats";
import PageHeader from "../Common/PageHeader";
import SlideOver from "../Common/SlideOver";
import Avatar from "../Common/Avatar";
import { STATUS_STYLES } from "../Common/taskStyles";
import { swalTheme } from "../Common/themeColors";
import { useDashboardTheme } from "../../context/DashboardThemeContext";

const EMPTY = { name: "", email: "", password: "", role: "employee" };

const inputClass =
  "w-full pl-10 pr-4 py-2.5 bg-snow border border-mist rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-none focus:border-monday-violet focus:ring-2 focus:ring-monday-violet/15 transition-all";

function Field({ id, label, icon, children }) {
  const Icon = icon;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron pointer-events-none" />}
        {children}
      </div>
    </div>
  );
}

function WorkloadBar({ row }) {
  if (!row || row.total === 0) {
    return <span className="text-xs text-iron">No tasks yet</span>;
  }
  const parts = ["completed", "assigned", "failed"];
  return (
    <div className="w-full max-w-[220px]">
      <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-cloud">
        {parts.map((k) =>
          row[k] ? (
            <span key={k} style={{ width: `${(row[k] / row.total) * 100}%`, backgroundColor: STATUS_STYLES[k].chart }} />
          ) : null
        )}
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-iron">
        {parts.map((k) => (
          <span key={k} className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_STYLES[k].chart }} />
            {row[k]} {STATUS_STYLES[k].label.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Members() {
  const { user } = useAuthContext();
  const { theme } = useDashboardTheme();
  const { allEmployees, fetchOnlyEmployees, fetchTasks, tasks } = useTaskContext();
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [serverIssues, setServerIssues] = useState([]);
  const [adding, setAdding] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchOnlyEmployees();
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const members = useMemo(() => allEmployees ?? [], [allEmployees]);
  const workload = useMemo(() => {
    const map = new Map();
    for (const row of workloadByPerson(tasks, members)) map.set(row.id, row);
    return map;
  }, [tasks, members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? members.filter((m) => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q))
      : members;
    // Admins first, then alphabetical.
    return [...list].sort(
      (a, b) => (a.role === "admin" ? 0 : 1) - (b.role === "admin" ? 0 : 1) || a.name.localeCompare(b.name)
    );
  }, [members, query]);

  const admins = members.filter((m) => m.role === "admin").length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
    if (serverIssues.length) setServerIssues([]);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setFormError("");
    setServerIssues([]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    setServerIssues([]);

    const validationError = validateMemberForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setAdding(true);
    try {
      const name = form.name.trim();
      await createMember({ name, email: form.email.trim(), password: form.password, role: form.role });
      setForm(EMPTY);
      setPanelOpen(false);
      await fetchOnlyEmployees();
      Swal.fire({
        ...swalTheme(theme),
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: `${name} was added to your workspace`,
        showConfirmButton: false,
        timer: 2400,
      });
    } catch (err) {
      setFormError(err.message || "Failed to add member.");
      if (Array.isArray(err.issues)) setServerIssues(err.issues);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = (member) => {
    Swal.fire({
      ...swalTheme(theme),
      title: `Remove ${member.name}?`,
      text: `${member.email} will lose access immediately. Their tasks must be reassigned first.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove member",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: theme === "dark" ? "#363948" : "#535768",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteMember(member.id);
        await fetchOnlyEmployees();
        await fetchTasks();
      } catch (err) {
        Swal.fire({
          ...swalTheme(theme),
          title: "Could not remove member",
          text: err.message || "Something went wrong.",
          icon: "error",
          confirmButtonColor: "#6161ff",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Team members"
        subtitle="Add people to your organization and see how work is spread across the team."
        actions={
          <button
            onClick={() => setPanelOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill text-sm font-medium text-white bg-monday-violet hover:bg-ultra-violet shadow-[0_6px_20px_-8px_rgb(97_97_255/0.7)] transition-all active:scale-[0.97] cursor-pointer"
          >
            <HiOutlineUserPlus className="w-4 h-4" />
            Add member
          </button>
        }
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl border border-mist/70 bg-snow"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 pb-4 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex w-8 h-8 items-center justify-center rounded-xl bg-periwinkle text-monday-violet">
              <HiOutlineUsers className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink leading-tight">
                {members.length} member{members.length === 1 ? "" : "s"}
              </h2>
              <p className="text-xs text-iron">
                {admins} admin{admins === 1 ? "" : "s"} · {members.length - admins} employee
                {members.length - admins === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <label className="relative block">
            <span className="sr-only">Search members</span>
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-iron pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full sm:w-64 h-9 pl-9 pr-3 rounded-pill border border-mist bg-snow text-sm text-ink placeholder:text-iron/70 focus:outline-none focus:border-monday-violet focus:ring-2 focus:ring-monday-violet/15 transition-all"
            />
          </label>
        </div>

        <div className="hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,2fr)_minmax(0,0.8fr)_48px] gap-4 px-6 py-2.5 border-y border-mist/70 bg-cloud/50 text-[11px] font-semibold uppercase tracking-wider text-iron">
          <span>Member</span>
          <span>Role</span>
          <span>Workload</span>
          <span>Completion</span>
          <span className="sr-only">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-14 text-center text-sm text-iron">
            {members.length === 0 ? "No members yet. Add your first teammate." : "No one matches that search."}
          </div>
        ) : (
          <ul className="divide-y divide-mist/60 md:px-2 md:py-1">
            {filtered.map((m) => {
              const row = workload.get(m.id);
              const isMe = m.id === user?.id;
              const rate = row?.total ? Math.round((row.completed / row.total) * 100) : null;
              return (
                <li
                  key={m.id}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,2fr)_minmax(0,0.8fr)_48px] items-center gap-x-4 gap-y-3 px-5 md:px-4 py-4 md:py-3 md:rounded-2xl md:hover:bg-cloud/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={m.name} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">
                        {m.name}
                        {isMe && <span className="ml-1.5 text-xs font-normal text-iron">(you)</span>}
                      </p>
                      <p className="text-xs text-iron truncate">{m.email}</p>
                    </div>
                  </div>

                  <div className="justify-self-end md:justify-self-start">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${
                        m.role === "admin" ? "bg-monday-violet/10 text-monday-violet" : "bg-mint/40 text-forest"
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    {m.role === "admin" && !row?.total ? (
                      <span className="text-xs text-iron">Manages the workspace</span>
                    ) : (
                      <WorkloadBar row={row} />
                    )}
                  </div>

                  <div className={`text-sm font-medium text-ink tabular-nums ${rate === null ? "hidden md:block" : ""}`}>
                    {rate === null ? <span className="text-iron">—</span> : `${rate}%`}
                    <span className="md:hidden text-xs font-normal text-iron"> completion</span>
                  </div>

                  <div className="justify-self-end">
                    {!isMe && (
                      <button
                        onClick={() => handleRemove(m)}
                        title={`Remove ${m.name}`}
                        aria-label={`Remove ${m.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-iron hover:text-red-500 hover:bg-snow hover:shadow-soft md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 transition-all cursor-pointer"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </motion.section>

      <SlideOver
        open={panelOpen}
        onClose={closePanel}
        title="Add member"
        subtitle="They can log in right away with these credentials."
        icon={HiOutlineUserPlus}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closePanel}
              className="px-4 py-2.5 rounded-pill text-sm font-medium text-slate hover:bg-cloud transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-member-form"
              disabled={adding}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium text-white bg-monday-violet hover:bg-ultra-violet disabled:opacity-60 transition-colors cursor-pointer"
            >
              {adding && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {adding ? "Adding…" : "Add member"}
            </button>
          </div>
        }
      >
        <form id="add-member-form" onSubmit={handleAdd} className="space-y-4">
          <Field id="member-name" label="Full name" icon={HiOutlineUser}>
            <input id="member-name" name="name" type="text" required autoFocus placeholder="Jordan Lee" value={form.name} onChange={handleChange} className={inputClass} />
          </Field>
          <Field id="member-email" label="Email" icon={HiOutlineEnvelope}>
            <input id="member-email" name="email" type="email" required placeholder="jordan@acme.com" value={form.email} onChange={handleChange} className={inputClass} />
          </Field>
          <Field id="member-password" label="Temporary password" icon={HiOutlineLockClosed}>
            <input id="member-password" name="password" type="password" required placeholder="At least 8 characters" value={form.password} onChange={handleChange} className={inputClass} />
          </Field>
          <div>
            <p className="block text-xs font-semibold text-slate mb-1.5">Role</p>
            <div role="radiogroup" aria-label="Role" className="grid grid-cols-2 gap-2">
              {[
                { value: "employee", label: "Employee", hint: "Sees and completes their own tasks" },
                { value: "admin", label: "Admin", hint: "Creates tasks and manages the team" },
              ].map((r) => {
                const on = form.role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => handleChange({ target: { name: "role", value: r.value } })}
                    className={`text-left rounded-2xl border p-3 transition-all cursor-pointer ${
                      on ? "border-monday-violet bg-periwinkle/60" : "border-mist bg-snow hover:border-fog"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${on ? "text-monday-violet" : "text-ink"}`}>{r.label}</p>
                    <p className="text-[11px] text-iron mt-0.5 leading-snug">{r.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {formError && (
            <div role="alert" className="rounded-xl bg-peony/30 border border-peony px-3.5 py-3 text-xs text-red-500">
              <p className="flex items-start gap-2 font-medium">
                <HiOutlineExclamationCircle className="w-4 h-4 shrink-0 mt-px" />
                {formError}
              </p>
              {serverIssues.length > 0 && (
                <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-slate">
                  {serverIssues.map((issue, idx) => (
                    <li key={idx}>
                      {issue.path}: {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>
      </SlideOver>
    </div>
  );
}
