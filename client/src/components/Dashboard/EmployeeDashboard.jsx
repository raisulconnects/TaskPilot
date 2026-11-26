import { useEffect, useMemo } from "react";
import {
  HiOutlineQueueList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import PageHeader from "../Common/PageHeader";
import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";
import { greeting, describeDue } from "../../services/dateLabels";
import { computeStats } from "../../services/taskStats";
import StatCards from "./StatCards";
import TaskList from "../Task Boxes/TaskList";

export default function EmployeeDashboard() {
  const { user } = useAuthContext();
  const { tasks, loading, fetchTasks } = useTaskContext();

  useEffect(() => {
    fetchTasks();
    // Load once on mount; realtime updates arrive over the socket.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const dueSoon = useMemo(
    () => tasks.filter((t) => t.status === "assigned" && describeDue(t.dueDate, t.status).tone === "soon").length,
    [tasks]
  );

  const subtitle =
    stats.assigned === 0
      ? "Nothing in progress right now. Enjoy it."
      : `You have ${stats.assigned} task${stats.assigned === 1 ? "" : "s"} in progress${
          dueSoon ? `, ${dueSoon} due in the next few days` : ""
        }.`;

  const items = [
    { key: "total", label: "My tasks", value: stats.total, hint: "Everything assigned to you", icon: HiOutlineQueueList, tone: "violet" },
    { key: "assigned", label: "In progress", value: stats.assigned, hint: dueSoon ? `${dueSoon} due soon` : "Nothing urgent", icon: HiOutlineClock, tone: "sky" },
    { key: "completed", label: "Completed", value: stats.completed, hint: "Marked done by you", icon: HiOutlineCheckCircle, tone: "mint" },
    { key: "failed", label: "Overdue", value: stats.failed, hint: "Missed their due date", icon: HiOutlineExclamationTriangle, tone: "peony" },
    { key: "rate", label: "Completion rate", value: stats.rate, suffix: "%", hint: `${stats.completed} of ${stats.total} done`, icon: HiOutlineArrowTrendingUp, tone: "lavender", progress: stats.rate / 100 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My workspace"
        title={`${greeting()}, ${user?.name?.split(" ")[0] ?? ""}`}
        subtitle={subtitle}
        onRefresh={fetchTasks}
      />
      <StatCards items={items} />
      <TaskList tasks={tasks} loading={loading} />
    </div>
  );
}
