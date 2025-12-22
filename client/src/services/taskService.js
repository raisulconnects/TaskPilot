import { API_BASE_URL } from "../api";

/**
 * Simulate fetching all tasks (admin)
 */
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
 * Employee updates task status
 */
export const updateTaskStatus = async (taskId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
      method: "PATCH",
    });

    if (!res.ok) {
      throw new Error("Failed to mark task as completed");
    }

    return await res.json();
  } catch (e) {
    console.log(
      "Error Occurred While Updating Task as Marking for Completion",
      e.message
    );
    throw e;
  }
};

/**
 * Admin Delete A Particular Task
 */
export const deleteTaskStatus = async (taskId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/delete`, {
      method: "delete",
    });

    if (!res.ok) {
      throw new Error("Failed to Delete Task");
    }

    return await res.json();
  } catch (e) {
    console.log("Error Occurred While Deleting Task.", e.message);
    throw e;
  }
};

// Admin Task Create korle AdminDashboard theke eita trigger korbo
export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.task;
};

// Amra Task er Pashapashi Employee er info gulao ekhane fetch kore anbo
export const fetchAllEmployeeInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/allemployees`);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(
      "Error Occured While FetchingAllEmployee Info in Task Service! ",
      e.message
    );
  }
};
