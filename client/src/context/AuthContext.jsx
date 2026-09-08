import { createContext, useContext, useState, useEffect } from "react";
import { handleLogin, logoutUser } from "../services/authService";
import { API_BASE_URL } from "../api";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api$/, "");

if (!import.meta.env.VITE_SOCKET_URL) {
  // Degraded to the API origin — set VITE_SOCKET_URL explicitly if the
  // Socket.IO server lives elsewhere (see client/.env.example).
  console.warn(
    "[socket] VITE_SOCKET_URL is not set; falling back to",
    SOCKET_URL
  );
}

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  const connectSocket = (userData) => {
    const s = io(SOCKET_URL, {
      // Tenancy: orgId namespaces all socket rooms server-side (see
      // server/config/rooms.js). Present on login response and /me alike.
      auth: { userId: userData.id, role: userData.role, orgId: userData.orgId },
    });
    setSocket(s);
    return s;
  };

  // Restore user from Auth/Me API on app load
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          connectSocket(data);
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

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await handleLogin(email, password);
      setUser(loggedInUser);

      if (!socket) {
        connectSocket(loggedInUser);
      }

      return true;
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

    socket?.disconnect();
    setSocket(null);
    setUser(null);

    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        socket,
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
