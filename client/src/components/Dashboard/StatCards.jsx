import { useEffect, useRef } from "react";
import { motion, animate, useReducedMotion } from "framer-motion";

const TONES = {
  violet: "bg-periwinkle text-monday-violet",
  sky: "bg-sky/40 text-[#1d6fa3]",
  mint: "bg-mint/50 text-forest",
  peony: "bg-peony/60 text-red-500",
  lavender: "bg-lavender text-ultra-violet",
};

function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const prev = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = `${value}${suffix}`;
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, suffix, reduce]);

  return <span ref={ref}>{`${value}${suffix}`}</span>;
}

/**
 * items: [{ key, label, value, suffix?, hint, icon, tone, progress? (0..1) }]
 */
export default function StatCards({ items }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
          className={`rounded-3xl border border-mist/70 bg-snow p-4 sm:p-5 ${
            i === items.length - 1 && items.length % 2 === 1 ? "col-span-2 lg:col-span-1" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate truncate">{item.label}</p>
            <span className={`inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-xl ${TONES[item.tone]}`}>
              <item.icon className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">
            <AnimatedNumber value={item.value} suffix={item.suffix} />
          </p>
          {item.progress !== undefined ? (
            <div className="mt-2.5">
              <div className="h-1.5 w-full rounded-full bg-cloud overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(item.progress * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-monday-violet to-cotton-candy"
                />
              </div>
              <p className="mt-1.5 text-xs text-iron truncate">{item.hint}</p>
            </div>
          ) : (
            <p className="mt-1 text-xs text-iron truncate">{item.hint}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
