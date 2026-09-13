import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineXMark,
} from "react-icons/hi2";

export default function CompleteTaskModal({
  isOpen,
  onClose,
  taskTitle,
  onConfirm,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Failed to complete task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative bg-white rounded-3xl border border-mist shadow-elevated w-full max-w-md p-6 sm:p-7 z-10 space-y-5 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-iron hover:text-ink hover:bg-cloud transition-colors cursor-pointer"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-mint/30 border border-mint/60 text-forest flex items-center justify-center shadow-xs">
            <HiOutlineCheckCircle className="w-7 h-7" />
          </div>

          {/* Title and Message */}
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-ink">Mark as Completed?</h3>
            <p className="text-xs text-iron">
              Confirm that you have finished working on:
            </p>
            {taskTitle && (
              <p className="font-semibold text-sm text-ink bg-cloud px-3 py-1.5 rounded-xl inline-block mt-1">
                "{taskTitle}"
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-5 py-2.5 rounded-full text-xs font-semibold text-slate bg-cloud hover:bg-mist/30 border border-mist transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-monday-violet hover:bg-[#4e4ee0] shadow-soft transition-all cursor-pointer disabled:opacity-50"
            >
              <HiOutlineCheckCircle className="w-4 h-4" />
              {isSubmitting ? "Completing..." : "Yes, Mark Complete"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
