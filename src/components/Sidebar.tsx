"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed left-0 top-0 lg:top-16 bottom-0 z-[60] lg:z-40 w-72 bg-black shadow-[20px_0_40px_rgba(0,0,0,0.5)] lg:shadow-2xl rounded-r-2xl lg:rounded-none lg:rounded-br-2xl overflow-y-auto pt-8 lg:pt-8 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-8 mb-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
               <span className="material-symbols-outlined text-red-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
             </div>
             <div>
               <h2 className="text-lg font-black text-red-600 font-manrope">Admin Kurator</h2>
               <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">HR SIGMA</p>
             </div>
          </div>
          {/* Close button for Mobile only inside Sidebar */}
          <button className="lg:hidden text-slate-400 hover:text-white mt-1 cursor-pointer" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Navigation items */}
        <nav className="space-y-2 px-4 pb-20 lg:pb-8">
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-manrope text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/karyawan" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/karyawan" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">group</span>
            <span className="font-manrope text-sm font-medium">Karyawan</span>
          </Link>
          <Link href="/onboarding" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/onboarding" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">person_add</span>
            <span className="font-manrope text-sm font-medium">Onboarding</span>
          </Link>
          <Link href="/offboarding" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/offboarding" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">person_remove</span>
            <span className="font-manrope text-sm font-medium">Resign</span>
          </Link>
          <Link href="/denda" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/denda" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">gavel</span>
            <span className="font-manrope text-sm font-medium">Denda & Pinalti</span>
          </Link>
          <Link href="/analitik" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/analitik" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-manrope text-sm font-medium">Analitik SDM</span>
          </Link>
          
          <Link href="/pengingat" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/pengingat" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">notifications</span>
            <span className="font-manrope text-sm font-medium">Pengingat</span>
          </Link>
          <Link href="/dokumen" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/dokumen" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">description</span>
            <span className="font-manrope text-sm font-medium">Dokumen</span>
          </Link>
          <Link href="/export" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group ${pathname === "/export" ? "bg-red-500/10 text-red-500 border-l-4 border-red-600" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"}`} onClick={() => window.innerWidth < 1024 && onClose()}>
            <span className="material-symbols-outlined">ios_share</span>
            <span className="font-manrope text-sm font-medium">Export Laporan</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
