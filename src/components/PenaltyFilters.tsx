"use client";
import { useState } from "react";

export default function PenaltyFilters() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [selectedType, setSelectedType] = useState("Semua Tipe");

  return (
    <section className="flex gap-3 overflow-visible pb-2 hide-scrollbar relative">
      {/* Container need to be overflow visible for dropdowns */}
      <div className="relative">
        <button 
          onClick={() => setOpenFilter(openFilter === "status" ? null : "status")}
          className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer z-10"
        >
          {selectedStatus}
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </button>
        {openFilter === "status" && (
          <div className="absolute top-12 left-0 w-48 bg-surface-container-highest backdrop-blur-2xl rounded-2xl border border-white/10 p-2 shadow-2xl shadow-black/80 z-50">
            {["Semua Status", "Belum Bayar", "Lunas", "Cicilan"].map(opt => (
              <button 
                key={opt}
                onClick={() => { setSelectedStatus(opt); setOpenFilter(null); }}
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button 
          onClick={() => setOpenFilter(openFilter === "type" ? null : "type")}
          className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer z-10"
        >
          {selectedType}
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </button>
        {openFilter === "type" && (
          <div className="absolute top-12 left-0 w-48 bg-surface-container-highest backdrop-blur-2xl rounded-2xl border border-white/10 p-2 shadow-2xl shadow-black/80 z-50">
            {["Semua Tipe", "Denda Hilang", "Denda Rusak", "Lainnya"].map(opt => (
              <button 
                key={opt}
                onClick={() => { setSelectedType(opt); setOpenFilter(null); }}
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="bg-surface-container-highest/50 flex items-center justify-center p-2.5 rounded-full text-secondary cursor-pointer hover:bg-surface-container-highest transition-colors">
        <span className="material-symbols-outlined">tune</span>
      </button>

      {/* Click outside to close */}
      {openFilter && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenFilter(null)}></div>
      )}
    </section>
  );
}
