"use client";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

export default function OffboardingStatsGrid() {
  const [data, setData] = useState({
    totalResign: 0,
    phkCount: 0,
    pendingClearance: 0,
    selesaiClearance: 0,
    percentChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resignations/stats")
      .then(res => res.json())
      .then(body => {
        if (body.success) setData(body.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
    >
      <motion.div variants={item} className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between aspect-video md:aspect-auto">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-primary/10 rounded-xl">
            <span className="material-symbols-outlined text-primary">logout</span>
          </div>
          <span className="text-tertiary text-xs font-bold font-label">+{data.percentChange}% Bulan Ini</span>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Total Resign</p>
          {loading ? (
             <h3 className="h-10 w-16 bg-surface-container animate-pulse rounded"></h3>
          ) : (
             <h3 className="text-4xl font-headline font-extrabold text-on-surface">{data.totalResign}</h3>
          )}
        </div>
      </motion.div>
      
      <motion.div variants={item} className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-error/10 rounded-xl">
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">PHK / Darurat</p>
          {loading ? (
             <h3 className="h-10 w-16 bg-surface-container animate-pulse rounded"></h3>
          ) : (
             <h3 className="text-4xl font-headline font-extrabold text-on-surface">{data.phkCount}</h3>
          )}
        </div>
      </motion.div>
      
      <motion.div variants={item} className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <span className="material-symbols-outlined text-secondary">pending_actions</span>
          </div>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Menunggu Clearance</p>
          {loading ? (
             <h3 className="h-10 w-16 bg-surface-container animate-pulse rounded"></h3>
          ) : (
             <h3 className="text-4xl font-headline font-extrabold text-on-surface">{data.pendingClearance}</h3>
          )}
        </div>
      </motion.div>
      
      <motion.div variants={item} className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-tertiary/10 rounded-xl">
            <span className="material-symbols-outlined text-tertiary">task_alt</span>
          </div>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Selesai</p>
          {loading ? (
             <h3 className="h-10 w-16 bg-surface-container animate-pulse rounded"></h3>
          ) : (
             <h3 className="text-4xl font-headline font-extrabold text-on-surface">{data.selesaiClearance}</h3>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
