import { motion } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import { useEffect } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function NewTask() {
  const { getDashboardStats, fetchTasks, loading } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = getDashboardStats();
  const total = stats.total || (stats.assigned + stats.completed + stats.failed) || 0;
  const completed = stats.completed || 0;
  const assigned = stats.assigned || 0;
  const failed = stats.failed || 0;

  const statCards = [
    {
      key: "total",
      label: "Total Workload",
      value: total,
      sublabel: `${assigned} active remaining`,
      bg: "bg-white",
      border: "border-mist",
      iconBg: "bg-cloud text-monday-violet border border-mist",
      valueColor: "text-ink",
      icon: HiOutlineClipboardDocumentList,
    },
    {
      key: "assigned",
      label: "In Progress",
      value: assigned,
      sublabel: "Pending completion",
      bg: "bg-white",
      border: "border-mist",
      iconBg: "bg-periwinkle/40 text-monday-violet border border-periwinkle/70",
      valueColor: "text-monday-violet",
      icon: HiOutlineClock,
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      sublabel: "Finished tasks",
      bg: "bg-white",
      border: "border-mist",
      iconBg: "bg-mint/30 text-forest border border-mint/60",
      valueColor: "text-forest",
      icon: HiOutlineCheckCircle,
    },
    {
      key: "failed",
      label: "Overdue",
      value: failed,
      sublabel: failed > 0 ? "Past due date" : "All on schedule",
      bg: "bg-white",
      border: "border-mist",
      iconBg: "bg-peony/25 text-red-500 border border-peony/60",
      valueColor: "text-red-500",
      icon: HiOutlineExclamationTriangle,
    },
  ];

  if (loading && total === 0) {
    return (
      <div className="bg-white rounded-3xl border border-mist shadow-card p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-monday-violet border-t-transparent rounded-full animate-spin" />
          <p className="text-slate text-sm font-medium">Loading workspace stats…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            custom={i}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`${card.bg} ${card.border} border rounded-3xl p-5 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-semibold text-iron uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`w-9 h-9 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className={`text-3xl font-bold ${card.valueColor} tracking-tight`}>
                {card.value}
              </div>
              <div className="text-xs text-slate font-medium mt-1">
                {card.sublabel}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
