import "./App.css";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { user } = useAuthContext();

  if (!user) {
    return <Login />;
  }

  return (
    <>{user.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />}</>
  );
}

export default App;
