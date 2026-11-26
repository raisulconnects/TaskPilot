import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineBuildingOffice2,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineCheck,
} from "react-icons/hi2";
import { useAuthContext } from "../../context/AuthContext";
import { signupOrg } from "../../services/authService";
import { validateSignupForm, SIGNUP_ERRORS } from "../../services/validateSignupForm";
import { passwordStrength } from "../../services/passwordStrength";
import AuthLayout, { AuthField, PasswordField, AuthAlert, SubmitButton } from "./AuthLayout";

// Which field each client-side validation message belongs to, so the error
// shows under that field instead of in a generic banner.
const ERROR_FIELD = {
  [SIGNUP_ERRORS.ORG_NAME]: "orgName",
  [SIGNUP_ERRORS.NAME]: "name",
  [SIGNUP_ERRORS.EMAIL]: "email",
  [SIGNUP_ERRORS.PASSWORD]: "password",
  [SIGNUP_ERRORS.CONFIRM]: "confirmPassword",
};

const PERKS = [
  { icon: HiOutlineShieldCheck, title: "Your own isolated workspace", text: "Row-level security keeps every organization's data separate." },
  { icon: HiOutlineBolt, title: "Realtime from day one", text: "Assignments and completions sync instantly for the whole team." },
  { icon: HiOutlineSparkles, title: "AI-assisted task creation", text: "Type a title; Gemini drafts the rest." },
];

function Perks() {
  return (
    <ul className="space-y-4">
      {PERKS.map((p) => (
        <li key={p.title} className="flex gap-3.5">
          <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/20">
            <p.icon className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">{p.title}</p>
            <p className="text-sm text-white/70">{p.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const STRENGTH_BAR = ["bg-mist", "bg-red-400", "bg-amber-400", "bg-cornflower", "bg-green-500"];

function StrengthMeter({ password }) {
  if (!password) return <p className="mt-1.5 text-xs text-iron">At least 8 characters.</p>;
  const { score, label } = passwordStrength(password);
  return (
    <div className="mt-2 flex items-center gap-3" aria-live="polite">
      <div className="flex-1 grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1 rounded-full transition-colors ${i <= score ? STRENGTH_BAR[score] : "bg-cloud"}`} />
        ))}
      </div>
      <span className="text-xs font-medium text-slate w-16 text-right">{label}</span>
    </div>
  );
}

export default function Signup() {
  const [formData, setFormData] = useState({
    orgName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [serverIssues, setServerIssues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
    if (serverIssues.length) setServerIssues([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setServerIssues([]);

    const validationError = validateSignupForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await signupOrg({
        orgName: formData.orgName.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      await login(formData.email.trim(), formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message || "Failed to create organization account.");
      if (Array.isArray(err.issues)) setServerIssues(err.issues);
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorField = ERROR_FIELD[formError];
  const fieldError = (name) => (errorField === name ? formError : undefined);
  const bannerError = formError && !errorField ? formError : "";
  const confirmMatches =
    formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password;

  return (
    <AuthLayout
      eyebrow={
        <>
          <HiOutlineSparkles className="w-3.5 h-3.5" /> Set up in under a minute
        </>
      }
      headline="Launch your team's workspace."
      subline="Create your organization, invite your team, and start assigning work in minutes."
      visual={<Perks />}
    >
      <h2 className="text-2xl sm:text-[28px] font-semibold text-ink tracking-tight">Create your organization</h2>
      <p className="mt-1.5 text-sm text-slate">You'll be the admin. Add your team once you're in.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <AuthField
          id="orgName"
          name="orgName"
          label="Organization name"
          icon={HiOutlineBuildingOffice2}
          autoFocus
          placeholder="Acme Studios"
          value={formData.orgName}
          onChange={handleChange}
          error={fieldError("orgName")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthField
            id="name"
            name="name"
            label="Your name"
            icon={HiOutlineUser}
            autoComplete="name"
            placeholder="Alex Morgan"
            value={formData.name}
            onChange={handleChange}
            error={fieldError("name")}
          />
          <AuthField
            id="email"
            name="email"
            type="email"
            label="Work email"
            icon={HiOutlineEnvelope}
            autoComplete="email"
            placeholder="alex@acme.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldError("email")}
          />
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          icon={HiOutlineLockClosed}
          autoComplete="new-password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={fieldError("password")}
          hint={<StrengthMeter password={formData.password} />}
        />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          icon={HiOutlineLockClosed}
          autoComplete="new-password"
          placeholder="Type it again"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={fieldError("confirmPassword")}
          hint={
            confirmMatches ? (
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-green-600">
                <HiOutlineCheck className="w-3.5 h-3.5" /> Passwords match
              </p>
            ) : null
          }
        />

        <AuthAlert>
          {bannerError && (
            <>
              <p className="font-medium">{bannerError}</p>
              {serverIssues.length > 0 && (
                <ul className="mt-1 list-disc list-inside text-xs space-y-0.5 text-red-500">
                  {serverIssues.map((issue, idx) => (
                    <li key={idx}>
                      {issue.path}: {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </AuthAlert>

        <div className="pt-2">
          <SubmitButton busy={isSubmitting} busyLabel="Creating your workspace…">
            Create organization
          </SubmitButton>
        </div>
      </form>

      <p className="mt-8 text-sm text-slate text-center">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-monday-violet hover:text-ultra-violet transition-colors">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
