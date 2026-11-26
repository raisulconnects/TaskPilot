import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHome,
} from "react-icons/hi2";
import { useAuthContext } from "../../context/AuthContext";
import TaskPilotLogo from "../Common/TaskPilotLogo";
import Avatar from "../Common/Avatar";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: HiOutlineSquares2X2, end: true },
  { to: "/dashboard/members", label: "Members", icon: HiOutlineUsers, adminOnly: true },
];

function NavItems({ onNavigate, layoutId }) {
  const { user } = useAuthContext();
  const items = NAV.filter((n) => !n.adminOnly || user?.role === "admin");

  return (
    <nav className="flex flex-col gap-1">
      <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-iron">
        Workspace
      </p>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive ? "text-monday-violet" : "text-slate hover:text-ink hover:bg-cloud"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-periwinkle/70 ring-1 ring-periwinkle-wash"
                />
              )}
              <item.icon className="relative w-5 h-5 shrink-0" />
              <span className="relative">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function UserCard() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="rounded-2xl border border-mist/80 bg-cloud/60 p-3">
      <div className="flex items-center gap-3">
        <Avatar name={user?.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink truncate">{user?.name}</div>
          <div className="text-xs text-iron truncate">{user?.email}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${
            user?.role === "admin" ? "bg-monday-violet/10 text-monday-violet" : "bg-mint/40 text-forest"
          }`}
        >
          {user?.role}
        </span>
        <Link
          to="/"
          title="Back to site"
          aria-label="Back to site"
          className="ml-auto p-1.5 rounded-lg text-iron hover:text-ink hover:bg-snow transition-colors"
        >
          <HiOutlineHome className="w-4 h-4" />
        </Link>
        <button
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className="p-1.5 rounded-lg text-iron hover:text-red-500 hover:bg-snow transition-colors cursor-pointer"
        >
          <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate, layoutId }) {
  return (
    <>
      <NavItems onNavigate={onNavigate} layoutId={layoutId} />
      <div className="mt-auto">
        <UserCard />
      </div>
    </>
  );
}

export default function DashboardShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthContext();
  const { pathname } = useLocation();

  // Close the drawer on route change (e.g. browser back).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-cloud font-sans text-ink md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-8 bg-snow border-r border-mist/80 px-4 py-5 sticky top-0 h-screen">
        <div className="px-2">
          <TaskPilotLogo size="md" to="/dashboard" />
        </div>
        <SidebarContent layoutId="nav-active" />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-snow/85 backdrop-blur-xl border-b border-mist/80 px-4 h-14 flex items-center justify-between">
        <TaskPilotLogo size="sm" to="/dashboard" />
        <div className="flex items-center gap-2">
          <Avatar name={user?.name} size="sm" />
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="p-2 rounded-xl text-slate hover:bg-cloud transition-colors cursor-pointer"
          >
            <HiOutlineBars3 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute inset-y-0 left-0 w-[82%] max-w-xs bg-snow shadow-elevated flex flex-col gap-8 px-4 py-5"
            >
              <div className="flex items-center justify-between px-2">
                <TaskPilotLogo size="sm" to="/dashboard" />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-xl text-slate hover:bg-cloud transition-colors cursor-pointer"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent onNavigate={() => setMobileOpen(false)} layoutId="nav-active-mobile" />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
