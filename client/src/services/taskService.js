import { API_BASE_URL } from "../api";
import tasksData from "../Data/tasks.json";

/**
 * Simulate fetching all tasks (admin)
 */
// export const fetchAllTasks = async () => {
//   await new Promise((res) => setTimeout(res, 500));
//   return tasksData;
// };
export const fetchAllTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  const data = await response.json();
  return data;
};

/**
 * Fetch tasks assigned to a specific employee
 */
export const fetchTasksByEmployee = async (employeeId) => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  const tasksData = await response.json();
  return tasksData.filter((task) => task.assignedTo._id === employeeId);
};

/**
 * Admin assigns a new task
 */
export const createTask = async (task) => {
  await new Promise((res) => setTimeout(res, 400));

  const newTask = {
    ...task,
    id: Date.now(),
    status: "assigned",
    createdAt: new Date().toISOString().split("T")[0],
  };

  // mock DB write (in-memory only)
  tasksData.push(newTask);

  return newTask;
};

/**
 * Employee updates task status
 */
export const updateTaskStatus = async (taskId, status) => {
  await new Promise((res) => setTimeout(res, 300));

  const task = tasksData.find((t) => t.id === taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  task.status = status;
  return task;
};
