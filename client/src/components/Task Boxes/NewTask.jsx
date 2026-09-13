import { motion } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import { useEffect } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const cardVariant = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

const statCards = [
  {
    key: "completed",
    label: "Completed Tasks",
    bg: "bg-mint/20",
    border: "border-mint/40",
    iconBg: "bg-mint/40",
    textColor: "text-forest",
    icon: HiOutlineCheckCircle,
  },
  {
    key: "assigned",
    label: "Assigned Tasks",
    bg: "bg-periwinkle/25",
    border: "border-periwinkle/50",
    iconBg: "bg-periwinkle/50",
    textColor: "text-monday-violet",
    icon: HiOutlineClipboardDocumentList,
  },
  {
    key: "failed",
    label: "Failed Tasks",
    bg: "bg-peony/20",
    border: "border-peony/40",
    iconBg: "bg-peony/40",
    textColor: "text-red-500",
    icon: HiOutlineExclamationTriangle,
  },
];

export default function NewTask() {
  const { getDashboardStats, fetchTasks, loading } = useTaskContext();

  useEffect(() => {
    fetchTasks(); // fetch tasks when component mounts
  }, []);

  // Recompute stats after tasks are loaded
  const stats = getDashboardStats();

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-monday-violet border-t-transparent rounded-full animate-spin" />
          <p className="text-slate text-sm font-medium">Loading tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            className={`${card.bg} ${card.border} border rounded-3xl p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-200`}
          >
            <div
              className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
            <div>
              <div className={`text-3xl font-bold ${card.textColor}`}>
                {stats[card.key] ?? 0}
              </div>
              <div className="text-sm font-medium text-slate mt-0.5">
                {card.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
