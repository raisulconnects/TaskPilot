import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error, user } = useAuthContext();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-cloud font-poppins flex">
      {/* Left Brand Panel — desktop only */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-monday-violet items-center justify-center p-12">
        {/* Floating shapes */}
        <div className="absolute top-16 left-16 w-40 h-40 rounded-full bg-white/5 animate-float pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full bg-white/5 animate-float-slow pointer-events-none" />
        <div className="absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-white/5 animate-float-fast pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-md text-center"
        >
          {/* Logo */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="text-snow font-bold">T</span>
            </div>
            <span className="text-xl font-semibold text-snow tracking-tight">
              TaskPilot
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-light text-snow tracking-tight leading-tight">
            Welcome back.
          </h1>
          <p className="mt-4 text-base text-snow/60 leading-relaxed">
            Log in to manage your tasks, track your team&apos;s progress, and
            keep work moving forward — all in realtime.
          </p>

          {/* Decorative card peek */}
          <div className="mt-10 rounded-2xl bg-white/10 border border-white/10 p-5 text-left backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-mint" />
              <span className="text-sm text-snow/80 font-medium">
                3 tasks completed today
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-sky" />
              <span className="text-sm text-snow/80 font-medium">
                2 new assignments waiting
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-peony" />
              <span className="text-sm text-snow/80 font-medium">
                0 overdue — you&apos;re on track
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink transition-colors mb-8 group"
          >
            <HiOutlineArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-monday-violet flex items-center justify-center">
              <span className="text-snow font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-ink">
              TaskPilot
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            Log in to your account
          </h2>
          <p className="mt-2 text-sm text-slate">
            Enter your credentials to access your dashboard.
          </p>

          {/* Form */}
          <form onSubmit={submitHandler} className="mt-8 space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-sm text-ink font-medium"
              >
                Email
              </label>
              <input
                required
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-snow border border-pebble px-4 py-3 text-ink text-sm placeholder-iron focus:outline-none focus:ring-2 focus:ring-monday-violet/30 focus:border-monday-violet transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-sm text-ink font-medium"
              >
                Password
              </label>
              <input
                required
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-snow border border-pebble px-4 py-3 text-ink text-sm placeholder-iron focus:outline-none focus:ring-2 focus:ring-monday-violet/30 focus:border-monday-violet transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
                <span className="animate-pulse">{error}.</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-pill bg-monday-violet text-snow font-medium py-3.5 text-base hover:bg-ultra-violet active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-sm text-slate text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-monday-violet hover:text-ultra-violet transition-colors"
            >
              Create an organization
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
