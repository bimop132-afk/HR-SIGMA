import AppLayout from "@/components/AppLayout";
import DendaHeader from "@/components/DendaHeader";
import PenaltyStatsCard from "@/components/PenaltyStatsCard";
import PenaltyFilters from "@/components/PenaltyFilters";
import PenaltyList from "@/components/PenaltyList";
import { db } from "@/db";
import { penalties, employees } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function DendaPage() {
  const rawPenalties = await db
    .select({
      id: penalties.id,
      amount: penalties.jumlah,
      reason: penalties.alasan,
      date: penalties.tanggalDenda,
      status: penalties.status,
      employee: {
        namaLengkap: employees.namaLengkap,
      }
    })
    .from(penalties)
    .innerJoin(employees, eq(penalties.employeeId, employees.id))
    .orderBy(desc(penalties.tanggalDenda));

  const formattedPenalties = rawPenalties.map(p => ({
    id: p.id,
    name: p.employee.namaLengkap.split(" ").slice(0, 2).map((n, i) => i === 1 ? n[0] + "." : n).join(" "),
    reason: p.reason,
    amount: p.amount,
    date: format(new Date(p.date), "dd/MM/yy", { locale: id }),
    isLunas: p.status === "LUNAS"
  }));

  return (
    <AppLayout showBottomNav={true}>
      <div className="p-6 md:p-10 mb-10">
        <div className="max-w-md mx-auto lg:mx-0 space-y-8">
          <DendaHeader />
          <PenaltyStatsCard />
          <PenaltyFilters />
          <PenaltyList data={formattedPenalties} />
          
          {/* Empty State/Bottom Spacer */}
          <div className="h-10"></div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 lg:bottom-10 right-6 liquid-light text-on-primary-fixed w-14 h-14 rounded-2xl shadow-2xl shadow-red-500/50 flex items-center justify-center active:scale-90 transition-transform duration-150 z-50 cursor-pointer hover:brightness-110">
        <span className="material-symbols-outlined font-bold text-3xl">add</span>
      </button>
    </AppLayout>
  );
}
