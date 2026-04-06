"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/",            icon: "home",          label: "Dashboard"  },
    { href: "/karyawan",    icon: "group",         label: "Karyawan"   },
    { href: "/onboarding",  icon: "person_add",    label: "Onboarding" },
    { href: "/offboarding", icon: "person_remove", label: "Resign"     },
    { href: "/denda",       icon: "gavel",         label: "Denda"      },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-black/90 backdrop-blur-lg border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] h-20 px-2 flex justify-around items-center rounded-t-3xl">
      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-150 px-3 py-1 rounded-xl ${
              isActive
                ? "bg-red-500/10 text-red-500"
                : "text-zinc-500 hover:text-red-400 active:scale-90"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {icon}
            </span>
            <span className="font-manrope text-[9px] uppercase tracking-widest">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
