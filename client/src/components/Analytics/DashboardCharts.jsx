import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { HiOutlineChartPie, HiOutlineChartBar } from "react-icons/hi2";
import { computeStats, workloadByPerson } from "../../services/taskStats";
import { STATUS_STYLES } from "../Common/taskStyles";
import { CHART_COLORS } from "../Common/themeColors";
import { useDashboardTheme } from "../../context/DashboardThemeContext";

const ORDER = ["assigned", "completed", "failed"];

function useChartColors() {
  const { theme } = useDashboardTheme();
  const c = CHART_COLORS[theme] ?? CHART_COLORS.light;
  return {
    ...c,
    tooltip: {
      backgroundColor: c.surface,
      color: c.text,
      borderRadius: 12,
      border: `1px solid ${c.border}`,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      padding: "8px 12px",
      fontFamily: "Poppins",
      fontSize: 12,
    },
  };
}

function ChartCard({ icon, title, subtitle, legend, children, className = "" }) {
  const Icon = icon;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex flex-col rounded-3xl border border-mist/70 bg-snow p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-xl bg-periwinkle text-monday-violet">
            <Icon className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink leading-tight">{title}</h2>
            <p className="text-xs text-iron">{subtitle}</p>
          </div>
        </div>
        {legend}
      </div>
      {children}
    </motion.section>
  );
}

function EmptyChart({ text }) {
  return (
    <div className="h-[220px] flex items-center justify-center rounded-2xl border border-dashed border-mist text-sm text-iron">
      {text}
    </div>
  );
}

function StatusDonut({ tasks }) {
  const colors = useChartColors();
  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const data = ORDER.map((k) => ({ key: k, name: STATUS_STYLES[k].label, value: stats[k], color: STATUS_STYLES[k].chart }));

  return (
    <ChartCard icon={HiOutlineChartPie} title="Status breakdown" subtitle="Every task in your workspace" className="lg:col-span-2">
      {stats.total === 0 ? (
        <EmptyChart text="No tasks yet" />
      ) : (
        <div className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row items-center gap-6">
          <div className="relative w-[200px] h-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={92}
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data
                    .filter((d) => d.value > 0)
                    .map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                </Pie>
                <Tooltip contentStyle={colors.tooltip} itemStyle={{ color: colors.text }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold text-ink tabular-nums">{stats.total}</span>
              <span className="text-xs text-iron">tasks</span>
            </div>
          </div>
          <ul className="w-full sm:flex-1 lg:flex-none lg:w-full 2xl:flex-1 min-w-0 space-y-2">
            {data.map((d) => (
              <li key={d.key} className="grid grid-cols-[auto_minmax(0,1fr)_auto_2.75rem] items-center gap-3 rounded-xl px-3 py-2 bg-cloud/60">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-sm text-slate truncate">{d.name}</span>
                <span className="text-sm font-semibold text-ink tabular-nums">{d.value}</span>
                <span className="text-right text-xs text-iron tabular-nums">
                  {Math.round((d.value / stats.total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}

function TeamWorkload({ tasks, employees }) {
  const colors = useChartColors();
  const data = useMemo(
    () =>
      workloadByPerson(tasks, employees).map((r) => ({
        ...r,
        short: r.name?.split(" ")[0] ?? "?",
      })),
    [tasks, employees]
  );

  const legend = (
    <div className="flex items-center gap-3">
      {ORDER.map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5 text-xs text-slate">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_STYLES[k].chart }} />
          {STATUS_STYLES[k].label}
        </span>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={HiOutlineChartBar}
      title="Team workload"
      subtitle="Tasks per person, by status"
      legend={legend}
      className="lg:col-span-3"
    >
      {data.length === 0 ? (
        <EmptyChart text="Add team members to see their workload" />
      ) : (
        <div className="flex-1 min-h-[240px] -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke={colors.grid} strokeDasharray="4 4" />
              <XAxis
                dataKey="short"
                tickLine={false}
                axisLine={false}
                tick={{ fill: colors.tick, fontSize: 12, fontFamily: "Poppins" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ fill: colors.tickMuted, fontSize: 11, fontFamily: "Poppins" }}
              />
              <Tooltip
                contentStyle={colors.tooltip}
                labelStyle={{ color: colors.text, fontWeight: 600 }}
                cursor={{ fill: "rgba(97, 97, 255, 0.05)", radius: 8 }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
              />
              {ORDER.map((k, i) => (
                <Bar
                  key={k}
                  dataKey={k}
                  name={STATUS_STYLES[k].label}
                  stackId="s"
                  fill={STATUS_STYLES[k].chart}
                  maxBarSize={44}
                  radius={i === ORDER.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

export default function DashboardCharts({ tasks, employees }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <StatusDonut tasks={tasks} />
      <TeamWorkload tasks={tasks} employees={employees} />
    </div>
  );
}
