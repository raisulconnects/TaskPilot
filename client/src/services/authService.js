import admins from "../Data/admins.json";
import employees from "../Data/employees.json";

export const handleLogin = async (email, password) => {
  // simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const users = [...admins, ...employees];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password!");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: `mock-${user.role}-token`,
  };
};

export const logoutUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
};
