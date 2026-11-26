// Lightweight password strength hint for the signup form. Not a security
// control (the server enforces the real rules); it just nudges people
// toward something better than the 8-character minimum.

export const STRENGTH_LABELS = ["Too short", "Weak", "Okay", "Good", "Strong"];

export function passwordStrength(password = "") {
  if (password.length < 8) return { score: 0, label: STRENGTH_LABELS[0] };
  let score = 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return { score, label: STRENGTH_LABELS[score] };
}
