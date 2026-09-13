import { API_BASE_URL } from "../api";

export const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
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
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Auth error:", e.message);
    throw e; // important
  }
  return true;
};

export const signupOrg = async ({ orgName, name, email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgName, name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // The server returns { message, issues? } on 400/409/429
      const err = new Error(data.message || "Signup failed");
      err.issues = data.issues || null;
      throw err;
    }

    // 201 success — cookie is auto-set, return user
    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      orgId: data.user.orgId,
    };
  } catch (err) {
    console.error("Signup error:", err.message);
    throw err;
  }
};
