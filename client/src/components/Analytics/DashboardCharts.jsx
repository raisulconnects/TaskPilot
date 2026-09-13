import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTaskContext } from "../../context/TaskContext";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const DashboardCharts = () => {
  const { tasks, fetchTasks, loading } = useTaskContext();
  const [chartWidth, setChartWidth] = useState(300);

  // Brand-aligned pastel palette: mint, cornflower, peony
  const COLORS = ["#bcfe90", "#93beff", "#fcd0f8"];

  useEffect(() => {
    const updateChartWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChartWidth(280);
      } else if (width < 768) {
        setChartWidth(320);
      } else if (width < 1024) {
        setChartWidth(350);
      } else {
        setChartWidth(400);
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived synchronously during render (no setState-in-effect): recomputed
  // only when `tasks` changes.
  const taskStatusData = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    // 1️⃣ Task Status Distribution
    const statusCounts = { completed: 0, assigned: 0, failed: 0 };
    tasks.forEach((task) => {
      const status = task.status || "pending";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return [
      { name: "Completed", value: statusCounts.completed },
      { name: "Assigned", value: statusCounts.assigned },
      { name: "Failed", value: statusCounts.failed },
    ];
  }, [tasks]);

  // 2️⃣ Tasks Completed per Employee
  const employeeData = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const employeeMap = {};
    tasks.forEach((task) => {
      const name = task.assignedTo?.name || "Unknown";
      if (!employeeMap[name]) employeeMap[name] = 0;
      if (task.status === "completed") employeeMap[name] += 1;
    });

    return Object.keys(employeeMap).map((name) => ({
      name,
      completed: employeeMap[name],
    }));
  }, [tasks]);

  /* ── Shared tooltip style ── */
  const tooltipStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #d0d4e4",
    boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
    padding: "8px 12px",
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-monday-violet border-t-transparent rounded-full animate-spin" />
          <p className="text-slate text-sm font-medium">Loading charts...</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      {/* Pie Chart */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-3xl border border-mist shadow-card p-5 sm:p-6"
      >
        <h2 className="text-base font-bold text-ink mb-4">
          Task Status Distribution
        </h2>
        <div className="flex justify-center overflow-x-auto">
          <PieChart width={chartWidth} height={250}>
            <Pie
              data={taskStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={Math.min(100, (chartWidth - 40) / 2)}
              label={{
                fill: "#333333",
                fontSize: chartWidth < 320 ? 10 : 12,
                fontFamily: "Poppins",
              }}
              strokeWidth={2}
              stroke="#ffffff"
            >
              {taskStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: "#333333", fontSize: 13 }}
              labelStyle={{ color: "#535768", fontWeight: 600 }}
            />
            <Legend
              wrapperStyle={{
                color: "#535768",
                fontSize: chartWidth < 320 ? 10 : 12,
                fontFamily: "Poppins",
              }}
              iconType="circle"
            />
          </PieChart>
        </div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-3xl border border-mist shadow-card p-5 sm:p-6"
      >
        <h2 className="text-base font-bold text-ink mb-4">
          Tasks Completed per Employee
        </h2>
        <div className="flex justify-center overflow-x-auto">
          <BarChart width={chartWidth} height={250} data={employeeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d0d4e4" />
            <XAxis
              dataKey="name"
              stroke="#808080"
              tick={{
                fill: "#535768",
                fontSize: chartWidth < 320 ? 9 : 11,
                fontFamily: "Poppins",
              }}
              angle={chartWidth < 400 ? -45 : 0}
              textAnchor={chartWidth < 400 ? "end" : "middle"}
              height={chartWidth < 400 ? 60 : 30}
            />
            <YAxis
              stroke="#808080"
              tick={{
                fill: "#535768",
                fontSize: chartWidth < 320 ? 9 : 11,
                fontFamily: "Poppins",
              }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: "#333333" }}
              cursor={{ fill: "rgba(97, 97, 255, 0.06)" }}
            />
            <Legend
              wrapperStyle={{
                color: "#535768",
                fontSize: chartWidth < 320 ? 10 : 12,
                fontFamily: "Poppins",
              }}
            />
            <Bar
              dataKey="completed"
              fill="#6161ff"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
