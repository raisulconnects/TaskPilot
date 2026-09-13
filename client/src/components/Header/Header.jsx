import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";
import {
  HiOutlineArrowPath,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

export default function Header() {
  const { logout, user } = useAuthContext();
  const { fetchTasks } = useTaskContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-mist shadow-soft px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      {/* Left — Brand + Page */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-monday-violet text-white font-bold flex items-center justify-center text-sm shadow-sm">
          TP
        </div>
        <div>
          <div className="text-sm text-iron font-medium">
            Dashboard
          </div>
          <div className="text-lg font-bold text-ink leading-tight">
            Hello, <span className="text-monday-violet">{user?.name}</span> 👋
          </div>
        </div>
      </div>

      {/* Right — Actions */}
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

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-peony/20 border border-peony/40 text-red-500 text-sm font-medium hover:bg-peony/30 transition-all cursor-pointer"
        >
          <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </motion.header>
  );
}
