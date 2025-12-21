import { useEffect, useState } from "react";
import { useTaskContext } from "../../context/TaskContext";

export default function CreateTask() {
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("General");
  const [assignedTo, setAssignedTo] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const { fetchOnlyEmployees, allEmployees, createTask } = useTaskContext();

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

    await createTask(taskData);
  };

  return (
    <div className="flex justify-center px-6 py-16">
      <form className="w-full max-w-4xl bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-6">
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
              required={true}
              type="text"
              placeholder="Make a Button Design"
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Assign To */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Assign To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
              required={true}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Category</label>
            <select
              required={true}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
              required={true}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General">General</option>
              <option value="Average">Average</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Description (full width) */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              required={true}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              placeholder="Describe the task..."
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-medium"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
