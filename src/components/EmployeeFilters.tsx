"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function EmployeeFilters({ currentStatus }: { currentStatus?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const activeClass = "bg-primary text-on-primary";
  const idleClass = "bg-surface-container-highest text-on-surface hover:bg-surface-container-highest/80";

  return (
    <section className="mb-10 -mx-6">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-6 pb-2">
        <button 
          onClick={() => handleFilter("")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap active:scale-95 transition-all ${!currentStatus ? activeClass : idleClass}`}>
          Semua
        </button>
        <button 
          onClick={() => handleFilter("AKTIF")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap active:scale-95 transition-all ${currentStatus === "AKTIF" ? activeClass : idleClass}`}>
          Aktif
        </button>
        <button 
          onClick={() => handleFilter("NON_AKTIF")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap active:scale-95 transition-all ${currentStatus === "NON_AKTIF" ? activeClass : idleClass}`}>
          Non-Aktif
        </button>
      </div>
    </section>
  );
}
