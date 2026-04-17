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
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
              isActive ? "text-on-primary-fixed" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-primary shadow-lg rounded-xl z-0"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30, // Smooth morphing fluid motion
                }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
