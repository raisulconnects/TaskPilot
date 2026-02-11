import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchAllTasks,
  fetchTasksByEmployee,
  createTask as createTaskService,
  updateTaskStatus as updateTaskStatusService,
  deleteTaskStatus as deleteTaskStatusService,
  updateTaskEdit as updateTaskEditService,
  fetchAllEmployeeInfo,
} from "../services/taskService";
import { useAuthContext } from "./AuthContext";

const TaskContext = createContext(null);

export const TaskContextProvider = ({ children }) => {
  const { user, socket } = useAuthContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allEmployees, setAllEmployees] = useState(null);

  // THIS IS FOR SOCKET IO WORKING
  useEffect(() => {
    if (!socket || !user) return;

    const handleTaskAssigned = (task) => {
      console.log("🆕 Task received via socket:", task);

      setTasks((prev) => {
        // prevent duplicates
        const exists = prev.some((t) => t._id === task._id);
        if (exists) return prev;
        return [task, ...prev];
      });
    };

    socket.on("task-assigned", handleTaskAssigned);

    const adminRealtimeTaskFetcher = (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
      );
    };

    socket.on("task:updated", adminRealtimeTaskFetcher);

    return () => {
      socket.off("task-assigned", handleTaskAssigned);
      socket.off("task:updated", adminRealtimeTaskFetcher);
    };
  }, [socket, user]);

  const fetchOnlyEmployees = async () => {
    try {
      const info = await fetchAllEmployeeInfo();
      setAllEmployees(info);
    } catch (e) {
      setError(e.message);
      // console.log("Error from TaskContext fetchOnlyEmployees.", e.message);
    }
  };

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

  // inside TaskContext.jsx
  const markTaskCompleted = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, status: "completed" } : t,
      ),
    );

    // console.log("From MarkTaskCompleted = TaskContext");
  };

  // Admin creates new task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);

    try {
      const newTask = await createTaskService(taskData);
      setTasks((prev) => [newTask, ...prev]); // optional
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Employee updates task status
  const updateTaskStatus = async (taskId) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTask = await updateTaskStatusService(taskId);
      fetchTasks();
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin Can Delete A Particular Task From the Admin Dashboard
  const deleteATask = async (taskId) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTask = await deleteTaskStatusService(taskId);
      fetchTasks();
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin Edits a Particular Assigned Task From Admindashboard  ----------- WORKING HERE
  const taskEdit = async (taskId, taskData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTask = await updateTaskEditService(taskId, taskData);
      fetchTasks();
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
        : tasks.filter((t) => t.assignedTo._id === user.id);

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
        markTaskCompleted,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTaskStatus,
        getDashboardStats,
        fetchOnlyEmployees,
        allEmployees,
        deleteATask,
        taskEdit,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskContext = () => useContext(TaskContext);
