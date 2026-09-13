import { motion } from "framer-motion";
import { useTaskContext } from "../../context/TaskContext";
import { useEffect } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineQueueList,
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

function CircularGauge({ value, total, colorClass, trackColorClass, textClass, isRatio = false }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  // For total workload, show full ring if total > 0; otherwise calculate ratio against total
  const ratio = total > 0 ? Math.min(Math.max(value / total, 0), 1) : 0;
  const strokeDashoffset = circumference - ratio * circumference;

  return (
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 56 56">
        {/* Background Track Circle */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          strokeWidth="4.5"
          fill="none"
          className={trackColorClass}
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          className={colorClass}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: (ratio === 0 && value === 0) ? circumference : strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold tracking-tight ${textClass} ${
            isRatio ? "text-xs sm:text-sm" : "text-sm sm:text-base"
          }`}
        >
          {isRatio ? `${value}/${total}` : value}
        </span>
      </div>
    </div>
  );
}

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
      total: total,
      isRatio: false,
      sublabel: "All assigned tasks",
      bg: "bg-periwinkle/30",
      border: "border-monday-violet/40",
      titleColor: "text-monday-violet",
      textColor: "text-monday-violet",
      gaugeColor: "stroke-monday-violet",
      trackColor: "stroke-periwinkle-wash",
      iconColor: "text-monday-violet border-monday-violet/30 bg-white/90",
      icon: HiOutlineQueueList,
    },
    {
      key: "assigned",
      label: "In Progress",
      value: assigned,
      total: total,
      isRatio: true,
      sublabel: "Currently being worked on",
      bg: "bg-sky/30",
      border: "border-cornflower/60",
      titleColor: "text-slate",
      textColor: "text-monday-violet",
      gaugeColor: "stroke-monday-violet",
      trackColor: "stroke-sky/60",
      iconColor: "text-monday-violet border-cornflower/40 bg-white/90",
      icon: HiOutlineClock,
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      total: total,
      isRatio: true,
      sublabel: "Successfully finished",
      bg: "bg-mint/30",
      border: "border-mint",
      titleColor: "text-forest",
      textColor: "text-forest",
      gaugeColor: "stroke-forest",
      trackColor: "stroke-mint/60",
      iconColor: "text-forest border-mint bg-white/90",
      icon: HiOutlineCheckCircle,
    },
    {
      key: "failed",
      label: "Overdue",
      value: failed,
      total: total,
      isRatio: false,
      sublabel: "Tasks past their due date",
      bg: "bg-peony/30",
      border: "border-apricot/50",
      titleColor: "text-apricot",
      textColor: "text-apricot",
      gaugeColor: "stroke-apricot",
      trackColor: "stroke-peony/60",
      iconColor: "text-apricot border-apricot/40 bg-white/90",
      icon: HiOutlineExclamationCircle,
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
            className={`
              ${card.bg} ${card.border} border rounded-2xl sm:rounded-3xl p-4 sm:p-5
              shadow-soft hover:shadow-card transition-all duration-200
              flex items-center gap-3 sm:gap-4 relative overflow-hidden group
            `}
          >
            {/* Top-Right Mini Outline Icon Badge */}
            <div
              className={`
                absolute top-3.5 right-3.5 w-6 h-6 rounded-full border
                ${card.iconColor} flex items-center justify-center shrink-0
                shadow-2xs transition-transform duration-200 group-hover:scale-110
              `}
            >
              <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>

            {/* Left Circular Gauge Ring */}
            <CircularGauge
              value={card.value}
              total={card.total}
              isRatio={card.isRatio}
              colorClass={card.gaugeColor}
              trackColorClass={card.trackColor}
              textClass={card.textColor}
            />

            {/* Right Text Content */}
            <div className="min-w-0 pr-5">
              <h3 className={`font-bold text-sm sm:text-base leading-snug truncate ${card.titleColor}`}>
                {card.label}
              </h3>
              <p className="text-xs text-slate/80 font-normal mt-0.5 line-clamp-1">
                {card.sublabel}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
