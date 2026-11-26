import { motion } from "framer-motion";
import PageHeader from "../Common/PageHeader";
import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";
import { greeting } from "../../services/dateLabels";
import NewTask from "../Task Boxes/NewTask";
import TaskList from "../Task Boxes/TaskList";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function EmployeeDashboard() {
  const { user } = useAuthContext();
  const { fetchTasks } = useTaskContext();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Header */}
      <motion.div variants={fadeUp}>
        <PageHeader
          eyebrow="My workspace"
          title={`${greeting()}, ${user?.name?.split(" ")[0] ?? ""}`}
          subtitle="Here's what's on your plate."
          onRefresh={fetchTasks}
        />
      </motion.div>

      {/* KPI Stat Cards */}
      <motion.div variants={fadeUp}>
        <NewTask />
      </motion.div>

      {/* Tasks Workspace */}
      <motion.div variants={fadeUp}>
        <TaskList />
      </motion.div>
    </motion.div>
  );
}
