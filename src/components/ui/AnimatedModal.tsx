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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            layoutId={layoutId}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={transitionSettings}
            className={`relative z-10 max-h-[90vh] overflow-y-auto hide-scrollbar ${className}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
