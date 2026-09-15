import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing/Landing";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import Members from "./components/Members/Members";
import DashboardShell from "./components/Layout/DashboardShell";
import { useAuthContext } from "./context/AuthContext";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud font-sans">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-monday-violet"></div>
    </div>
  );
}

function RequireAuth() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RequireAdmin() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function RoleDashboard() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<RequireAuth />}>
        <Route element={<DashboardShell />}>
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route element={<RequireAdmin />}>
            <Route path="/dashboard/members" element={<Members />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
