import { API_BASE_URL } from "../api";

export const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const { user } = await response.json();

    if (!response.ok) {
      throw new Error(user.message || "Login failed");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (e) {
    console.log("Error in Authorization.", e.message);
  }

  // // simulate API delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // const users = [...admins, ...employees];

  // const user = users.find((u) => u.email === email && u.password === password);

  // if (!user) {
  //   throw new Error("Invalid email or password!");
  // }
};

export const logoutUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
};
