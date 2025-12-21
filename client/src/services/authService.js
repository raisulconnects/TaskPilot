import { API_BASE_URL } from "../api";

export const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // backend error message
      throw new Error(data.message || "Invalid credentials");
    }

    // success case
    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };
  } catch (err) {
    console.error("Auth error:", err.message);
    throw err; // important
  }
};

export const logoutUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return true;
};
