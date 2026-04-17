"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

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

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    },
    open: {
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.aside 
        initial={typeof window !== 'undefined' && window.innerWidth >= 1024 ? "open" : "closed"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 lg:top-16 bottom-0 z-[60] lg:z-40 w-72 bg-black shadow-[20px_0_40px_rgba(0,0,0,0.5)] lg:shadow-2xl rounded-r-2xl lg:rounded-none lg:rounded-br-2xl overflow-y-auto pt-8 lg:pt-8 flex flex-col ${!isOpen && 'lg:translate-x-0'}`}
      >
        <div className="px-8 mb-8 flex items-start justify-between">
          <motion.div variants={itemVariants} className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
               <span className="material-symbols-outlined text-red-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
             </div>
             <div>
               <h2 className="text-lg font-black text-red-600 font-manrope">Admin Kurator</h2>
               <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">HR SIGMA</p>
             </div>
          </motion.div>
          {/* Close button for Mobile only inside Sidebar */}
          <button className="lg:hidden text-slate-400 hover:text-white mt-1 cursor-pointer" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Navigation items */}
        <nav className="space-y-2 px-4 pb-20 lg:pb-8 flex-1 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
               <motion.div variants={itemVariants} key={item.href}>
                 <Link 
                   href={item.href} 
                   className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${isActive ? "bg-red-500/10 text-red-500 border-l-4 border-red-600 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 active:scale-95"}`} 
                   onClick={() => window.innerWidth < 1024 && onClose()}
                 >
                   <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                   <span className="font-manrope text-sm font-medium">{item.label}</span>
                 </Link>
               </motion.div>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
