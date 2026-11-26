import { motion } from "framer-motion";
import PageHeader from "../Common/PageHeader";
import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";
import { greeting } from "../../services/dateLabels";
import AllTask from "../Task Boxes/AllTask";
import CreateTask from "../Task Boxes/CreateTask";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function AdminDashboard() {
  const { user } = useAuthContext();
  const { fetchTasks } = useTaskContext();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <PageHeader
          eyebrow="Admin workspace"
          title={`${greeting()}, ${user?.name?.split(" ")[0] ?? ""}`}
          subtitle="Here's how your team is doing today."
          onRefresh={fetchTasks}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <CreateTask />
      </motion.div>

      <motion.div variants={fadeUp}>
        <AllTask />
      </motion.div>
    </motion.div>
  );
}
