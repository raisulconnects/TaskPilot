// Pure guard for the Add Member form: returns an error message when any
// required field fails validation, otherwise null. Extracted so it can be
// unit-tested without rendering the component.
export const validateMemberForm = ({ name, email, password, role }) => {
  const trimmedName = name?.trim() ?? "";
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return "Member name must be between 2 and 100 characters.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email ?? "")) {
    return "Please enter a valid email address.";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (role !== "employee" && role !== "admin") {
    return "Please select a valid role.";
  }

  return null;
};
