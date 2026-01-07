import { useEffect, useState } from "react";
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

const DashboardCharts = () => {
  const { tasks, fetchTasks, loading } = useTaskContext();
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [chartWidth, setChartWidth] = useState(300);
  const COLORS = ["#4ade80", "#facc15", "#f87171"]; // green, yellow, red

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
  }, []);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    // 1️⃣ Task Status Distribution
    const statusCounts = { completed: 0, assigned: 0, failed: 0 };
    tasks.forEach((task) => {
      const status = task.status || "pending";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    setTaskStatusData([
      { name: "Completed", value: statusCounts.completed },
      { name: "Assigned", value: statusCounts.assigned },
      { name: "Failed", value: statusCounts.failed },
    ]);

    // 2️⃣ Tasks Completed per Employee
    const employeeMap = {};
    tasks.forEach((task) => {
      const name = task.assignedTo?.name || "Unknown";
      if (!employeeMap[name]) employeeMap[name] = 0;
      if (task.status === "completed") employeeMap[name] += 1;
    });

    setEmployeeData(
      Object.keys(employeeMap).map((name) => ({
        name,
        completed: employeeMap[name],
      }))
    );
  }, [tasks]);

  if (loading)
    return <p className="text-white text-center mt-10">Loading charts...</p>;

  return (
    <div className="p-4 sm:p-6 flex flex-col md:flex-col gap-4">
      {/* Pie Chart */}
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
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
              label={{ fill: "white", fontSize: chartWidth < 320 ? 10 : 12 }}
            >
              {taskStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "0.5rem",
                border: "none",
              }}
              itemStyle={{ color: "white" }}
              labelStyle={{ color: "white" }}
            />
            <Legend wrapperStyle={{ color: "white", fontSize: chartWidth < 320 ? 10 : 12 }} iconType="rect" />
          </PieChart>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          Tasks Completed per Employee
        </h2>
        <div className="flex justify-center overflow-x-auto">
          <BarChart width={chartWidth} height={250} data={employeeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="white" 
              tick={{ fill: "#d1d5db", fontSize: chartWidth < 320 ? 9 : 11 }}
              angle={chartWidth < 400 ? -45 : 0}
              textAnchor={chartWidth < 400 ? "end" : "middle"}
              height={chartWidth < 400 ? 60 : 30}
            />
            <YAxis stroke="white" tick={{ fill: "#d1d5db", fontSize: chartWidth < 320 ? 9 : 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "0.5rem",
                border: "none",
                color: "white",
              }}
            />
            <Legend wrapperStyle={{ color: "white", fontSize: chartWidth < 320 ? 10 : 12 }} />
            <Bar dataKey="completed" fill="#4ade80" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
