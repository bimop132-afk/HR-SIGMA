"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopAppBarProps {
  onToggle?: () => void;
}

export default function TopAppBar({ onToggle }: TopAppBarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/40 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <div className="w-10 lg:hidden" /> {/* Spacer for the sidebar toggle on mobile */}
        <h1 className="font-manrope font-extrabold tracking-tight text-xl text-red-500 ml-8 lg:ml-10">HR SIGMA</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className={`${pathname === "/" ? "text-red-400" : "text-zinc-400 hover:text-red-400"} transition-colors cursor-pointer`}>Dashboard</Link>
          <Link href="/karyawan" className={`${pathname === "/karyawan" ? "text-red-400" : "text-zinc-400 hover:text-red-400"} transition-colors cursor-pointer`}>Karyawan</Link>
          <Link href="/offboarding" className={`${pathname === "/offboarding" ? "text-red-400" : "text-zinc-400 hover:text-red-400"} transition-colors cursor-pointer`}>Offboarding</Link>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-red-500/30">
          <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1rkGXCpJnLwhaoPbwyY995vca5KBdo--AufvqD7AxuhkXeIZykAYuXxnAZg5QjLqRQyd_SmeFqx3qSK3k1XRK1I9dDbvRT53DcauJiG5UPB0kiTEsaPRpd-DAtx5gxmAAINax2Xen1cTCJsZhBltaR7ulr-aZQgHRLSDZAeACbczJjMx3x8H-zFq8DBSu2L93gpsOeygVpjbBI7H7uME_qOPTvYsZ5PaFORJdOj1UY9Ko7OT_Wb0F1sZZWd8I_rzsNJXS8CcIxpIV" />
        </div>
      </div>
    </header>
  );
}
