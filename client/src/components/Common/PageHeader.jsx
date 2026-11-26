import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineArrowPath } from "react-icons/hi2";
import LiveStatus from "./LiveStatus";

export default function PageHeader({ eyebrow, title, subtitle, onRefresh, actions }) {
  const [spinning, setSpinning] = useState(false);

  const refresh = async () => {
    setSpinning(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setSpinning(false), 400);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-monday-violet mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-ink leading-tight">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LiveStatus />
        {onRefresh && (
          <button
            type="button"
            onClick={refresh}
            title="Refresh"
            aria-label="Refresh"
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-mist bg-snow text-slate hover:text-monday-violet hover:border-monday-violet/40 transition-colors cursor-pointer"
          >
            <HiOutlineArrowPath className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} />
          </button>
        )}
        {actions}
      </div>
    </motion.header>
  );
}
