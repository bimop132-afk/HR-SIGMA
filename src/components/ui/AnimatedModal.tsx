"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}

export default function AnimatedModal({ isOpen, onClose, children, className = "", layoutId }: AnimatedModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0, y: 0 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0, y: 0, transition: { duration: 0.25 } }
  };

  const modalContent = (
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
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={transitionSettings}
            className={`relative w-full pointer-events-auto ${className || 'max-w-lg'}`}
          >
            {/* Morphing Background Layer */}
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 bg-surface rounded-[2rem] shadow-2xl border border-white/10 z-0"
            />

            {/* Content Layer */}
            <div className="relative z-10 w-full max-h-[90vh] flex flex-col hide-scrollbar" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Use Portal to prevent the fixed modal from being bounded by parent CSS contexts like transform/overflow
  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
