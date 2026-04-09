import AppLayout from "@/components/AppLayout";
import EditorialHeadline from "@/components/EditorialHeadline";
import KPIBentoGrid from "@/components/KPIBentoGrid";
import TurnoverChartArea from "@/components/TurnoverChartArea";
import SectorDistributionArea from "@/components/SectorDistributionArea";
import RecentActivityFeed from "@/components/RecentActivityFeed";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function Home() {
  const currentDate = new Date();
  
  // 1. Calculations for date ranges
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().slice(0, 10);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().slice(0, 10);
  const today = currentDate.toISOString().slice(0, 10);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const thirtyDaysStr = thirtyDaysFromNow.toISOString().slice(0, 10);

  // Parallel fetching of all dashboard metrics
  const [
    { count: totalAktif },
    { count: masukBulanIni },
    { count: resignBulanIni },
    { count: kontrakHabis },
    { data: rawLogs }
  ] = await Promise.all([
    supabase.from("employees").select("*", { count: "exact", head: true }).eq("status", "AKTIF"),
    supabase.from("employees").select("*", { count: "exact", head: true }).gte("tanggal_masuk", startOfMonth).lte("tanggal_masuk", endOfMonth),
    supabase.from("resignations").select("*", { count: "exact", head: true }).gte("tanggal_resign", startOfMonth).lte("tanggal_resign", endOfMonth),
    supabase.from("contracts").select("*", { count: "exact", head: true }).eq("status", "AKTIF").gte("tanggal_selesai", today).lt("tanggal_selesai", thirtyDaysStr),
    supabase.from("activity_logs").select("*, employees(nama_lengkap)").order("created_at", { ascending: false }).limit(5)
  ]);

  const formattedLogs = (rawLogs || []).map(l => ({
    id: l.id,
    type: l.tipe_aktivitas,
    name: (l.employees as any)?.nama_lengkap?.split(" ")[0] || "Sistem",
    desc: l.deskripsi,
    timeAgo: formatDistanceToNow(new Date(l.created_at), { addSuffix: true, locale: id })
  }));

  return (
    <AppLayout>
      <div className="p-4 md:p-10 space-y-8 mb-20 overflow-x-hidden">
        <EditorialHeadline />
        <KPIBentoGrid stats={{
          totalAktif: totalAktif || 0,
          masukBulanIni: masukBulanIni || 0,
          resignBulanIni: resignBulanIni || 0,
          kontrakHabis: kontrakHabis || 0
        }} />
        <TurnoverChartArea />
        <SectorDistributionArea />
        <RecentActivityFeed activities={formattedLogs} />
      </div>
    </AppLayout>
  );
}
