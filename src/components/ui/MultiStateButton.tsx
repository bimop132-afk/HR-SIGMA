"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

interface MultiStateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state: ButtonState;
  idleText?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

export default function MultiStateButton({
  state,
  idleText = "Submit",
  loadingText = "Memproses...",
  successText = "Berhasil",
  errorText = "Gagal",
  className = "",
  ...props
}: MultiStateButtonProps) {
  
  const variants: Variants = {
    initial: { opacity: 0, y: 15, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -15, scale: 0.9 },
  };

  const transition = {
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1] as const // balanced springy-feel Custom ease
  };

  return (
    <button
      className={`relative overflow-hidden flex items-center justify-center font-bold px-6 py-3 rounded-2xl transition-all duration-300 ${
        state === "success" 
          ? "bg-secondary text-on-secondary" 
          : state === "error" 
            ? "bg-error text-on-error"
            : state === "loading"
              ? "bg-surface-variant text-on-surface-variant cursor-wait"
              : "liquid-light text-on-primary-fixed hover:-translate-y-0.5 hover:shadow-lg"
      } ${className}`}
      disabled={state === "loading" || state === "success" || props.disabled}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "idle" && (
          <motion.div
            key="idle"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex items-center gap-2"
          >
            {idleText}
          </motion.div>
        )}
        
        {state === "loading" && (
          <motion.div
            key="loading"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            {loadingText}
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {successText}
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">cancel</span>
            {errorText}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
