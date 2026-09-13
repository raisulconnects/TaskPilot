import { motion } from "framer-motion";
import DashboardCharts from "../Analytics/DashboardCharts";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
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
  return (
    <div className="min-h-screen bg-cloud font-sans text-ink">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      >
        <motion.div variants={fadeUp}>
          <Header />
        </motion.div>

        <motion.div variants={fadeUp}>
          <CreateTask />
        </motion.div>

        <motion.div variants={fadeUp}>
          <AllTask />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Footer />
        </motion.div>
      </motion.div>
    </div>
  );
}
