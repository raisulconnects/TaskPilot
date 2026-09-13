import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";
import TaskPilotLogo from "../Common/TaskPilotLogo";

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ═══════════════════════════════════════════════
   FEATURE DATA
   ═══════════════════════════════════════════════ */

const FEATURES = [
  {
    icon: HiOutlineShieldCheck,
    title: "Isolated Workspaces",
    description:
      "Every company gets its own workspace. Your data stays completely separate — no other organization can ever see it.",
    bg: "bg-mint/30",
    iconColor: "text-forest",
  },
  {
    icon: HiOutlineBolt,
    title: "Realtime Updates",
    description:
      "New assignments appear instantly. Completions show up on the admin side in realtime — no refresh, either direction.",
    bg: "bg-sky/30",
    iconColor: "text-monday-violet",
  },
  {
    icon: HiOutlineSparkles,
    title: "AI-Assisted Creation",
    description:
      "Create a task with just a title. AI writes the description and suggests the right category and priority.",
    bg: "bg-lavender/30",
    iconColor: "text-ultra-violet",
  },
  {
    icon: HiOutlineClock,
    title: "Auto Overdue Detection",
    description:
      "Past-due work marks itself failed automatically and shows up in everyone's counts. Nothing slips silently.",
    bg: "bg-peony/30",
    iconColor: "text-apricot",
  },
  {
    icon: HiOutlineChartBar,
    title: "Visual Analytics",
    description:
      "Live status distribution and per-employee completion charts. See how your team is doing at a glance.",
    bg: "bg-periwinkle/30",
    iconColor: "text-cornflower",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Role-Based Dashboards",
    description:
      "Admins manage and create. Employees see their tasks. Each role gets the dashboard built for their job.",
    bg: "bg-aqua/30",
    iconColor: "text-forest",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your workspace",
    description:
      "Sign up and get your own isolated organization. Your data stays separate — no other company can ever see it.",
  },
  {
    number: "02",
    title: "Assign tasks with AI",
    description:
      "Create a task with just a title. AI writes the description and suggests the right category and priority. Your team sees it instantly.",
  },
  {
    number: "03",
    title: "Track everything live",
    description:
      "Watch completions happen in realtime on your dashboard. Missed a deadline? The system marks it failed automatically.",
  },
];

/* ═══════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-snow/90 backdrop-blur-xl shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 flex items-center justify-between h-16 sm:h-[72px]">
        {/* Logo */}
        <TaskPilotLogo size="sm" textSize="text-lg" />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="#features"
            className="px-4 py-2 text-sm font-medium text-slate hover:text-ink transition-colors rounded-lg hover:bg-cloud"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-2 text-sm font-medium text-slate hover:text-ink transition-colors rounded-lg hover:bg-cloud"
          >
            How it works
          </a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 text-sm font-medium text-slate border border-pebble rounded-pill hover:border-mist hover:bg-cloud transition-all duration-200"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 text-sm font-medium text-snow bg-monday-violet rounded-pill hover:bg-ultra-violet transition-all duration-200 active:scale-[0.97]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-ink hover:bg-cloud transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-snow border-t border-cloud px-5 pb-6 pt-2"
        >
          <div className="flex flex-col gap-1">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate hover:text-ink rounded-lg hover:bg-cloud transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate hover:text-ink rounded-lg hover:bg-cloud transition-colors"
            >
              How it works
            </a>
            <hr className="my-2 border-cloud" />
            <Link
              to="/login"
              className="px-4 py-3 text-sm font-medium text-slate text-center border border-pebble rounded-xl hover:bg-cloud transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-3 text-sm font-medium text-snow text-center bg-monday-violet rounded-xl hover:bg-ultra-violet transition-colors"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════ */

function Hero() {
  const { scrollYProgress } = useScroll();
  const shapeY1 = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const shapeY2 = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const shapeY3 = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 overflow-hidden">
      {/* Floating Background Shapes */}
      <motion.div
        style={{ y: shapeY1 }}
        className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-mint/20 blur-3xl animate-float pointer-events-none"
      />
      <motion.div
        style={{ y: shapeY2 }}
        className="absolute top-40 left-[5%] w-48 h-48 rounded-full bg-lavender/25 blur-3xl animate-float-slow pointer-events-none"
      />
      <motion.div
        style={{ y: shapeY3 }}
        className="absolute bottom-10 right-[20%] w-36 h-36 rounded-full bg-sky/20 blur-3xl animate-float-fast pointer-events-none"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-periwinkle/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 text-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-periwinkle-wash bg-periwinkle/20 mb-6 sm:mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-monday-violet animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-slate tracking-wide">
            Task management, simplified
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-5xl lg:text-[64px] font-light leading-[1.1] tracking-tight text-ink max-w-3xl mx-auto"
        >
          Stop losing work in{" "}
          <span className="bg-linear-to-r from-cotton-candy to-apricot bg-clip-text text-transparent font-normal">
            chat threads
          </span>
          .
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-5 sm:mt-6 text-base sm:text-lg text-slate max-w-xl mx-auto leading-relaxed"
        >
          Isolated workspaces, realtime tracking, AI-assisted task creation,
          and automatic overdue detection — built for teams who move fast.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium text-snow bg-monday-violet rounded-pill hover:bg-ultra-violet transition-all duration-200 active:scale-[0.97] shadow-soft"
          >
            Get Started Free
            <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium text-slate border border-pebble rounded-pill hover:border-mist hover:bg-cloud transition-all duration-200"
          >
            <HiOutlinePlay className="w-4 h-4" />
            See how it works
          </a>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-14 sm:mt-20 mx-auto max-w-4xl"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD MOCKUP
   A static, decorative representation of the
   TaskPilot dashboard. No real data — just HTML/CSS
   that shows the product's personality.
   ═══════════════════════════════════════════════ */

function DashboardMockup() {
  return (
    <div className="rounded-3xl border border-mist bg-snow shadow-card overflow-hidden">
      {/* Window Chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-cloud bg-cloud/50">
        <span className="w-3 h-3 rounded-full bg-red-400/70" />
        <span className="w-3 h-3 rounded-full bg-amber-400/70" />
        <span className="w-3 h-3 rounded-full bg-green-400/70" />
        <span className="ml-3 text-xs text-iron font-medium">TaskPilot — Dashboard</span>
      </div>

      {/* Mock Content */}
      <div className="p-5 sm:p-8 bg-snow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate font-medium">Good morning,</p>
            <p className="text-lg font-semibold text-ink">Sarah Chen 👋</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 text-xs font-medium bg-monday-violet/10 text-monday-violet rounded-md">
              Admin
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Assigned", count: "12", color: "bg-sky/20 text-slate" },
            { label: "Completed", count: "8", color: "bg-mint/20 text-forest" },
            { label: "Failed", count: "1", color: "bg-peony/20 text-apricot" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl p-3 sm:p-4 ${s.color}`}
            >
              <p className="text-xl sm:text-2xl font-semibold">{s.count}</p>
              <p className="text-xs font-medium opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Task Rows */}
        <div className="space-y-2">
          {[
            { title: "Update landing page copy", status: "assigned", priority: "High", cat: "Design" },
            { title: "Fix auth redirect bug", status: "completed", priority: "High", cat: "Debugging" },
            { title: "Write API documentation", status: "assigned", priority: "Average", cat: "Development" },
          ].map((t) => (
            <div
              key={t.title}
              className="flex items-center justify-between rounded-xl border border-cloud px-4 py-3 hover:bg-cloud/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    t.status === "completed"
                      ? "bg-green-400"
                      : t.status === "failed"
                        ? "bg-red-400"
                        : "bg-cornflower"
                  }`}
                />
                <span className="text-sm font-medium text-ink truncate">
                  {t.title}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 shrink-0 ml-3">
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-cloud text-slate">
                  {t.cat}
                </span>
                <span
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${
                    t.priority === "High"
                      ? "bg-peony/30 text-ultra-violet"
                      : "bg-periwinkle/30 text-slate"
                  }`}
                >
                  {t.priority}
                </span>
                <span
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${
                    t.status === "completed"
                      ? "bg-mint/30 text-forest"
                      : "bg-sky/30 text-monday-violet"
                  }`}
                >
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════════ */

function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-cloud">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm font-medium text-monday-violet mb-3 tracking-wide uppercase">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-light tracking-tight text-ink leading-tight">
            Everything your{" "}
            <span className="bg-linear-to-r from-monday-violet to-electric-cyan bg-clip-text text-transparent font-normal">
              team needs
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate max-w-lg mx-auto">
            Simple tools that replace your chat-thread coordination and
            spreadsheet tracking — nothing more, nothing less.
          </p>
        </motion.div>

        {/* Card Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className={`group relative rounded-3xl p-6 sm:p-7 ${f.bg} border border-transparent hover:border-mist hover:shadow-card transition-shadow duration-300 cursor-default`}
            >
              <div
                className={`w-11 h-11 rounded-2xl bg-snow/70 flex items-center justify-center mb-4 ${f.iconColor}`}
              >
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2 tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm text-slate leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════ */

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-snow">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-sm font-medium text-monday-violet mb-3 tracking-wide uppercase">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-light tracking-tight text-ink leading-tight">
            Three steps to{" "}
            <span className="bg-linear-to-r from-cotton-candy to-apricot bg-clip-text text-transparent font-normal">
              clarity
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16 sm:space-y-24">
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 1;
            return (
              <motion.div
                key={step.number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={isEven ? slideInRight : slideInLeft}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-14 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Number + Text */}
                <div className="flex-1 max-w-md">
                  <span className="inline-block text-xs font-bold tracking-widest text-monday-violet mb-3 px-3 py-1 rounded-md bg-periwinkle/30">
                    STEP {step.number}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium text-ink tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base text-slate leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full max-w-sm">
                  <StepVisual step={i} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Step-specific mini illustrations */
function StepVisual({ step }) {
  if (step === 0) {
    /* Organization creation card */
    return (
      <div className="rounded-2xl border border-mist bg-cloud/50 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-monday-violet flex items-center justify-center">
            <span className="text-snow font-bold text-sm">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Acme Corp</p>
            <p className="text-xs text-iron">Organization workspace</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-3/4 rounded-full bg-periwinkle/40" />
          <div className="h-2.5 w-1/2 rounded-full bg-lavender/40" />
        </div>
        <div className="mt-4 flex gap-2">
          <span className="px-2 py-1 text-[10px] font-medium bg-mint/30 text-forest rounded-md">
            Isolated
          </span>
          <span className="px-2 py-1 text-[10px] font-medium bg-sky/30 text-monday-violet rounded-md">
            Secure
          </span>
        </div>
      </div>
    );
  }

  if (step === 1) {
    /* Task creation with AI assist */
    return (
      <div className="rounded-2xl border border-mist bg-cloud/50 p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineSparkles className="w-4 h-4 text-ultra-violet" />
          <span className="text-xs font-semibold text-ultra-violet">
            AI Assist
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] text-iron mb-1">Title</p>
            <div className="rounded-lg bg-snow border border-pebble px-3 py-2">
              <p className="text-sm text-ink">Fix auth redirect bug</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-[11px] text-iron mb-1">Category</p>
              <div className="rounded-lg bg-lavender/40 px-3 py-1.5 text-center">
                <p className="text-xs font-medium text-ultra-violet">
                  Debugging
                </p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-iron mb-1">Priority</p>
              <div className="rounded-lg bg-peony/30 px-3 py-1.5 text-center">
                <p className="text-xs font-medium text-apricot">High</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Live tracking dashboard */
  return (
    <div className="rounded-2xl border border-mist bg-cloud/50 p-6 shadow-soft">
      <p className="text-xs font-semibold text-ink mb-3">Live Overview</p>
      <div className="flex items-end gap-1.5 h-24 mb-4">
        {[40, 65, 50, 80, 35, 70, 55].map((h, j) => (
          <div
            key={j}
            className="flex-1 rounded-t-md transition-all"
            style={{
              height: `${h}%`,
              backgroundColor:
                j % 3 === 0
                  ? "#bcfe90"
                  : j % 3 === 1
                    ? "#abf0ff"
                    : "#e7ecff",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-mint" />
          <span className="text-[11px] text-iron">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky" />
          <span className="text-[11px] text-iron">Assigned</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-periwinkle" />
          <span className="text-[11px] text-iron">Pending</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CTA BANNER
   ═══════════════════════════════════════════════ */

function CTABanner() {
  return (
    <section className="py-20 sm:py-28 bg-cloud">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <div className="relative rounded-3xl bg-monday-violet overflow-hidden px-8 py-16 sm:px-16 sm:py-20 text-center">
          {/* Decorative shapes */}
          <div className="absolute top-6 left-10 w-20 h-20 rounded-full bg-white/5 animate-float pointer-events-none" />
          <div className="absolute bottom-8 right-12 w-28 h-28 rounded-full bg-white/5 animate-float-slow pointer-events-none" />
          <div className="absolute top-1/2 right-[25%] w-14 h-14 rounded-full bg-white/5 animate-float-fast pointer-events-none" />

          <h2 className="relative text-2xl sm:text-4xl lg:text-[44px] font-light text-snow tracking-tight leading-tight max-w-2xl mx-auto">
            Ready to stop losing tasks in chat threads?
          </h2>
          <p className="relative mt-4 text-base text-snow/70 max-w-md mx-auto">
            Create your workspace in seconds. No credit card, no setup complexity.
          </p>
          <Link
            to="/signup"
            className="relative group inline-flex items-center gap-2 mt-8 px-8 py-4 text-base font-medium text-monday-violet bg-snow rounded-pill hover:bg-cloud transition-all duration-200 active:scale-[0.97]"
          >
            Get Started Free
            <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="bg-snow border-t border-cloud py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <TaskPilotLogo size="sm" textSize="text-base" />
            </div>
            <p className="text-sm text-iron max-w-xs leading-relaxed">
              Task management for small teams. Built with React, Vite, and PostgreSQL.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 sm:gap-12">
            <div>
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
                Product
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="#features"
                  className="text-sm text-slate hover:text-ink transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-slate hover:text-ink transition-colors"
                >
                  How it works
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
                Account
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="text-sm text-slate hover:text-ink transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm text-slate hover:text-ink transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-cloud flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-iron">
            © {new Date().getFullYear()} TaskPilot. All rights reserved.
          </p>
          <p className="text-xs text-iron">
            Built with React 19, Vite, Tailwind CSS, and PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   LANDING (DEFAULT EXPORT)
   ═══════════════════════════════════════════════ */

export default function Landing() {
  return (
    <div className="min-h-screen bg-snow font-poppins">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  );
}
