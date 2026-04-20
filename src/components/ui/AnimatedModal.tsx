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
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0, y: 0 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0, y: 0, transition: { duration: 0.25 } }
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
          <motion.div 
            layoutId={layoutId}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={transitionSettings}
            className={`relative w-full max-w-lg flex flex-col bg-surface rounded-3xl shadow-2xl border border-white/10 pointer-events-auto ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content Layer */}
            <div className="relative z-10 w-full max-h-[90vh] overflow-y-auto hide-scrollbar p-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
