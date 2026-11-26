import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlinePlus, HiOutlineBolt } from "react-icons/hi2";
import { useAuthContext } from "../../context/AuthContext";
import AuthLayout, { AuthField, PasswordField, AuthAlert, SubmitButton } from "./AuthLayout";

const ACTIVITY = [
  { icon: HiOutlineCheckCircle, tone: "bg-mint/30 text-mint", text: "Karim completed “Fix login redirect bug”" },
  { icon: HiOutlinePlus, tone: "bg-sky/25 text-sky", text: "New task assigned to Nusrat" },
  { icon: HiOutlineBolt, tone: "bg-peony/25 text-peony", text: "AI suggested Debugging · High" },
];

function ActivityPreview() {
  return (
    <div className="space-y-2.5">
      {ACTIVITY.map((a, i) => (
        <div
          key={a.text}
          style={{ opacity: 1 - i * 0.18 }}
          className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 backdrop-blur-sm"
        >
          <span className={`inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-xl ${a.tone}`}>
            <a.icon className="w-4 h-4" />
          </span>
          <span className="text-sm text-white/90 truncate">{a.text}</span>
          <span className="ml-auto text-[11px] text-white/50 shrink-0">now</span>
        </div>
      ))}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Local submitting state — the shared `loading` flag is also true during
  // the initial /auth/me restore, which would wrongly disable this button.
  const [submitting, setSubmitting] = useState(false);
  // The context keeps the last auth error around; only show it for an
  // attempt made on this visit, and hide it again once the user edits.
  const [failed, setFailed] = useState(false);

  const { login, error, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const edit = (setter) => (e) => {
    setter(e.target.value);
    setFailed(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email.trim(), password);
    setSubmitting(false);
    if (success) navigate("/dashboard");
    else setFailed(true);
  };

  return (
    <AuthLayout
      eyebrow={
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" /> Your team is live
        </>
      }
      headline="Welcome back."
      subline="Pick up where your team left off. Every update lands in realtime, no refresh needed."
      visual={<ActivityPreview />}
    >
      <h2 className="text-2xl sm:text-[28px] font-semibold text-ink tracking-tight">Log in</h2>
      <p className="mt-1.5 text-sm text-slate">Good to see you again. Enter your details to continue.</p>

      <form onSubmit={submitHandler} className="mt-8 space-y-4">
        <AuthField
          id="login-email"
          label="Email"
          icon={HiOutlineEnvelope}
          type="email"
          autoComplete="email"
          autoFocus
          required
          value={email}
          onChange={edit(setEmail)}
          placeholder="you@company.com"
        />
        <PasswordField
          id="login-password"
          label="Password"
          icon={HiOutlineLockClosed}
          autoComplete="current-password"
          required
          value={password}
          onChange={edit(setPassword)}
          placeholder="Your password"
        />

        <AuthAlert>{failed && (error || "Couldn't log you in. Please try again.")}</AuthAlert>

        <div className="pt-2">
          <SubmitButton busy={submitting} busyLabel="Logging in…">
            Log in
          </SubmitButton>
        </div>
      </form>

      <p className="mt-8 text-sm text-slate text-center">
        New to TaskPilot?{" "}
        <Link to="/signup" className="font-semibold text-monday-violet hover:text-ultra-violet transition-colors">
          Create an organization
        </Link>
      </p>
    </AuthLayout>
  );
}
