"use client";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AnimateWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="popLayout">
      <div key={pathname} className="w-full">
        {children}
      </div>
    </AnimatePresence>
  );
}
