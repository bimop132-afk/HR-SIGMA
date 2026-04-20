"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import DendaHeader from "@/components/DendaHeader";
import PenaltyStatsCard from "@/components/PenaltyStatsCard";
import PenaltyFilters from "@/components/PenaltyFilters";
import PenaltyList, { Penalty } from "@/components/PenaltyList";
import PenaltyModal from "@/components/PenaltyModal";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DendaPage() {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPenalties = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/penalties");
      const json = await res.json();
      if (json.success) {
        const formatted = json.data.map((p: any) => ({
          id: p.id,
          name: p.name.split(" ").slice(0, 2).map((n: string, i: number) => i === 1 ? n[0] + "." : n).join(" "),
          reason: p.alasan,
          amount: p.jumlah,
          date: format(new Date(p.tanggalDenda), "dd/MM/yy", { locale: id }),
          isLunas: p.status === "LUNAS"
        }));
        setPenalties(formatted);
      }
    } catch (e) {
      console.error("Failed to fetch penalties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  return (
    <AppLayout showBottomNav={true}>
      <div className="p-6 md:p-10 mb-10">
        <div className="max-w-md mx-auto space-y-8">
          <PenaltyModal onSuccess={fetchPenalties} />
          <DendaHeader />
          <PenaltyStatsCard />
          <PenaltyFilters />
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-surface-container-highest animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <PenaltyList data={penalties} />
          )}
          
          <div className="h-10"></div>
        </div>
      </div>
    </AppLayout>
  );
}
