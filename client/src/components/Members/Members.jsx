import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  HiOutlineUserPlus,
  HiOutlineTrash,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { useTaskContext } from "../../context/TaskContext";
import { createMember, deleteMember } from "../../services/memberService";
import { validateMemberForm } from "../../services/validateMemberForm";

const inputClass =
  "w-full pl-10 pr-4 py-2.5 bg-cloud border border-pebble rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-hidden focus:border-monday-violet focus:bg-white transition-all";

function Field({ id, label, icon, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {icon}
        {children}
      </div>
    </div>
  );
}

export default function Members() {
  const { allEmployees, fetchOnlyEmployees, fetchTasks } = useTaskContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [formError, setFormError] = useState("");
  const [serverIssues, setServerIssues] = useState([]);
  const [adding, setAdding] = useState(false);
  const [listError, setListError] = useState("");

  useEffect(() => {
    fetchOnlyEmployees().catch((e) =>
      setListError(e?.message || "Failed to load members.")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
    if (serverIssues.length) setServerIssues([]);
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
      await createMember({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      setForm({ name: "", email: "", password: "", role: "employee" });
      await fetchOnlyEmployees();
      await fetchTasks();
    } catch (err) {
      setFormError(err.message || "Failed to add member.");
      if (err.issues && Array.isArray(err.issues)) {
        setServerIssues(err.issues);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = (member) => {
    Swal.fire({
      title: "Remove this member?",
      text: `${member.name} (${member.email}) will lose access immediately. Their tasks must be reassigned first.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteMember(member.id);
        await fetchOnlyEmployees();
        await fetchTasks();
      } catch (err) {
        Swal.fire({
          title: "Could not remove member",
          text: err.message || "Something went wrong.",
          icon: "error",
          confirmButtonColor: "#374151",
        });
      }
    });
  };

  const members = allEmployees || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Team Members
        </h1>
        <p className="text-slate text-sm mt-1">
          Add people to your organization and manage who has access.
        </p>
      </div>

      {listError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500 font-medium">
          {listError}
        </div>
      )}

      {/* Add member */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-mist shadow-card p-6 sm:p-8"
      >
        <h2 className="text-lg font-bold text-ink mb-1 flex items-center gap-2">
          <HiOutlineUserPlus className="w-5 h-5 text-monday-violet" />
          Add Member
        </h2>
        <p className="text-xs text-slate mb-5">
          They can log in immediately with these credentials.
        </p>

        {formError && (
          <div className="mb-5 p-4 rounded-xl bg-peony/20 border border-peony/50 text-peony text-sm flex flex-col gap-1.5">
            <div className="font-semibold">{formError}</div>
            {serverIssues.length > 0 && (
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-slate">
                {serverIssues.map((issue, idx) => (
                  <li key={idx}>
                    {issue.path}: {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Field id="member-name" label="Full Name" icon={<HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron pointer-events-none" />}>
            <input
              id="member-name"
              name="name"
              type="text"
              required
              placeholder="Jordan Lee"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field id="member-email" label="Email" icon={<HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron pointer-events-none" />}>
            <input
              id="member-email"
              name="email"
              type="email"
              required
              placeholder="jordan@acme.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field
            id="member-password"
            label="Temporary Password"
            icon={HiOutlineLockClosed}
          >
            <input
              id="member-password"
              name="password"
              type="password"
              required
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <div>
            <label
              htmlFor="member-role"
              className="block text-xs font-semibold text-slate mb-1.5"
            >
              Role
            </label>
            <select
              id="member-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`${inputClass} pl-4 cursor-pointer`}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={adding}
              className="w-full sm:w-auto px-8 py-3 bg-monday-violet hover:bg-[#4e4ee0] text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {adding ? "Adding..." : "Add Member"}
            </motion.button>
          </div>
        </form>
      </motion.section>

      {/* Member list */}
      <section className="bg-white rounded-3xl border border-mist shadow-card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-ink mb-4">
          Members ({members.length})
        </h2>
        {members.length === 0 ? (
          <p className="text-sm text-slate">
            No members yet — add your first teammate above.
          </p>
        ) : (
          <ul className="divide-y divide-mist">
            {members.map((m) => (
              <li
                key={m.id}
                className="py-3 flex items-center gap-3 first:pt-0 last:pb-0"
              >
                <div className="w-9 h-9 rounded-full bg-monday-violet/10 text-monday-violet flex items-center justify-center text-sm font-bold shrink-0">
                  {m.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">
                    {m.name}
                  </div>
                  <div className="text-xs text-iron truncate">{m.email}</div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${
                    m.role === "admin"
                      ? "bg-monday-violet/10 text-monday-violet"
                      : "bg-cloud text-slate"
                  }`}
                >
                  {m.role}
                </span>
                <button
                  onClick={() => handleRemove(m)}
                  title={`Remove ${m.name}`}
                  className="p-2 rounded-xl text-slate hover:bg-peony/20 hover:text-red-500 transition-all cursor-pointer shrink-0"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
