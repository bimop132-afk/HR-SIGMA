import AppLayout from "@/components/AppLayout";
import EmployeeSearch from "@/components/EmployeeSearch";
import EmployeeFilters from "@/components/EmployeeFilters";
import EmployeeCard from "@/components/EmployeeCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { desc, ilike, eq, and } from "drizzle-orm";

function getInitials(name: string) {
  if (!name) return "??";
  return name.trim().split(/\s+/).map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

export const dynamic = "force-dynamic";

export default async function KaryawanPage({ searchParams }: { searchParams: { search?: string, status?: string } }) {
  const search = searchParams.search || "";
  const statusFilter = searchParams.status || "";

  let conditions = [];
  if (search) {
    conditions.push(ilike(employees.namaLengkap, `%${search}%`));
  }
  if (statusFilter) {
    conditions.push(eq(employees.status, statusFilter));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const data = await db
    .select()
    .from(employees)
    .where(whereClause)
    .orderBy(desc(employees.createdAt));

  const formattedEmployees = data.map(e => ({
    id: e.id,
    initials: getInitials(e.namaLengkap),
    name: e.namaLengkap,
    nip: e.nip,
    posisi: e.posisi,
    sektor: `Sektor ${e.sektor}`,
    regu: `Regu ${e.regu}`,
    status: e.status === "AKTIF" ? ("Aktif" as const) : ("Non-Aktif" as const),
    avatarColor: e.status === "AKTIF" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface-variant",
    statusBgClass: e.status === "AKTIF" ? "bg-tertiary-container/20 text-tertiary-fixed" : "bg-surface-variant/40 text-on-surface-variant",
    statusDotClass: e.status === "AKTIF" ? "bg-tertiary" : "bg-error-container",
    opacity: e.status === "AKTIF" ? "" : "opacity-80",
  }));

  return (
    <AppLayout>
      <div className="p-6 md:p-10 mb-20">
        <div className="max-w-3xl mx-auto lg:mx-0 w-full">
          <EmployeeSearch defaultValue={search} />
          <EmployeeFilters currentStatus={statusFilter} />
          
          <section className="space-y-6 mt-6">
            {formattedEmployees.length === 0 && (
              <div className="text-center py-10 text-on-surface-variant">Tidak ada karyawan yang ditemukan.</div>
            )}
            {formattedEmployees.map((employee, idx) => (
              <EmployeeCard key={idx} employee={employee} />
            ))}
          </section>
        </div>
      </div>
      <FloatingActionButton />
    </AppLayout>
  );
}
