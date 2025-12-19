import { createContext, useContext, useState } from "react";
import {
  fetchAllTasks,
  fetchTasksByEmployee,
  createTask as createTaskService,
  updateTaskStatus as updateTaskStatusService,
} from "../services/taskService";
import { useAuthContext } from "./AuthContext";

const TaskContext = createContext(null);

export const TaskContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks based on role
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedTasks = [];

      if (!user) {
        throw new Error("No user logged in");
      }

      if (user.role === "admin") {
        fetchedTasks = await fetchAllTasks();
      } else {
        fetchedTasks = await fetchTasksByEmployee(user.id);
      }

      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Admin creates new task
  const createTask = async (task) => {
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    setLoading(true);
    setError(null);

    try {
      const newTask = await createTaskService({ ...task, assignedBy: user.id });
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Employee updates task status
  const updateTaskStatus = async (taskId, status) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTask = await updateTaskStatusService(taskId, status);
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Optional: Get dashboard stats for employee
  const getDashboardStats = () => {
    if (!user) return {};

    const myTasks =
      user.role === "admin"
        ? tasks
        : tasks.filter((t) => t.assignedTo === user.id);

    const stats = { assigned: 0, in_progress: 0, completed: 0, failed: 0 };

    myTasks.forEach((task) => {
      if (stats[task.status] !== undefined) stats[task.status]++;
    });

    return stats;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTaskStatus,
        getDashboardStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskContext = () => useContext(TaskContext);
