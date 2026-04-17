"use client";
import { motion } from "framer-motion";

interface AnimatedToggleProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function AnimatedToggle({ isOn, onToggle, disabled = false }: AnimatedToggleProps) {
  return (
    <button
      className={`w-12 h-6 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${
        isOn ? "bg-primary" : "bg-surface-container-highest"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => (!disabled ? onToggle() : null)}
      aria-pressed={isOn}
    >
      <motion.div
        className="w-4 h-4 bg-white rounded-full shadow-md"
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.4
        }}
        animate={{
          x: isOn ? 24 : 0
        }}
      />
    </button>
  );
}
