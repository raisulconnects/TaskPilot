import { API_BASE_URL } from "../api";

/**
 * Simulate fetching all tasks (admin)
 */
export const fetchAllTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

/**
 * Fetch tasks assigned to a specific employee
 */
export const fetchTasksByEmployee = async (employeeId) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    credentials: "include",
  });
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
      credentials: "include",
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
      credentials: "include",
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

// Edit a Particular Assigned Task ---- WORKING HERE
export const updateTaskEdit = async (taskId, taskData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/edit`, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      throw new Error("Failed to Edit Task");
    }

    return await res.json();
  } catch (e) {
    console.log("Error Occurred While Editing Task.", e.message);
    throw e;
  }
};

// Admin Task Create korle AdminDashboard theke eita trigger korbo
export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to create task");
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
