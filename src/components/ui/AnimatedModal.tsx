"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}

export default function AnimatedModal({ isOpen, onClose, children, className = "", layoutId }: AnimatedModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const transitionSettings = {
    duration: 1, // Item B: 1000ms
    ease: [0.16, 1, 0.3, 1] as const // Smooth elastic feeling
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg flex items-center justify-center pointer-events-auto">
            {/* Morphing Background Layer */}
            <motion.div
              layoutId={layoutId}
              transition={transitionSettings}
              className={`absolute inset-0 bg-surface rounded-3xl shadow-2xl border border-white/10 z-0 ${className}`}
            />

            {/* Content Layer (Fades in independently) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-10 w-full max-h-[90vh] overflow-y-auto hide-scrollbar p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
