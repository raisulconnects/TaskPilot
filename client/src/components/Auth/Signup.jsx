import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";
import { signupOrg } from "../../services/authService";
import { validateSignupForm } from "../../services/validateSignupForm";
import {
  HiOutlineArrowLeft,
  HiOutlineBuildingOffice2,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBolt,
} from "react-icons/hi2";
import TaskPilotLogo from "../Common/TaskPilotLogo";

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

  // If already authenticated, redirect to dashboard
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

    // Client-side pure guard validation
    const validationError = validateSignupForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await signupOrg({
        orgName: formData.orgName,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Login contextually or navigate to dashboard
      await login(formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message || "Failed to create organization account.");
      if (err.issues && Array.isArray(err.issues)) {
        setServerIssues(err.issues);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cloud flex items-stretch font-sans">
      {/* ── Left Brand / Art Panel (Desktop) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-[#6161ff] via-[#4e4ee0] to-[#262680] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-peony/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-sky/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top brand header */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="mb-4">
            <TaskPilotLogo size="lg" textSize="text-2xl" textColor="text-white" />
          </div>
        </div>

        {/* Middle Value Prop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 space-y-6 max-w-md my-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white backdrop-blur-xs">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-amber-300" />
            Set up in under 60 seconds
          </div>
          <h2 className="text-3xl xl:text-4xl font-light leading-tight">
            Launch your company workspace today.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Get instant access to AI-powered task breakdowns, realtime team tracking, and automated overdue management.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-white/90">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-emerald-300 shrink-0">
                <HiOutlineShieldCheck className="w-4 h-4" />
              </div>
              <span>Isolated multi-tenant PostgreSQL database</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-sky-300 shrink-0">
                <HiOutlineBolt className="w-4 h-4" />
              </div>
              <span>Live Socket.IO updates for every member</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} TaskPilot Technologies. All rights reserved.
        </div>
      </div>

      {/* ── Right Form Container ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Back / Brand */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate hover:text-ink text-sm font-medium"
            >
              <HiOutlineArrowLeft className="w-4 h-4" /> Back
            </Link>
            <TaskPilotLogo size="sm" textSize="text-base" />
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-mist"
          >
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Create an Organization
              </h1>
              <p className="text-slate text-sm mt-1.5">
                Sign up as an administrator and start managing your team.
              </p>
            </div>

            {/* Error alerts */}
            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-peony/20 border border-peony/50 text-peony text-sm flex flex-col gap-1.5 animate-fade-up">
                <div className="font-semibold flex items-center gap-2">
                  <span>⚠️</span> {formError}
                </div>
                {serverIssues.length > 0 && (
                  <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-slate">
                    {serverIssues.map((issue, idx) => (
                      <li key={idx}>
                        {issue.path?.join(".")}: {issue.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Section 1: Organization Details */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-iron uppercase tracking-wider">
                  1. Organization
                </div>
                <div>
                  <label
                    htmlFor="orgName"
                    className="block text-xs font-semibold text-slate mb-1.5"
                  >
                    Organization Name
                  </label>
                  <div className="relative">
                    <HiOutlineBuildingOffice2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron" />
                    <input
                      id="orgName"
                      name="orgName"
                      type="text"
                      required
                      placeholder="Acme Studios"
                      value={formData.orgName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-cloud border border-pebble rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-hidden focus:border-monday-violet focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-mist/60 pt-4 space-y-3">
                <div className="text-xs font-semibold text-iron uppercase tracking-wider">
                  2. Administrator Account
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-slate mb-1.5"
                  >
                    Your Full Name
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-cloud border border-pebble rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-hidden focus:border-monday-violet focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate mb-1.5"
                  >
                    Work Email
                  </label>
                  <div className="relative">
                    <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="alex@acme.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-cloud border border-pebble rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-hidden focus:border-monday-violet focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-slate mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-cloud border border-pebble rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-hidden focus:border-monday-violet focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-slate mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-cloud border border-pebble rounded-xl text-sm text-ink placeholder:text-iron/60 focus:outline-hidden focus:border-monday-violet focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-6 bg-monday-violet hover:bg-[#4e4ee0] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Organization...
                  </>
                ) : (
                  "Create Organization & Workspace"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-xs text-slate">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-monday-violet hover:underline"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
