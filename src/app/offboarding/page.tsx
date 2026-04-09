import AppLayout from "@/components/AppLayout";
import OffboardingHero from "@/components/OffboardingHero";
import OffboardingStatsGrid from "@/components/OffboardingStatsGrid";
import ResignHistoryTable from "@/components/ResignHistoryTable";
import ClearanceChecklistCard from "@/components/ClearanceChecklistCard";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

export default async function OffboardingPage() {
  const { data: rawResignations, error } = await supabase
    .from("resignations")
    .select("*, employees(nama_lengkap, nip)")
    .order("tanggal_resign", { ascending: false });

  if (error) {
    console.error("Fetch resignations error:", error);
  }

  const historyData = (rawResignations || []).map((r: any) => {
    const employeeName = r.employees?.nama_lengkap || "Unknown";
    return {
      id: r.id,
      employeeName,
      employeeNip: r.employees?.nip || "Unknown",
      date: r.tanggal_resign,
      type: r.tipe,
      statusClearance: r.status_clearance,
      initials: getInitials(employeeName),
      avatarColor: r.status_clearance === "SELESAI" ? "bg-surface-variant text-on-surface-variant" : "bg-primary-container text-on-primary-container"
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
