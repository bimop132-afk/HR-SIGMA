"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, Variants, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
}

/**
 * ==============   Utils   ================
 */
const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

/**
 * ==============   Components   ================
 */

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle, isOpen }: { toggle: () => void; isOpen: boolean }) => (
  <button 
    onClick={toggle}
    className="fixed top-[12px] left-[20px] w-10 h-10 rounded-full flex items-center justify-center text-red-500 hover:bg-white/5 transition-colors z-[70] cursor-pointer outline-none border-none"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
        animate={isOpen ? "open" : "closed"}
      />
    </svg>
  </button>
);

export default function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);

  const navItems = [
    { href: "/",            icon: "dashboard",       label: "Dashboard" },
    { href: "/karyawan",    icon: "group",           label: "Karyawan" },
    { href: "/onboarding",  icon: "person_add",      label: "Onboarding" },
    { href: "/karyawan/penempatan", icon: "assignment_ind", label: "Penempatan" },
    { href: "/offboarding", icon: "person_remove",   label: "Resign" },
    { href: "/denda",       icon: "gavel",           label: "Denda & Pinalti" },
    { href: "/analitik",    icon: "analytics",       label: "Analitik SDM" },
    { href: "/pengingat",   icon: "notifications",   label: "Pengingat" },
    { href: "/dokumen",     icon: "description",     label: "Dokumen" },
    { href: "/absensi",     icon: "date_range",      label: "Rekap Absensi" },
    { href: "/export",      icon: "ios_share",       label: "Export Laporan" },
  ];

  const sidebarVariants: Variants = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 32px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: "circle(20px at 40px 32px)",
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const navVariants: Variants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants: Variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  return (
    <div className="relative">
      {/* Mobile Overlay */}
      <motion.div 
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" }
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
        onClick={onClose}
      />

      <motion.aside 
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        variants={sidebarVariants}
        className="fixed left-0 top-0 bottom-0 z-[60] w-72 bg-zinc-950 border-r border-white/5 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Dark Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black -z-10" />

        <div className="pt-20 px-6 mb-8">
          <motion.div 
            variants={itemVariants} 
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5"
          >
             <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
               <span className="material-symbols-outlined text-red-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
             </div>
             <div>
               <h2 className="text-sm font-black text-white font-manrope leading-tight">Admin Kurator</h2>
               <p className="text-red-500 text-[10px] uppercase tracking-wider font-bold">HR SIGMA</p>
             </div>
          </motion.div>
        </div>
        
        {/* Navigation items */}
        <motion.nav 
          variants={navVariants}
          className="space-y-1.5 px-4 pb-12 flex-1 overflow-y-auto hide-scrollbar"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
               <motion.div 
                 variants={itemVariants} 
                 key={item.href}
                 whileHover={{ x: 4 }}
                 whileTap={{ scale: 0.98 }}
               >
                 <Link 
                   href={item.href} 
                   className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${isActive ? "bg-red-500/10 text-red-500 border-r-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.1)]" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} 
                   onClick={() => window.innerWidth < 1024 && onClose()}
                 >
                   <span className="material-symbols-outlined text-[22px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                   <span className="font-manrope text-sm font-semibold">{item.label}</span>
                 </Link>
               </motion.div>
            );
          })}
        </motion.nav>
      </motion.aside>

      {/* The Toggle Button (Placed outside but matches coordinates) */}
      <MenuToggle toggle={onToggle || onClose} isOpen={isOpen} />
    </div>
  );
}

