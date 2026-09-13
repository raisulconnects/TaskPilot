export const SIGNUP_ERRORS = {
  ORG_NAME: "Organization name must be between 2 and 60 characters.",
  NAME: "Your name must be between 2 and 100 characters.",
  EMAIL: "Please enter a valid email address.",
  PASSWORD: "Password must be at least 8 characters.",
  CONFIRM: "Passwords do not match.",
};

// Pure guard for the Signup form: returns an error message when any
// required field fails validation, otherwise null. Extracted so it can
// be unit-tested without rendering the component.
export const validateSignupForm = ({
  orgName,
  name,
  email,
  password,
  confirmPassword,
}) => {
  const trimmedOrg = orgName?.trim() ?? "";
  if (trimmedOrg.length < 2 || trimmedOrg.length > 60) {
    return SIGNUP_ERRORS.ORG_NAME;
  }

  const trimmedName = name?.trim() ?? "";
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return SIGNUP_ERRORS.NAME;
  }

  // Basic email format check — server does full validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email ?? "")) {
    return SIGNUP_ERRORS.EMAIL;
  }

  if (!password || password.length < 8) {
    return SIGNUP_ERRORS.PASSWORD;
  }

  if (password !== confirmPassword) {
    return SIGNUP_ERRORS.CONFIRM;
  }

  return null;
};
