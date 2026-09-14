import { motion } from "framer-motion";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
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
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Header */}
      <motion.div variants={fadeUp}>
        <Header />
      </motion.div>

      {/* KPI Stat Cards */}
      <motion.div variants={fadeUp}>
        <NewTask />
      </motion.div>

      {/* Tasks Workspace */}
      <motion.div variants={fadeUp}>
        <TaskList />
      </motion.div>

      {/* Footer */}
      <motion.div variants={fadeUp}>
        <Footer />
      </motion.div>
    </motion.div>
  );
}
