import AppLayout from "@/components/AppLayout";
import EditorialHeadline from "@/components/EditorialHeadline";
import KPIBentoGrid from "@/components/KPIBentoGrid";
import TurnoverChartArea from "@/components/TurnoverChartArea";
import SectorDistributionArea from "@/components/SectorDistributionArea";
import RecentActivityFeed from "@/components/RecentActivityFeed";
import { db } from "@/db";
import { employees, contracts, resignations, activityLogs } from "@/db/schema";
import { eq, sql, and, gte, lt, desc } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function Home() {
  const currentDate = new Date();
  
  // 1. Total Aktif
  const activeEmployees = await db
    .select({ count: sql<number>`count(*)` })
    .from(employees)
    .where(eq(employees.status, "AKTIF"));

  const totalAktif = Number(activeEmployees[0]?.count || 0);

  // 2. Masuk Bulan Ini
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const newHires = await db
    .select({ count: sql<number>`count(*)` })
    .from(employees)
    .where(and(
      gte(employees.tanggalMasuk, startOfMonth.toISOString().slice(0, 10)),
      lt(employees.tanggalMasuk, endOfMonth.toISOString().slice(0, 10))
    ));
    
  const masukBulanIni = Number(newHires[0]?.count || 0);

  // 3. Resign Bulan Ini
  const resign = await db
    .select({ count: sql<number>`count(*)` })
    .from(resignations)
    .where(and(
      gte(resignations.tanggalResign, startOfMonth.toISOString().slice(0, 10)),
      lt(resignations.tanggalResign, endOfMonth.toISOString().slice(0, 10))
    ));

  const resignBulanIni = Number(resign[0]?.count || 0);

  // 4. Kontrak Habis (< 30 hari)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringContracts = await db
    .select({ count: sql<number>`count(*)` })
    .from(contracts)
    .where(and(
      eq(contracts.status, "AKTIF"),
      gte(contracts.tanggalSelesai, currentDate.toISOString().slice(0, 10)),
      lt(contracts.tanggalSelesai, thirtyDaysFromNow.toISOString().slice(0, 10))
    ));

  const kontrakHabis = Number(expiringContracts[0]?.count || 0);

  // 5. Activity Logs
  const rawLogs = await db
    .select({
      id: activityLogs.id,
      type: activityLogs.tipeAktivitas,
      desc: activityLogs.deskripsi,
      detail: activityLogs.detail,
      time: activityLogs.createdAt,
      employee: {
        namaLengkap: employees.namaLengkap,
      }
    })
    .from(activityLogs)
    .leftJoin(employees, eq(activityLogs.employeeId, employees.id))
    .orderBy(desc(activityLogs.createdAt))
    .limit(5);

  const formattedLogs = rawLogs.map(l => ({
    id: l.id,
    type: l.type,
    name: l.employee?.namaLengkap?.split(" ")[0] || "Sistem",
    desc: l.desc,
    timeAgo: formatDistanceToNow(new Date(l.time), { addSuffix: true, locale: id })
  }));

  return (
    <AppLayout>
      <div className="p-4 md:p-10 space-y-8 mb-20 overflow-x-hidden">
        <EditorialHeadline />
        <KPIBentoGrid stats={{
          totalAktif,
          masukBulanIni,
          resignBulanIni,
          kontrakHabis
        }} />
        <TurnoverChartArea />
        <SectorDistributionArea />
        <RecentActivityFeed activities={formattedLogs} />
      </div>
    </AppLayout>
  );
}
