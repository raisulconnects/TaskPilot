import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";
import { HiOutlineArrowPath } from "react-icons/hi2";
import TaskPilotLogo from "../Common/TaskPilotLogo";

export default function Header() {
  const { user } = useAuthContext();
  const { fetchTasks } = useTaskContext();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-3xl border border-mist shadow-card px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      {/* Left — Brand + Page */}
      <div className="flex items-center gap-3.5">
        <TaskPilotLogo size="md" showText={false} to="/dashboard" />
        <div>
          <div className="text-xs font-medium text-iron">
            Dashboard •{" "}
            <span className="text-monday-violet font-semibold capitalize">
              {user?.role === "admin" ? "Admin Workspace" : "Employee Workspace"}
            </span>
          </div>
          <div className="text-lg font-bold text-ink leading-tight mt-0.5">
            Hello, <span className="text-monday-violet">{user?.name}</span> 👋
          </div>
        </div>
      </div>

      {/* Right — Actions (logout lives in the sidebar user chip) */}
      <div className="flex gap-2 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => fetchTasks()}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-cloud border border-mist text-slate text-sm font-medium hover:bg-white hover:border-monday-violet hover:text-monday-violet transition-all cursor-pointer"
        >
          <HiOutlineArrowPath className="w-4 h-4" />
          Refresh
        </motion.button>
      </div>
    </motion.header>
  );
}
