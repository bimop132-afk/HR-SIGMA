"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface MorphingTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MorphingTabs({ tabs, activeTab, onTabChange }: MorphingTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-surface-container-highest border border-white/5 rounded-2xl w-max">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <motion.button
            key={tab}
            onClick={() => onTabChange(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-colors outline-none cursor-pointer ${
              isActive ? "text-on-primary-fixed" : "text-on-surface-variant hover:text-on-surface"
            }`}
            style={{ transition: "color 0.2s ease" }} // Override global spring for smooth internal Framer scaling
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-primary shadow-[0_4px_12px_rgba(220,38,38,0.3)] rounded-xl z-0"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.8
                }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
