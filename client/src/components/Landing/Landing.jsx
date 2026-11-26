import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineBuildingOffice2,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";
import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiPrisma,
  SiSocketdotio,
  SiTailwindcss,
  SiGooglegemini,
} from "react-icons/si";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import TaskPilotLogo from "../Common/TaskPilotLogo";
import { useAuthContext } from "../../context/AuthContext";

/* ═══════════════════════════════════════════════
   SHARED
   ═══════════════════════════════════════════════ */

const EASE = [0.25, 0.46, 0.45, 0.94];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE },
  }),
};

const NAV_LINKS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
];

const STACK = [
  { icon: SiReact, label: "React" },
  { icon: SiNodedotjs, label: "Node.js" },
  { icon: SiExpress, label: "Express" },
  { icon: SiPostgresql, label: "PostgreSQL" },
  { icon: SiPrisma, label: "Prisma" },
  { icon: SiSocketdotio, label: "Socket.IO" },
  { icon: SiTailwindcss, label: "Tailwind" },
  { icon: SiGooglegemini, label: "Gemini" },
];

function SectionHeader({ eyebrow, title, accent, gradient, subtitle }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="text-center mb-12 sm:mb-16"
    >
      <p className="text-sm font-medium text-monday-violet mb-3 tracking-wide uppercase">
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-light tracking-tight text-ink leading-tight">
        {title}{" "}
        <span className={`bg-linear-to-r ${gradient} bg-clip-text text-transparent font-normal`}>
          {accent}
        </span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate max-w-lg mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}

function PrimaryCTA({ size = "md", inverted = false }) {
  const { user, loading } = useAuthContext();
  const pad = size === "lg" ? "px-8 py-4" : "px-7 py-3.5";
  const tone = inverted
    ? "text-monday-violet bg-snow hover:bg-cloud"
    : "text-snow bg-monday-violet hover:bg-ultra-violet shadow-[0_8px_30px_-8px_rgb(97_97_255/0.6)]";

  if (loading) {
    return (
      <div
        className={`h-[52px] w-48 animate-pulse rounded-pill ${inverted ? "bg-white/20" : "bg-cloud"}`}
      />
    );
  }

  return (
    <Link
      to={user ? "/dashboard" : "/signup"}
      className={`group relative inline-flex items-center gap-2 ${pad} text-base font-medium rounded-pill transition-all duration-200 active:scale-[0.97] ${tone}`}
    >
      {user ? "Go to Dashboard" : "Get Started Free"}
      <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR — floating glass pill
   ═══════════════════════════════════════════════ */

function useActiveSection(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        });
        setActive(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const NAV_IDS = NAV_LINKS.map((l) => l.id);

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const active = useActiveSection(NAV_IDS);
  const { user, loading } = useAuthContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const highlighted = hovered ?? active;

  return (
    <nav className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-5">
      <div
        className={`mx-auto max-w-[960px] rounded-pill border transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-snow/75 border-mist/80 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgb(51_51_51/0.18)]"
            : "bg-snow/40 border-mist/50 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 pl-4 pr-2 sm:pl-5 sm:pr-2.5">
          <TaskPilotLogo size="sm" textSize="text-lg" />

          {/* Desktop links with sliding highlight */}
          <div className="hidden md:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onMouseEnter={() => setHovered(l.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-pill transition-colors ${
                  highlighted === l.id ? "text-ink" : "text-slate"
                }`}
              >
                {highlighted === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-pill bg-periwinkle/70"
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="h-10 w-44 animate-pulse rounded-pill bg-cloud" />
            ) : user ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-snow bg-monday-violet rounded-pill hover:bg-ultra-violet transition-all duration-200 active:scale-[0.97]"
              >
                Go to Dashboard
                <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-medium text-slate rounded-pill hover:text-ink hover:bg-cloud transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 text-sm font-medium text-snow bg-monday-violet rounded-pill hover:bg-ultra-violet transition-all duration-200 active:scale-[0.97]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-ink hover:bg-cloud transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiXMark size={22} /> : <HiBars3 size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-auto mt-2 max-w-[960px] rounded-3xl border border-mist/80 bg-snow/95 backdrop-blur-xl p-3 shadow-elevated"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate hover:text-ink rounded-2xl hover:bg-cloud transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <hr className="my-2 border-cloud" />
              {loading ? (
                <div className="h-12 animate-pulse rounded-2xl bg-cloud" />
              ) : user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-snow text-center bg-monday-violet rounded-2xl hover:bg-ultra-violet transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-3 text-sm font-medium text-slate text-center border border-pebble rounded-2xl hover:bg-cloud transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-3 text-sm font-medium text-snow text-center bg-monday-violet rounded-2xl hover:bg-ultra-violet transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   HERO — grid + glow, tilted product mockup
   ═══════════════════════════════════════════════ */

function Hero() {
  const reduce = useReducedMotion();
  const mockupRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mockupRef,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.92, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.8]);

  return (
    <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 overflow-hidden">
      {/* Background: faint grid fading out from the top, violet glow */}
      <div className="absolute inset-0 bg-grid mask-fade-top pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full bg-monday-violet/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-24 left-[12%] w-56 h-56 rounded-full bg-cotton-candy/15 blur-3xl pointer-events-none" />
      <div className="absolute top-36 right-[10%] w-64 h-64 rounded-full bg-electric-cyan/15 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-pill border border-periwinkle-wash bg-snow/70 backdrop-blur mb-6 sm:mb-8 shadow-soft"
        >
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-monday-violet text-snow text-[11px] font-semibold">
            <HiOutlineSparkles className="w-3 h-3" />
            AI
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate tracking-wide">
            Task management, simplified
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="text-4xl sm:text-6xl lg:text-[72px] font-light leading-[1.05] tracking-tight text-ink max-w-4xl mx-auto"
        >
          Stop losing work in{" "}
          <span className="bg-linear-to-r from-cotton-candy via-ultra-violet to-apricot bg-clip-text text-transparent font-normal">
            chat threads
          </span>
          .
        </motion.h1>

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
          <PrimaryCTA />
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium text-slate border border-pebble bg-snow/60 backdrop-blur rounded-pill hover:border-mist hover:bg-snow transition-all duration-200"
          >
            <HiOutlinePlay className="w-4 h-4" />
            See how it works
          </a>
        </motion.div>

        {/* Tilted mockup */}
        <motion.div
          ref={mockupRef}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          className="relative mt-14 sm:mt-20 mx-auto max-w-5xl"
          style={{ perspective: 1400 }}
        >
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute inset-x-10 top-10 bottom-0 rounded-[40px] bg-linear-to-r from-cotton-candy/40 via-monday-violet/40 to-electric-cyan/40 blur-3xl pointer-events-none"
          />
          <motion.div style={{ rotateX, scale, transformOrigin: "50% 0%" }} className="relative">
            <DashboardMockup />
          </motion.div>
        </motion.div>

        {/* Built with */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 sm:mt-20"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-iron mb-5">
            Built with a modern stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:gap-x-10">
            {STACK.map((tech) => (
              <div
                key={tech.label}
                className="flex items-center gap-2 text-iron/80 hover:text-ink transition-colors"
              >
                <tech.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tech.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD MOCKUP — decorative, static
   ═══════════════════════════════════════════════ */

function DashboardMockup() {
  const tasks = [
    { title: "Design landing page hero", who: "Rahim", status: "assigned", priority: "High", cat: "Design" },
    { title: "Fix login redirect bug", who: "Karim", status: "completed", priority: "High", cat: "Debugging" },
    { title: "Write API documentation", who: "Nusrat", status: "assigned", priority: "Average", cat: "General" },
    { title: "Overdue client report", who: "Rahim", status: "failed", priority: "Average", cat: "General" },
  ];

  const statusStyle = {
    assigned: "bg-sky/30 text-monday-violet",
    completed: "bg-mint/40 text-forest",
    failed: "bg-peony/40 text-apricot",
  };
  const dot = { assigned: "bg-cornflower", completed: "bg-green-400", failed: "bg-red-400" };

  return (
    <div className="rounded-3xl border border-mist bg-snow/90 backdrop-blur shadow-elevated overflow-hidden text-left ring-1 ring-white/60">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-cloud bg-cloud/60">
        <span className="w-3 h-3 rounded-full bg-red-400/70" />
        <span className="w-3 h-3 rounded-full bg-amber-400/70" />
        <span className="w-3 h-3 rounded-full bg-green-400/70" />
        <div className="ml-4 hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-snow border border-cloud text-[11px] text-iron">
          <HiOutlineLockClosed className="w-3 h-3" />
          taskpilot.app/dashboard
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0 border-r border-cloud p-4 bg-cloud/30">
          {[
            { icon: HiOutlineChartBar, label: "Overview", on: true },
            { icon: HiOutlineCheckCircle, label: "Tasks" },
            { icon: HiOutlineUserGroup, label: "Members" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                item.on ? "bg-snow text-ink shadow-soft" : "text-slate"
              }`}
            >
              <item.icon className={`w-4 h-4 ${item.on ? "text-monday-violet" : ""}`} />
              {item.label}
            </div>
          ))}
        </aside>

        <div className="flex-1 min-w-0 p-5 sm:p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-slate font-medium">Good morning,</p>
              <p className="text-lg font-semibold text-ink">Sumo Admin 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-mint/30 text-forest">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
                </span>
                Live
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-monday-violet text-snow rounded-md">
                <HiOutlinePlus className="w-3.5 h-3.5" /> New task
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Assigned", count: "4", color: "bg-sky/20 text-slate" },
              { label: "Completed", count: "1", color: "bg-mint/25 text-forest" },
              { label: "Failed", count: "1", color: "bg-peony/25 text-apricot" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-3 sm:p-4 ${s.color}`}>
                <p className="text-xl sm:text-2xl font-semibold">{s.count}</p>
                <p className="text-xs font-medium opacity-70">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.title}
                className="flex items-center justify-between rounded-xl border border-cloud px-4 py-3 bg-snow"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dot[t.status]}`} />
                  <span className="text-sm font-medium text-ink truncate">{t.title}</span>
                  <span className="hidden lg:inline text-xs text-iron shrink-0">· {t.who}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="hidden sm:inline px-2 py-0.5 text-[11px] font-medium rounded-md bg-cloud text-slate">
                    {t.cat}
                  </span>
                  <span
                    className={`hidden sm:inline px-2 py-0.5 text-[11px] font-medium rounded-md ${
                      t.priority === "High" ? "bg-lavender/60 text-ultra-violet" : "bg-periwinkle/50 text-slate"
                    }`}
                  >
                    {t.priority}
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${statusStyle[t.status]}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FEATURES — bento grid with live mini-UIs
   ═══════════════════════════════════════════════ */

function BentoCard({ icon, title, description, className = "", children, index = 0, iconTone }) {
  const Icon = icon;
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={`group relative flex flex-col rounded-3xl border border-mist/70 bg-snow p-6 sm:p-7 overflow-hidden transition-shadow duration-300 hover:shadow-card ${className}`}
    >
      {/* hover sheen */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_50%_0%,rgb(97_97_255/0.06),transparent_60%)] pointer-events-none" />
      <div className="relative flex-1 min-h-[180px] mb-6 flex items-center justify-center">{children}</div>
      <div className="relative">
        <div className="flex items-center gap-2.5 mb-2">
          <span className={`inline-flex w-8 h-8 items-center justify-center rounded-xl ${iconTone}`}>
            <Icon className="w-4 h-4" />
          </span>
          <h3 className="text-lg font-semibold text-ink tracking-tight">{title}</h3>
        </div>
        <p className="text-sm text-slate leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/* Shared looping hook: advances a counter while the element is on screen. */
function useLoop(ref, ms, steps) {
  const inView = useInView(ref, { margin: "-80px" });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setTick((t) => (t + 1) % steps), ms);
    return () => clearInterval(id);
  }, [inView, reduce, ms, steps]);

  return { tick, reduce };
}

const FEED = [
  { who: "Karim", verb: "completed", task: "Fix login redirect bug", tone: "bg-mint/40 text-forest", icon: HiOutlineCheckCircle },
  { who: "Admin", verb: "assigned", task: "Design landing page hero", tone: "bg-sky/40 text-monday-violet", icon: HiOutlinePlus },
  { who: "Nusrat", verb: "completed", task: "Refactor socket rooms", tone: "bg-mint/40 text-forest", icon: HiOutlineCheckCircle },
  { who: "Admin", verb: "assigned", task: "Write API documentation", tone: "bg-sky/40 text-monday-violet", icon: HiOutlinePlus },
  { who: "Rahim", verb: "completed", task: "Set up CI pipeline", tone: "bg-mint/40 text-forest", icon: HiOutlineCheckCircle },
];

const SLOT = 60;

function RealtimeVisual() {
  const ref = useRef(null);
  // Unbounded counter so keys never repeat; newest event first.
  const { tick } = useLoop(ref, 2200, Infinity);
  const visible = [2, 1, 0].map((o) => {
    const n = tick + o;
    return { ...FEED[n % FEED.length], key: n };
  });

  return (
    <div ref={ref} className="w-full max-w-md">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-ink">Activity</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-forest">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live via Socket.IO
        </span>
      </div>
      <div className="relative h-[176px] overflow-hidden">
        <AnimatePresence initial={false}>
          {visible.map((e, i) => (
            <motion.div
              key={e.key}
              initial={{ opacity: 0, y: -SLOT, scale: 0.96 }}
              animate={{ opacity: 1 - i * 0.3, y: i * SLOT, scale: 1 - i * 0.025 }}
              exit={{ opacity: 0, y: 3 * SLOT, scale: 0.92 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ zIndex: 3 - i }}
              className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-2xl border border-cloud bg-snow px-4 py-3 shadow-soft"
            >
              <span className={`inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-xl ${e.tone}`}>
                <e.icon className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate truncate">
                <span className="font-semibold text-ink">{e.who}</span> {e.verb}{" "}
                <span className="font-medium text-ink">“{e.task}”</span>
              </p>
              <span className="ml-auto text-[11px] text-iron shrink-0">now</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const AI_TITLE = "Fix auth redirect bug";

function AIVisual() {
  const ref = useRef(null);
  // 0-1 typing, 2 thinking, 3-5 result shown
  const { tick, reduce } = useLoop(ref, 1100, 6);
  const phase = reduce ? 5 : tick;
  const typed = phase === 0 ? AI_TITLE.slice(0, 8) : AI_TITLE;
  const showResult = phase >= 3;

  return (
    <div ref={ref} className="w-full max-w-xs rounded-2xl border border-mist/80 bg-cloud/50 p-4">
      <p className="text-[11px] text-iron mb-1">Title</p>
      <div className="rounded-lg bg-snow border border-pebble px-3 py-2 mb-3">
        <p className="text-sm text-ink">
          {typed}
          {phase < 2 && <span className="inline-block w-px h-4 align-middle bg-ink ml-0.5 animate-pulse" />}
        </p>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <HiOutlineSparkles className={`w-3.5 h-3.5 text-ultra-violet ${phase === 2 ? "animate-spin" : ""}`} />
        <span className="text-[11px] font-semibold text-ultra-violet">
          {phase === 2 ? "Generating…" : showResult ? "Suggested by Gemini" : "AI Assist"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Category", value: "Debugging", tone: "bg-lavender/60 text-ultra-violet" },
          { label: "Priority", value: "High", tone: "bg-peony/40 text-apricot" },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            animate={{ opacity: showResult ? 1 : 0.35, y: showResult ? 0 : 4 }}
            transition={{ duration: 0.35, delay: showResult ? i * 0.12 : 0 }}
            className={`rounded-lg px-3 py-1.5 text-center ${showResult ? c.tone : "bg-pebble/50 text-iron"}`}
          >
            <p className="text-[10px] opacity-70">{c.label}</p>
            <p className="text-xs font-medium">{showResult ? c.value : "—"}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ opacity: showResult ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showResult ? 0.25 : 0 }}
        className="mt-3 space-y-1.5"
      >
        <div className="h-2 w-full rounded-full bg-lavender/60" />
        <div className="h-2 w-4/5 rounded-full bg-lavender/60" />
      </motion.div>
    </div>
  );
}

function IsolationVisual() {
  return (
    <div className="relative w-full max-w-xs">
      {[
        { name: "SumoOrg", members: "4 members", tone: "bg-monday-violet", offset: "" },
        { name: "Acme Corp", members: "12 members", tone: "bg-apricot", offset: "ml-6 sm:ml-8" },
      ].map((o, i) => (
        <div
          key={o.name}
          className={`relative flex items-center gap-3 rounded-2xl border border-mist/80 bg-snow px-4 py-3 shadow-soft ${o.offset} ${
            i === 0 ? "mb-10" : ""
          }`}
        >
          <span className={`w-9 h-9 rounded-xl ${o.tone} text-snow flex items-center justify-center`}>
            <HiOutlineBuildingOffice2 className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{o.name}</p>
            <p className="text-[11px] text-iron">{o.members}</p>
          </div>
          <span className="ml-auto px-2 py-0.5 text-[10px] font-medium rounded-md bg-mint/40 text-forest">
            Isolated
          </span>
        </div>
      ))}
      {/* the wall */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2">
        <div className="flex-1 border-t border-dashed border-fog" />
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-snow border border-mist text-[10px] font-medium text-slate">
          <HiOutlineLockClosed className="w-3 h-3" /> Row-level security
        </span>
        <div className="flex-1 border-t border-dashed border-fog" />
      </div>
    </div>
  );
}

function OverdueVisual() {
  const ref = useRef(null);
  const { tick, reduce } = useLoop(ref, 1500, 4);
  const states = [
    { due: "Due in 2 days", status: "Assigned", tone: "bg-sky/40 text-monday-violet", bar: "w-1/3 bg-cornflower" },
    { due: "Due tomorrow", status: "Assigned", tone: "bg-sky/40 text-monday-violet", bar: "w-2/3 bg-amber-400" },
    { due: "Due today", status: "Assigned", tone: "bg-amber-100 text-amber-700", bar: "w-[90%] bg-amber-500" },
    { due: "1 day overdue", status: "Failed", tone: "bg-peony/50 text-apricot", bar: "w-full bg-red-400" },
  ];
  const s = states[reduce ? 3 : tick];

  return (
    <div ref={ref} className="w-full max-w-xs rounded-2xl border border-mist/80 bg-snow p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-ink">Monthly client report</p>
          <motion.p key={s.due} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-iron mt-0.5">
            {s.due}
          </motion.p>
        </div>
        <motion.span
          key={s.status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${s.tone}`}
        >
          {s.status}
        </motion.span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-cloud overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${s.bar}`} />
      </div>
      <p className="mt-3 text-[11px] text-iron">Marked failed automatically. No manual check.</p>
    </div>
  );
}

function AnalyticsVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const bars = [
    { name: "Rahim", v: 70 },
    { name: "Karim", v: 95 },
    { name: "Nusrat", v: 55 },
    { name: "Tanvir", v: 80 },
  ];

  return (
    <div ref={ref} className="w-full max-w-xs flex items-end gap-5">
      {/* donut */}
      <svg viewBox="0 0 42 42" className="w-24 h-24 -rotate-90 shrink-0" aria-hidden>
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#f5f6f8" strokeWidth="6" />
        {[
          { v: 55, off: 0, c: "#93beff" },
          { v: 30, off: 55, c: "#bcfe90" },
          { v: 15, off: 85, c: "#fcd0f8" },
        ].map((seg) => (
          <motion.circle
            key={seg.c}
            cx="21"
            cy="21"
            r="15.9"
            fill="none"
            stroke={seg.c}
            strokeWidth="6"
            strokeDasharray={`${seg.v} ${100 - seg.v}`}
            strokeDashoffset={-seg.off}
            pathLength={100}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: seg.off / 100 }}
          />
        ))}
      </svg>
      {/* bars */}
      <div className="flex-1 flex items-end gap-2 h-24">
        {bars.map((b, i) => (
          <div key={b.name} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: inView ? `${b.v}%` : 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}
              className="w-full rounded-t-md bg-linear-to-t from-monday-violet to-prism"
            />
            <span className="text-[9px] text-iron">{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RolesVisual() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Admin pane */}
      <div className="rounded-2xl border border-mist/80 bg-snow p-4 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-monday-violet/10 text-monday-violet">
            ADMIN VIEW
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md bg-monday-violet text-snow">
            <HiOutlinePlus className="w-3 h-3" /> Assign
          </span>
        </div>
        {["Rahim Uddin", "Karim Sheikh", "Nusrat Jahan"].map((n, i) => (
          <div key={n} className="flex items-center gap-2.5 py-1.5">
            <span className="w-6 h-6 rounded-full bg-periwinkle text-[10px] font-semibold text-monday-violet flex items-center justify-center">
              {n[0]}
            </span>
            <span className="text-xs font-medium text-ink">{n}</span>
            <div className="ml-auto h-1.5 w-16 rounded-full bg-cloud overflow-hidden">
              <div className="h-full rounded-full bg-monday-violet" style={{ width: `${[60, 90, 40][i]}%` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Employee pane */}
      <div className="rounded-2xl border border-mist/80 bg-snow p-4 shadow-soft">
        <span className="inline-block mb-3 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-mint/40 text-forest">
          EMPLOYEE VIEW
        </span>
        {[
          { t: "Design landing page hero", done: false },
          { t: "Overdue client report", done: false, failed: true },
        ].map((t) => (
          <div key={t.t} className="flex items-center justify-between gap-2 py-1.5">
            <span className="text-xs font-medium text-ink truncate">{t.t}</span>
            {t.failed ? (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-peony/50 text-apricot shrink-0">
                Failed
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md border border-monday-violet/30 text-monday-violet shrink-0">
                Mark complete
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-cloud scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeader
          eyebrow="Features"
          title="Everything your"
          accent="team needs"
          gradient="from-monday-violet to-electric-cyan"
          subtitle="Simple tools that replace your chat-thread coordination and spreadsheet tracking — nothing more, nothing less."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          <BentoCard
            index={0}
            className="md:col-span-2 lg:col-span-4"
            icon={HiOutlineBolt}
            iconTone="bg-sky/40 text-monday-violet"
            title="Realtime updates"
            description="New assignments appear instantly. Completions show up on the admin side in realtime — no refresh, either direction."
          >
            <RealtimeVisual />
          </BentoCard>
          <BentoCard
            index={1}
            className="lg:col-span-2"
            icon={HiOutlineSparkles}
            iconTone="bg-lavender/60 text-ultra-violet"
            title="AI-assisted creation"
            description="Type a title. AI writes the description and suggests the category and priority."
          >
            <AIVisual />
          </BentoCard>
          <BentoCard
            index={2}
            className="lg:col-span-2"
            icon={HiOutlineShieldCheck}
            iconTone="bg-mint/40 text-forest"
            title="Isolated workspaces"
            description="Every company gets its own workspace. No other organization can ever see your data."
          >
            <IsolationVisual />
          </BentoCard>
          <BentoCard
            index={3}
            className="lg:col-span-2"
            icon={HiOutlineClock}
            iconTone="bg-peony/50 text-apricot"
            title="Auto overdue detection"
            description="Past-due work marks itself failed and shows up in everyone's counts. Nothing slips silently."
          >
            <OverdueVisual />
          </BentoCard>
          <BentoCard
            index={4}
            className="lg:col-span-2"
            icon={HiOutlineChartBar}
            iconTone="bg-periwinkle text-cornflower"
            title="Visual analytics"
            description="Live status distribution and per-employee completion charts, at a glance."
          >
            <AnalyticsVisual />
          </BentoCard>
          <BentoCard
            index={5}
            className="md:col-span-2 lg:col-span-6"
            icon={HiOutlineUserGroup}
            iconTone="bg-aqua text-forest"
            title="Role-based dashboards"
            description="Admins manage and assign. Employees see their own tasks. Each role gets the dashboard built for their job."
          >
            <RolesVisual />
          </BentoCard>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HOW IT WORKS — tabbed step switcher
   ═══════════════════════════════════════════════ */

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

const STEP_DURATION = 6;

function HowItWorks() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-120px" });
  const autoplay = auto && !reduce && inView;

  const select = (i) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-snow scroll-mt-20">
      <div ref={ref} className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps to"
          accent="clarity"
          gradient="from-cotton-candy to-apricot"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 lg:gap-14 items-center">
          {/* Tabs */}
          <div role="tablist" aria-label="How TaskPilot works" className="flex flex-col gap-3">
            {STEPS.map((step, i) => {
              const on = i === active;
              return (
                <button
                  key={step.number}
                  role="tab"
                  aria-selected={on}
                  aria-controls="how-panel"
                  onClick={() => select(i)}
                  className={`relative text-left rounded-3xl border p-5 sm:p-6 overflow-hidden transition-all duration-300 ${
                    on
                      ? "border-mist bg-snow shadow-card"
                      : "border-transparent bg-cloud/60 hover:bg-cloud"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`shrink-0 inline-flex w-10 h-10 items-center justify-center rounded-2xl text-xs font-bold tracking-widest transition-colors ${
                        on ? "bg-monday-violet text-snow" : "bg-snow text-iron"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-medium tracking-tight ${on ? "text-ink" : "text-slate"}`}>
                        {step.title}
                      </h3>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="text-sm sm:text-base text-slate leading-relaxed overflow-hidden pt-2"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* progress */}
                  {on && autoplay && (
                    <motion.span
                      key={`progress-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: STEP_DURATION, ease: "linear" }}
                      onAnimationComplete={() => setActive((a) => (a + 1) % STEPS.length)}
                      style={{ transformOrigin: "0% 50%" }}
                      className="absolute left-0 bottom-0 h-0.5 w-full bg-linear-to-r from-monday-violet to-cotton-candy"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            id="how-panel"
            role="tabpanel"
            className="relative rounded-[32px] bg-cloud border border-mist/60 p-6 sm:p-10 min-h-[340px] sm:min-h-[380px] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid mask-vignette opacity-70 pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative w-full max-w-sm"
              >
                <StepVisual step={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepVisual({ step }) {
  if (step === 0) {
    return (
      <div className="rounded-3xl border border-mist bg-snow p-6 shadow-card">
        <p className="text-xs font-semibold text-ink mb-4">Create organization</p>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] text-iron mb-1">Organization name</p>
            <div className="rounded-xl bg-cloud/60 border border-pebble px-3 py-2.5 text-sm text-ink">Acme Corp</div>
          </div>
          <div>
            <p className="text-[11px] text-iron mb-1">Admin email</p>
            <div className="rounded-xl bg-cloud/60 border border-pebble px-3 py-2.5 text-sm text-ink">you@acme.com</div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <span className="px-2 py-1 text-[10px] font-medium bg-mint/40 text-forest rounded-md">Isolated</span>
              <span className="px-2 py-1 text-[10px] font-medium bg-sky/40 text-monday-violet rounded-md">Secure</span>
            </div>
            <span className="px-3 py-1.5 text-xs font-medium rounded-pill bg-monday-violet text-snow">Create</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="rounded-3xl border border-mist bg-snow p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineSparkles className="w-4 h-4 text-ultra-violet" />
          <span className="text-xs font-semibold text-ultra-violet">AI Assist</span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] text-iron mb-1">Title</p>
            <div className="rounded-xl bg-cloud/60 border border-pebble px-3 py-2.5 text-sm text-ink">
              Fix auth redirect bug
            </div>
          </div>
          <div>
            <p className="text-[11px] text-iron mb-1">Description</p>
            <div className="rounded-xl bg-lavender/30 border border-lavender px-3 py-2.5 space-y-1.5">
              <div className="h-2 w-full rounded-full bg-lavender" />
              <div className="h-2 w-5/6 rounded-full bg-lavender" />
              <div className="h-2 w-2/3 rounded-full bg-lavender" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-lavender/60 px-2 py-1.5 text-center text-xs font-medium text-ultra-violet">Debugging</div>
            <div className="rounded-lg bg-peony/40 px-2 py-1.5 text-center text-xs font-medium text-apricot">High</div>
            <div className="rounded-lg bg-cloud px-2 py-1.5 text-center text-xs font-medium text-slate">→ Karim</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-mist bg-snow p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-ink">Live overview</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-forest">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-28 mb-4">
        {[40, 65, 50, 80, 35, 70, 55].map((h, j) => (
          <motion.div
            key={j}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.6, delay: j * 0.06, ease: EASE }}
            className={`flex-1 rounded-t-md ${["bg-mint", "bg-sky", "bg-periwinkle-wash"][j % 3]}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        {[
          { c: "bg-mint", l: "Completed" },
          { c: "bg-sky", l: "Assigned" },
          { c: "bg-periwinkle-wash", l: "Failed" },
        ].map((x) => (
          <div key={x.l} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${x.c}`} />
            <span className="text-[11px] text-iron">{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CTA — violet block with vignette grid
   ═══════════════════════════════════════════════ */

function CTABanner() {
  const { user } = useAuthContext();

  return (
    <section className="py-20 sm:py-28 bg-cloud">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <div className="relative rounded-[32px] bg-monday-violet overflow-hidden px-8 py-16 sm:px-16 sm:py-24 text-center">
          <div className="absolute inset-0 bg-grid-light mask-vignette pointer-events-none" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[280px] rounded-full bg-cotton-candy/40 blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-28 right-0 w-[380px] h-[260px] rounded-full bg-electric-cyan/30 blur-[90px] pointer-events-none" />

          <h2 className="relative text-3xl sm:text-4xl lg:text-[48px] font-light text-snow tracking-tight leading-tight max-w-2xl mx-auto">
            {user ? "Pick up right where you left off?" : "Ready to stop losing tasks in chat threads?"}
          </h2>
          <p className="relative mt-4 text-base sm:text-lg text-snow/75 max-w-md mx-auto">
            {user
              ? "Your workspace is waiting — jump back into your tasks."
              : "Create your workspace in seconds. No credit card, no setup complexity."}
          </p>
          <div className="relative mt-9">
            <PrimaryCTA size="lg" inverted />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER — link columns + giant wordmark
   ═══════════════════════════════════════════════ */

function FooterLink({ href, to, children, external }) {
  const cls = "text-sm text-slate hover:text-ink transition-colors";
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function Footer() {
  const { user, loading } = useAuthContext();

  return (
    <footer className="relative bg-snow border-t border-cloud pt-12 sm:pt-16 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-10">
          <div>
            <div className="mb-3">
              <TaskPilotLogo size="sm" textSize="text-base" />
            </div>
            <p className="text-sm text-iron max-w-xs leading-relaxed">
              Isolated workspaces, realtime tracking, and AI-assisted task creation for small teams.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://github.com/raisulconnects/TaskPilot"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TaskPilot source code on GitHub"
                className="p-2 rounded-lg text-iron hover:text-ink hover:bg-cloud transition-colors"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/raisul-tanna/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Builder on LinkedIn"
                className="p-2 rounded-lg text-iron hover:text-ink hover:bg-cloud transition-colors"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 sm:gap-14">
            <div>
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Product</p>
              <div className="flex flex-col gap-2">
                <FooterLink href="#features">Features</FooterLink>
                <FooterLink href="#how-it-works">How it works</FooterLink>
                <FooterLink to="/signup">Get started</FooterLink>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Resources</p>
              <div className="flex flex-col gap-2">
                <FooterLink href="https://github.com/raisulconnects/TaskPilot" external>
                  Source code
                </FooterLink>
                <FooterLink href="https://github.com/raisulconnects/TaskPilot/issues" external>
                  Report an issue
                </FooterLink>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Account</p>
              <div className="flex flex-col gap-2">
                {loading ? (
                  <div className="h-4 w-20 animate-pulse rounded bg-cloud" />
                ) : user ? (
                  <FooterLink to="/dashboard">Dashboard</FooterLink>
                ) : (
                  <>
                    <FooterLink to="/login">Log in</FooterLink>
                    <FooterLink to="/signup">Sign up</FooterLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cloud flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-iron">© {new Date().getFullYear()} TaskPilot. All rights reserved.</p>
          <p className="text-xs text-iron">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/raisul-tanna/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate hover:text-ink transition-colors"
            >
              Raisul Tanna
            </a>
          </p>
        </div>
      </div>

      {/* Giant wordmark */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="select-none pointer-events-none text-center font-bold tracking-tighter leading-[0.78] text-wordmark text-[21vw] lg:text-[250px] mt-6 -mb-[2vw] lg:-mb-6"
      >
        TaskPilot
      </motion.div>
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
