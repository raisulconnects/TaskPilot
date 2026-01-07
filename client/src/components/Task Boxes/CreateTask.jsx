import { useEffect, useState } from "react";
import { useTaskContext } from "../../context/TaskContext";
import DashboardCharts from "../Analytics/DashboardCharts";

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      assignedTo,
      dueDate,
      category,
      priority,
      description,
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
        }
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
        error.message
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
        }
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
        "AI model is overloaded. Please try again in a few seconds."
      );
      console.error("Category/Priority AI Error:", err.message);
    } finally {
      setCatPriLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-6 py-16">
      {/* Form Section */}
      <form className="flex-1 bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
          Create New Task
        </h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Task Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              type="text"
              placeholder="Make a Button Design"
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
            />
          </div>

          {/* Assign To */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Assign To</label>
            <select
              required
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
            >
              <option value="" disabled>
                Select an employee
              </option>
              {allEmployees
                ?.filter((emp) => emp.role !== "admin")
                .map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Due Date</label>
            <input
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Category</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
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
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Priority</label>
            <select
              required
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
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
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              placeholder="Describe the task..."
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center font-bold">
            <span className="animate-pulse">
              {error}. Please fill the whole form and try again.
            </span>
          </div>
        )}

        {aiError && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center font-bold">
            <span className="animate-pulse">{aiError}</span>
          </div>
        )}

        {catPriError && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center font-bold">
            <span className="animate-pulse">{catPriError}</span>
          </div>
        )}

        {/* AI Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handleGenerateCategoryAndPriorityAI}
            disabled={catPriLoading}
            className={`flex-1 rounded-lg py-3 font-medium transition
      ${
        catPriLoading
          ? "bg-amber-400/50 cursor-not-allowed text-gray-800"
          : "bg-amber-400 hover:bg-amber-300 text-gray-900"
      }`}
          >
            {catPriLoading ? "Generating..." : "Autofill Category and Priority"}
          </button>

          <button
            type="button"
            onClick={handleGenerateDescriptionAI}
            disabled={aiLoading}
            className={`flex-1 rounded-lg py-3 font-medium transition
      ${
        aiLoading
          ? "bg-amber-400/50 cursor-not-allowed text-gray-800"
          : "bg-amber-400 hover:bg-amber-300 text-gray-900"
      }`}
          >
            {aiLoading ? "Generating..." : "Generate Description with AI"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full rounded-lg py-3 font-medium transition
    ${
      loading
        ? "bg-amber-400/50 cursor-not-allowed text-gray-800"
        : "bg-amber-400 hover:bg-amber-300 text-gray-900"
    }`}
        >
          {loading ? "Creating Task..." : "Create Task"}
        </button>
      </form>

      {/* Dashboard Charts Section */}
      <div className="flex-1">
        <DashboardCharts />
      </div>
    </div>
  );
}
