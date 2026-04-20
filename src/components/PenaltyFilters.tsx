"use client";
import { useState } from "react";
import MorphingTabs from "./ui/MorphingTabs";

export default function PenaltyFilters() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [selectedType, setSelectedType] = useState("Semua Tipe");

  return (
    <section className="flex flex-wrap gap-4 overflow-x-auto pb-2 hide-scrollbar">
      <MorphingTabs 
        tabs={["Semua Status", "Belum Bayar", "Lunas", "Cicilan"]}
        activeTab={selectedStatus}
        onTabChange={(tab) => setSelectedStatus(tab)}
      />

      <MorphingTabs 
        tabs={["Semua Tipe", "Denda Hilang", "Denda Rusak", "Lainnya"]}
        activeTab={selectedType}
        onTabChange={(tab) => setSelectedType(tab)}
      />

      <button className="bg-surface-container-highest flex items-center justify-center px-4 py-2 rounded-2xl text-secondary cursor-pointer hover:bg-white/10 transition-colors">
        <span className="material-symbols-outlined mr-2 text-[18px]">tune</span> Filter Lanjut
      </button>
    </section>
  );
}
