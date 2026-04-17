"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Employee = {
  id: number;
  initials: string;
  name: string;
  nip: string;
  posisi: string;
  sektor: string;
  regu: string;
  status: "Aktif" | "Non-Aktif";
  avatarColor: string;
  opacity?: string;
  statusBgClass: string;
  statusDotClass: string;
  tenure?: string;
};

export default function EmployeeCard({ employee }: { employee: Employee }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={`block glass-card rounded-2xl p-5 border border-white/5 relative overflow-visible group ${employee.opacity || ""} hover:bg-white/5 transition-all duration-300`}>
      {/* Clickable Area for Link */}
      <Link href={`/karyawan/${employee.id}`} className="absolute inset-0 z-0"></Link>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex gap-4 pointer-events-none">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${employee.avatarColor}`}>
            {employee.initials}
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">{employee.name}</h3>
            <p className="text-sm text-on-surface-variant font-medium">NIP {employee.nip}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90 relative z-20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-outline">more_vert</span>
          </button>
          
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}></div>
              <div className="absolute right-0 top-12 w-48 bg-surface-container-highest backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 py-2 z-40 flex flex-col text-left animate-pop-in">
                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); router.push(`/karyawan/${employee.id}`); }}
                  className="px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5 text-on-surface flex items-center gap-3 text-left w-full cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span> Lihat Profil
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); router.push(`/karyawan/${employee.id}/edit`); }}
                  className="px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5 text-on-surface flex items-center gap-3 text-left w-full cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span> Edit Data
                </button>
                <div className="h-px w-full bg-white/10 my-1"></div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                  className="px-5 py-3 text-sm font-medium transition-colors hover:bg-error/10 text-error flex items-center gap-3 text-left w-full cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span> Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 mb-4 relative z-10 pointer-events-none">
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Posisi</p>
          <p className="text-sm font-semibold text-secondary">{employee.posisi}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Sektor</p>
          <p className="text-sm font-semibold text-on-surface">{employee.sektor}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Regu</p>
          <p className="text-sm font-semibold text-on-surface">{employee.regu}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Status</p>
          <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${employee.statusBgClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${employee.statusDotClass}`}></span>
            {employee.status}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Lama Bekerja</p>
          <p className="text-sm font-semibold text-primary">{employee.tenure || "-"}</p>
        </div>
      </div>
    </div>
  );
}
