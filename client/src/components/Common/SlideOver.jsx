import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

// Right-hand panel used for create/add flows. Esc and backdrop close it;
// body scroll is locked while open.
export default function SlideOver({ open, onClose, title, subtitle, icon, children, footer }) {
  const Icon = icon;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            className="absolute inset-y-0 right-0 w-full sm:max-w-lg bg-snow shadow-elevated flex flex-col sm:rounded-l-[28px] overflow-hidden"
          >
            <div className="flex items-start gap-3 px-6 pt-6 pb-5 border-b border-mist/70">
              {Icon && (
                <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-2xl bg-periwinkle text-monday-violet">
                  <Icon className="w-5 h-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-ink tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs text-iron mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 -m-1 rounded-xl text-iron hover:text-ink hover:bg-cloud transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-mist/70 bg-cloud/40">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
