import { useEffect, useMemo, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineQueueList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import PageHeader from "../Common/PageHeader";
import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";
import { greeting } from "../../services/dateLabels";
import { computeStats } from "../../services/taskStats";
import StatCards from "./StatCards";
import TasksTable from "./TasksTable";
import CreateTaskPanel from "./CreateTaskPanel";
import DashboardCharts from "../Analytics/DashboardCharts";

export default function AdminDashboard() {
  const { user } = useAuthContext();
  const { tasks, loading, fetchTasks, fetchOnlyEmployees, allEmployees } = useTaskContext();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchOnlyEmployees();
    // Load once on mount; realtime updates arrive over the socket.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const employees = useMemo(
    () => (allEmployees ?? []).filter((e) => e.role !== "admin"),
    [allEmployees]
  );
  const stats = useMemo(() => computeStats(tasks), [tasks]);

  const statItems = [
    { key: "total", label: "Total tasks", value: stats.total, hint: `Across ${employees.length} team member${employees.length === 1 ? "" : "s"}`, icon: HiOutlineQueueList, tone: "violet" },
    { key: "assigned", label: "Assigned", value: stats.assigned, hint: "Currently in progress", icon: HiOutlineClock, tone: "sky" },
    { key: "completed", label: "Completed", value: stats.completed, hint: "Marked done by the team", icon: HiOutlineCheckCircle, tone: "mint" },
    { key: "failed", label: "Failed", value: stats.failed, hint: "Missed their due date", icon: HiOutlineExclamationTriangle, tone: "peony" },
    { key: "rate", label: "Completion rate", value: stats.rate, suffix: "%", hint: `${stats.completed} of ${stats.total} tasks done`, icon: HiOutlineArrowTrendingUp, tone: "lavender", progress: stats.rate / 100 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title={`${greeting()}, ${user?.name?.split(" ")[0] ?? ""}`}
        subtitle="Here's how your team is doing today."
        onRefresh={fetchTasks}
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill text-sm font-medium text-snow bg-monday-violet hover:bg-ultra-violet shadow-[0_6px_20px_-8px_rgb(97_97_255/0.7)] transition-all active:scale-[0.97] cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New task
          </button>
        }
      />

      <StatCards items={statItems} />

      <DashboardCharts tasks={tasks} employees={employees} />

      <TasksTable tasks={tasks} loading={loading} />

      <CreateTaskPanel open={createOpen} onClose={() => setCreateOpen(false)} employees={employees} />
    </div>
  );
}
