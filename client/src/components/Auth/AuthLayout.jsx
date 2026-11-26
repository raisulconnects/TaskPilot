import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import TaskPilotLogo from "../Common/TaskPilotLogo";

/* ── Layout ─────────────────────────────────────────────── */

// Split screen shared by login and signup: violet brand panel (same grid +
// glow language as the landing CTA) on the left, form on the right.
export default function AuthLayout({ eyebrow, headline, subline, visual, children }) {
  return (
    <div className="min-h-screen bg-snow font-poppins flex">
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative overflow-hidden bg-monday-violet flex-col justify-between p-10 xl:p-14 text-white">
        <div className="absolute inset-0 bg-grid-light mask-vignette pointer-events-none" />
        <div className="absolute -top-32 -left-24 w-[520px] h-[360px] rounded-full bg-cotton-candy/35 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-24 w-[460px] h-[340px] rounded-full bg-electric-cyan/30 blur-[100px] pointer-events-none" />

        <div className="relative">
          <TaskPilotLogo size="md" textSize="text-xl" textColor="text-white" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative max-w-md"
        >
          {eyebrow && (
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm mb-5">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl xl:text-[44px] font-light tracking-tight leading-[1.1]">{headline}</h1>
          <p className="mt-4 text-base text-white/75 leading-relaxed">{subline}</p>
          {visual && <div className="mt-10">{visual}</div>}
        </motion.div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} TaskPilot</p>
      </aside>

      <main className="flex-1 flex flex-col px-5 sm:px-10 py-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <div className="lg:hidden">
            <TaskPilotLogo size="sm" textSize="text-base" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="w-full max-w-[400px]"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* ── Form pieces ────────────────────────────────────────── */

const inputBase =
  "w-full h-11 rounded-xl bg-snow border text-sm text-ink placeholder:text-iron/70 focus:outline-none focus:ring-2 transition-all";

export function AuthField({ id, label, icon, error, hint, right, ...inputProps }) {
  const Icon = icon;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-iron pointer-events-none" />}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} ${Icon ? "pl-10" : "pl-3.5"} ${right ? "pr-11" : "pr-3.5"} ${
            error
              ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
              : "border-mist focus:ring-monday-violet/15 focus:border-monday-violet"
          }`}
          {...inputProps}
        />
        {right && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      ) : (
        hint
      )}
    </div>
  );
}

export function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField
      {...props}
      type={visible ? "text" : "password"}
      right={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="p-2 rounded-lg text-iron hover:text-ink hover:bg-cloud transition-colors cursor-pointer"
        >
          {visible ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
        </button>
      }
    />
  );
}

export function AuthAlert({ children }) {
  if (!children) return null;
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-600"
    >
      <HiOutlineExclamationCircle className="w-5 h-5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </motion.div>
  );
}

export function SubmitButton({ busy, busyLabel, children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-pill bg-monday-violet text-white text-[15px] font-medium hover:bg-ultra-violet shadow-[0_8px_30px_-10px_rgb(97_97_255/0.7)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
    >
      {busy && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      {busy ? busyLabel : children}
    </button>
  );
}
