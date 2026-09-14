import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useAuthContext } from "../../context/AuthContext";
import TaskPilotLogo from "../Common/TaskPilotLogo";

const linkBase =
  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all";
const linkIdle = "text-slate hover:bg-cloud hover:text-ink";
const linkActive = "bg-monday-violet text-white shadow-md";

function NavItems({ onNavigate }) {
  const { user } = useAuthContext();
  return (
    <nav className="flex flex-col gap-1.5">
      <NavLink
        to="/dashboard"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkIdle}`
        }
      >
        <HiOutlineSquares2X2 className="w-5 h-5 shrink-0" />
        Tasks
      </NavLink>
      {user?.role === "admin" && (
        <NavLink
          to="/dashboard/members"
          onClick={onNavigate}
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          <HiOutlineUsers className="w-5 h-5 shrink-0" />
          Members
        </NavLink>
      )}
    </nav>
  );
}

function UserChip() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-monday-violet text-white flex items-center justify-center text-sm font-bold shrink-0">
        {user?.name?.charAt(0)?.toUpperCase() || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink truncate">
          {user?.name}
        </div>
        <div className="text-xs text-iron capitalize">{user?.role}</div>
      </div>
      <button
        onClick={handleLogout}
        title="Logout"
        className="p-2 rounded-xl text-slate hover:bg-peony/20 hover:text-red-500 transition-all cursor-pointer"
      >
        <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function DashboardShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cloud font-sans text-ink flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-6 bg-white border-r border-mist p-5 sticky top-0 h-screen">
        <TaskPilotLogo size="md" to="/dashboard" />
        <NavItems />
        <div className="mt-auto pt-4 border-t border-mist">
          <UserChip />
        </div>
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-mist px-4 py-3 flex items-center justify-between">
        <TaskPilotLogo size="sm" to="/dashboard" />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="p-2 rounded-xl text-slate hover:bg-cloud transition-all cursor-pointer"
        >
          {mobileOpen ? (
            <HiOutlineXMark className="w-6 h-6" />
          ) : (
            <HiOutlineBars3 className="w-6 h-6" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[60px] inset-x-0 z-40 bg-white border-b border-mist p-4 space-y-4"
          >
            <NavItems onNavigate={() => setMobileOpen(false)} />
            <div className="pt-3 border-t border-mist">
              <UserChip />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
