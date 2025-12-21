import { createContext, useContext, useState, useEffect } from "react"; // ✅ added useEffect
import { handleLogin, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  // ✅ Restore user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("taskpilotUser"); // key for storage
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await handleLogin(email, password);
      setUser(loggedInUser);

      // ✅ Persist login in localStorage
      localStorage.setItem("taskpilotUser", JSON.stringify(loggedInUser));

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
    localStorage.removeItem("taskpilotUser");

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
