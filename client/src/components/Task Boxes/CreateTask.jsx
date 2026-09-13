import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import { validateTaskForm } from "../../services/validateTaskForm";
import DashboardCharts from "../Analytics/DashboardCharts";
import {
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

export default function CreateTask() {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [catPriLoading, setCatPriLoading] = useState(false);
  const [catPriError, setCatPriError] = useState("");
  const [formError, setFormError] = useState("");

  const {
    fetchOnlyEmployees,
    allEmployees,
    createTask,
    fetchTasks,
    error,
    loading,
  } = useTaskContext();

  useEffect(() => {
    fetchOnlyEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateTaskForm({
      title,
      assignedTo,
      dueDate,
      category,
      priority,
      description,
    });
    setFormError(validationError || "");
    if (validationError) return;

    const taskData = {
      title: title.trim(),
      assignedTo,
      dueDate,
      category,
      priority,
      description: description.trim(),
    };

    const success = await createTask(taskData);

    if (success) {
      await fetchTasks();

      setCategory("");
      setPriority("");
      setAssignedTo("");
      setTitle("");
      setDueDate("");
      setDescription("");
      setFormError("");
    }
  };

  const handleGenerateDescriptionAI = async () => {
    if (!title.trim()) {
      setAiError("Please enter a task title first.");
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/ai/gendesc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ title }),
        },
      );

      if (!res.ok) {
        throw new Error("AI failed to generate description");
      }

      const data = await res.json();

      // We only auto-fill description (safe & expected)
      setDescription(data.description || "");
    } catch (error) {
      setAiError(
        "AI model is overloaded. Please try again in a few seconds.",
        error.message,
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateCategoryAndPriorityAI = async () => {
    if (!title.trim()) {
      setCatPriError("Please enter a task title first.");
      return;
    }

    try {
      setCatPriLoading(true);
      setCatPriError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/ai/gencatpri`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ title }),
        },
      );

      if (!res.ok) {
        throw new Error("AI failed to generate category and priority");
      }

      const data = await res.json();

      // Auto-fill category and priority
      if (data.category) {
        setCategory(data.category);
      }
      if (data.priority) {
        setPriority(data.priority);
      }
    } catch (err) {
      setCatPriError(
        "AI model is overloaded. Please try again in a few seconds.",
      );
      console.error("Category/Priority AI Error:", err.message);
    } finally {
      setCatPriLoading(false);
    }
  };

  /* ── Shared input classes ── */
  const inputCls =
    "w-full px-4 py-2.5 bg-cloud border border-pebble rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-hidden focus:border-monday-violet focus:bg-white transition-all";
  const labelCls = "block text-xs font-semibold text-slate mb-1.5 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-6">
      {/* ── Create Task Card ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-3xl border border-mist shadow-card p-6 sm:p-8 max-w-2xl w-full"
        >
          <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-monday-violet/10 text-monday-violet flex items-center justify-center">
              <HiOutlineBolt className="w-4 h-4" />
            </span>
            Create New Task
          </h2>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Task Title */}
            <div>
              <label className={labelCls}>Task Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                type="text"
                placeholder="Make a Button Design"
                className={inputCls}
              />
            </div>

            {/* Assign To */}
            <div>
              <label className={labelCls}>Assign To</label>
              <select
                required
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={inputCls}
              >
                <option value="" disabled>
                  Select an employee
                </option>
                {allEmployees
                  ?.filter((emp) => emp.role !== "admin")
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className={labelCls}>Due Date</label>
              <input
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                className={inputCls}
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="General">General Work</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Debugging">Debugging</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className={labelCls}>Priority</label>
              <select
                required
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputCls}
              >
                <option value="" disabled>
                  Select Priority
                </option>
                <option value="General">General</option>
                <option value="Average">Average</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Describe the task..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* Error Messages */}
          {(formError || error) && (
            <div className="mt-4 rounded-xl bg-peony/30 border border-peony/60 px-4 py-3 text-xs text-apricot font-semibold flex items-center gap-2">
              <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" />
              <span>{formError || `${error}. Please complete all required fields.`}</span>
            </div>
          )}

          {aiError && (
            <div className="mt-4 rounded-xl bg-peony/30 border border-peony/60 px-4 py-3 text-xs text-apricot font-semibold flex items-center gap-2">
              <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {catPriError && (
            <div className="mt-4 rounded-xl bg-peony/30 border border-peony/60 px-4 py-3 text-xs text-apricot font-semibold flex items-center gap-2">
              <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" />
              <span>{catPriError}</span>
            </div>
          )}

          {/* AI Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGenerateCategoryAndPriorityAI}
              disabled={catPriLoading}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-semibold border transition-all cursor-pointer ${
                catPriLoading
                  ? "bg-cloud border-mist text-iron cursor-not-allowed"
                  : "bg-white border-monday-violet text-monday-violet hover:bg-monday-violet/5 shadow-2xs"
              }`}
            >
              <HiOutlineBolt className="w-4 h-4" />
              {catPriLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-monday-violet border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                "Autofill Category & Priority"
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGenerateDescriptionAI}
              disabled={aiLoading}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-semibold border transition-all cursor-pointer ${
                aiLoading
                  ? "bg-cloud border-mist text-iron cursor-not-allowed"
                  : "bg-white border-monday-violet text-monday-violet hover:bg-monday-violet/5 shadow-2xs"
              }`}
            >
              <HiOutlineSparkles className="w-4 h-4" />
              {aiLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-monday-violet border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Description with AI"
              )}
            </motion.button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 px-6 bg-monday-violet hover:bg-[#4e4ee0] text-white font-medium rounded-full shadow-soft hover:shadow-card transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Task...
              </>
            ) : (
              "Create Task"
            )}
          </motion.button>
        </form>

        {/* Dashboard Charts Section */}
        <div className="flex-1">
          <DashboardCharts />
        </div>
      </div>
    </div>
  );
}
