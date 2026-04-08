import AppLayout from "@/components/AppLayout";
import ContractCard from "@/components/pengingat/ContractCard";
import { db } from "@/db";
import { contracts, employees } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PengingatPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const params = await searchParams;
  const currentFilter = params?.filter || "all";
  const currentDate = new Date();
  
  // Fetch active contracts
  const rawContracts = await db
    .select({
      id: contracts.id,
      tanggalSelesai: contracts.tanggalSelesai,
      tipeKontrak: contracts.tipeKontrak,
      employee: {
        namaLengkap: employees.namaLengkap,
        nip: employees.nip,
        posisi: employees.posisi,
        sektor: employees.sektor,
      }
    })
    .from(contracts)
    .innerJoin(employees, eq(contracts.employeeId, employees.id))
    .where(eq(contracts.status, "AKTIF"))
    .orderBy(desc(contracts.tanggalSelesai));

  const contractData = rawContracts.map((c) => {
    // Calculate days left
    const endDate = new Date(c.tanggalSelesai);
    const diffTime = endDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let severity: "critical" | "warning" | "safe" = "safe";
    if (daysLeft <= 7) severity = "critical";
    else if (daysLeft <= 30) severity = "warning";

    return {
      name: c.employee.namaLengkap,
      nip: c.employee.nip,
      position: c.employee.posisi,
      department: `Sektor ${c.employee.sektor}`,
      daysLeft,
      severity,
      avatar: "", // Will fall back to initials if implemented this way, or we can use empty.
    };
  })
  .filter((c) => {
    if (currentFilter === "7") return c.daysLeft <= 7;
    if (currentFilter === "30") return c.daysLeft > 7 && c.daysLeft <= 30;
    if (currentFilter === "more") return c.daysLeft > 30;
    return true;
  })
  .sort((a, b) => a.daysLeft - b.daysLeft); // Sort by most urgent

  return (
    <AppLayout>
      <div className="p-6 md:p-10 mb-20 max-w-2xl mx-auto lg:mx-0 w-full">
        {/* Hero Header */}
        <div className="mb-8">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-2">🔔 Pengingat Kontrak</h2>
          <p className="font-body text-on-surface-variant text-sm">Monitor masa berlaku kontrak PKWT karyawan Anda secara real-time.</p>
        </div>
        
        {/* Filter Pills */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-8 pb-2">
          <Link href="/pengingat" className={`flex-shrink-0 px-4 py-2 rounded-full glass border text-sm font-medium transition-colors ${currentFilter === "all" ? "bg-red-500/10 border-red-500/30 text-red-500" : "border-outline/20 text-on-surface-variant hover:bg-outline/5"}`}>Semua</Link>
          
          <Link href="/pengingat?filter=7" className={`flex-shrink-0 px-4 py-2 rounded-full glass border text-sm font-medium flex items-center gap-2 transition-colors ${currentFilter === "7" ? "bg-error/10 border-error/40 text-error" : "border-error/20 text-error hover:bg-error/5"}`}>
            <span className="w-2 h-2 rounded-full bg-error"></span> &lt; 7 Hari
          </Link>
          
          <Link href="/pengingat?filter=30" className={`flex-shrink-0 px-4 py-2 rounded-full glass border text-sm font-medium flex items-center gap-2 transition-colors ${currentFilter === "30" ? "bg-secondary/10 border-secondary/40 text-secondary" : "border-secondary/20 text-secondary hover:bg-secondary/5"}`}>
            <span className="w-2 h-2 rounded-full bg-secondary"></span> &lt; 30 Hari
          </Link>
          
          <Link href="/pengingat?filter=more" className={`flex-shrink-0 px-4 py-2 rounded-full glass border text-sm font-medium flex items-center gap-2 transition-colors ${currentFilter === "more" ? "bg-tertiary/10 border-tertiary/40 text-tertiary" : "border-tertiary/20 text-tertiary hover:bg-tertiary/5"}`}>
            <span className="w-2 h-2 rounded-full bg-tertiary"></span> &gt; 30 Hari
          </Link>
        </div>
        
        {/* Employee List Grid */}
        <div className="space-y-6">
          {contractData.length === 0 && (
            <div className="text-center py-10 text-on-surface-variant">Belum ada kontrak yang aktif.</div>
          )}
          {contractData.map((contract, i) => (
            <ContractCard key={i} contract={contract} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
