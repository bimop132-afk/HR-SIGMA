import AppLayout from "@/components/AppLayout";
import EmployeeSearch from "@/components/EmployeeSearch";
import EmployeeFilters from "@/components/EmployeeFilters";
import EmployeeCard from "@/components/EmployeeCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { calculateTenure } from "@/lib/utils";

function getInitials(name: string) {
  if (!name) return "??";
  return name.trim().split(/\s+/).map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

export const dynamic = "force-dynamic";

export default async function KaryawanPage({ searchParams }: { searchParams: Promise<{ search?: string, status?: string }> }) {
  const params = await searchParams;
  const search = params.search || "";
  const statusFilter = params.status || "";

  let query = supabase
    .from("employees")
    .select()
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`nama_lengkap.ilike.%${search}%,nip.ilike.%${search}%`);
  }
  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("KaryawanPage error:", error);
  }

  const formattedEmployees = (data || []).map(e => ({
    id: e.id,
    initials: getInitials(e.nama_lengkap),
    name: e.nama_lengkap,
    nip: e.nip,
    posisi: e.posisi,
    sektor: e.sektor ? `Sektor ${e.sektor}` : "Belum Penempatan",
    regu: e.regu ? `Regu ${e.regu}` : "-",
    status: e.status === "AKTIF" ? ("Aktif" as const) : ("Non-Aktif" as const),
    avatarColor: e.status === "AKTIF" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface-variant",
    statusBgClass: e.status === "AKTIF" ? "bg-tertiary-container/20 text-tertiary-fixed" : "bg-surface-variant/40 text-on-surface-variant",
    statusDotClass: e.status === "AKTIF" ? "bg-tertiary" : "bg-error-container",
    opacity: "",
    tenure: calculateTenure(e.tanggal_masuk, e.tanggal_keluar),
  }));

  return (
    <AppLayout>
      <div className="p-6 md:p-10 mb-20">
        <div className="max-w-3xl mx-auto lg:mx-0 w-full">
          <FloatingActionButton />
          <EmployeeSearch defaultValue={search} />
          <EmployeeFilters currentStatus={statusFilter} />
          
          <section className="space-y-6 mt-6">
            {formattedEmployees.length === 0 && (
              <div className="text-center py-10 text-on-surface-variant">Tidak ada karyawan yang ditemukan.</div>
            )}
            {formattedEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
