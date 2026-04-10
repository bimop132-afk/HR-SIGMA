import AppLayout from "@/components/AppLayout";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import PlacementManager from "./PlacementManager";

export const dynamic = "force-dynamic";

export default async function PenempatanPage() {
  // Fetch employees with no sector or regu (newly onboarded)
  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .is("sektor", null)
    .eq("status", "AKTIF")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unassigned employees:", error);
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-on-surface">Manajemen Penempatan</h1>
          <p className="text-on-surface-variant">Tentukan Sektor dan Regu untuk karyawan baru yang belum memiliki penempatan.</p>
        </div>

        <PlacementManager initialEmployees={employees || []} />
      </div>
    </AppLayout>
  );
}
