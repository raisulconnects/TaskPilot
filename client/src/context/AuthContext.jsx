import { createContext, useContext, useState, useEffect } from "react"; // ✅ added useEffect
import { handleLogin, logoutUser } from "../services/authService";
import { API_BASE_URL } from "../api";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  // Restore user from Auth/Me API on app load
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.log("Login Please!", e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await handleLogin(email, password);
      setUser(loggedInUser);

      // ✅ Persist login in localStorage
      // localStorage.setItem("taskpilotUser", JSON.stringify(loggedInUser));

      return true; // useful for navigation
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    setLoading(true);
    await logoutUser();
    setUser(null);

    // ✅ Remove persisted user from localStorage
    // localStorage.removeItem("taskpilotUser");

    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};
