import { createContext, useContext, useState, useEffect } from "react"; // ✅ added useEffect
import { handleLogin, logoutUser } from "../services/authService";
import { API_BASE_URL } from "../api";
import { io } from "socket.io-client";

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
          // Eita Socket IO Connection Stablish Kortese
          const socket = io("http://localhost:5000");

          const data = await res.json();

          // Stablish er pore Ekahen basically room er nam hoilo "join-room", shekhane room e dhuktese and payload e data.id dicchi jate uniquely chine
          socket.emit("join-room", data.id);

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
      // --------------------------------------------------
      // This is Experimental For SocketIO
      const socket = io("http://localhost:5000");
      // --------------------------------------------------

      const loggedInUser = await handleLogin(email, password);
      setUser(loggedInUser);

      // --------------------------------------------------
      socket.emit(`user_${loggedInUser.id}`);
      // --------------------------------------------------

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
