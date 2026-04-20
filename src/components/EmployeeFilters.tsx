"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import MorphingTabs from "./ui/MorphingTabs";

export default function EmployeeFilters({ currentStatus }: { currentStatus?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilter = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    let dbStatus = "";
    if (tabName === "Aktif") dbStatus = "AKTIF";
    if (tabName === "Non-Aktif") dbStatus = "NON_AKTIF";

    if (dbStatus) {
      params.set("status", dbStatus);
    } else {
      params.delete("status");
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  let derivedTab = "Semua";
  if (currentStatus === "AKTIF") derivedTab = "Aktif";
  if (currentStatus === "NON_AKTIF") derivedTab = "Non-Aktif";

  const [optimisticTab, setOptimisticTab] = useState(derivedTab);

  useEffect(() => {
    setOptimisticTab(derivedTab);
  }, [derivedTab]);

  const handleFilterOptimistic = (tabName: string) => {
    setOptimisticTab(tabName);
    handleFilter(tabName);
  };

  return (
    <section className="mb-10 -mx-6">
      <div className={`flex gap-3 overflow-x-auto hide-scrollbar px-6 pb-2 transition-opacity duration-300 ${isPending ? "opacity-70 pointer-events-none" : "opacity-100"}`}>
        <MorphingTabs 
          tabs={["Semua", "Aktif", "Non-Aktif"]}
          activeTab={optimisticTab}
          onTabChange={handleFilterOptimistic}
        />
      </div>
    </section>
  );
}
