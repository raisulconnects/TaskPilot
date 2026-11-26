import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

const SIZES = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-xl" };

// Centered modal shell shared by every dialog: animates in AND out, closes
// on Esc / backdrop, locks body scroll, moves focus in and restores it after.
export default function Dialog({ open, onClose, size = "md", labelledBy, children, dismissible = true }) {
  const panelRef = useRef(null);
  // Parents pass a fresh onClose each render; keep the latest in a ref so a
  // re-render (e.g. a realtime task update) doesn't re-run the effect and
  // yank focus out of the field being typed in.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape" && dismissible) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the panel itself so Tab starts inside the dialog.
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, dismissible]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismissible ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={`relative w-full ${SIZES[size]} max-h-[92vh] flex flex-col bg-snow border border-mist/70 shadow-elevated rounded-t-[28px] sm:rounded-[28px] overflow-hidden outline-none`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DialogClose({ onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="p-2 -m-1 rounded-xl text-iron hover:text-ink hover:bg-cloud transition-colors cursor-pointer"
    >
      <HiOutlineXMark className="w-5 h-5" />
    </button>
  );
}

export function DialogError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-xl bg-peony/30 border border-peony px-3.5 py-2.5 text-xs font-medium text-red-500">
      {children}
    </p>
  );
}
