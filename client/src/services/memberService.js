import { API_BASE_URL } from "../api";

const throwServerError = async (response, fallback) => {
  const data = await response.json().catch(() => ({}));
  const details = Array.isArray(data.issues)
    ? data.issues.map((i) => `${i.path}: ${i.message}`).join("; ")
    : "";
  throw new Error(
    [data.message || fallback, details].filter(Boolean).join(" — ")
  );
};

export const createMember = async (memberData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });

  if (!response.ok) {
    await throwServerError(response, "Failed to add member");
  }

  const data = await response.json();
  return data.user;
};

export const deleteMember = async (memberId) => {
  const response = await fetch(`${API_BASE_URL}/users/${memberId}`, {
    credentials: "include",
    method: "DELETE",
  });

  if (!response.ok) {
    await throwServerError(response, "Failed to remove member");
  }

  return true;
};
