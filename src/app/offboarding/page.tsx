import AppLayout from "@/components/AppLayout";
import OffboardingHero from "@/components/OffboardingHero";
import OffboardingStatsGrid from "@/components/OffboardingStatsGrid";
import ResignHistoryTable from "@/components/ResignHistoryTable";
import ClearanceChecklistCard from "@/components/ClearanceChecklistCard";
import { db } from "@/db";
import { resignations, employees } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

export default async function OffboardingPage() {
  const rawResignations = await db
    .select({
      id: resignations.id,
      date: resignations.tanggalResign,
      type: resignations.tipe,
      statusClearance: resignations.statusClearance,
      employee: {
        namaLengkap: employees.namaLengkap,
        nip: employees.nip,
      }
    })
    .from(resignations)
    .innerJoin(employees, eq(resignations.employeeId, employees.id))
    .orderBy(desc(resignations.tanggalResign));

  const historyData = rawResignations.map((r) => {
    return {
      id: r.id,
      employeeName: r.employee.namaLengkap,
      employeeNip: r.employee.nip,
      date: r.date,
      type: r.type,
      statusClearance: r.statusClearance,
      initials: getInitials(r.employee.namaLengkap),
      avatarColor: r.statusClearance === "SELESAI" ? "bg-surface-variant text-on-surface-variant" : "bg-primary-container text-on-primary-container"
    };
  });

  // Get the most recent pending resignation for the checklist card
  const activeResignation = historyData.find(r => r.statusClearance !== "SELESAI");

  return (
    <AppLayout>
      <div className="p-6 md:p-10 mb-20">
        <OffboardingHero />
        <OffboardingStatsGrid />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start mt-8">
          <ResignHistoryTable data={historyData} />
          {activeResignation ? (
            <ClearanceChecklistCard 
              name={activeResignation.employeeName} 
              status={activeResignation.statusClearance}
            />
          ) : (
             <div className="glass rounded-[2rem] p-8 border border-white/5 text-center text-on-surface-variant">
               Tidak ada proses clearance yang berjalan
             </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
