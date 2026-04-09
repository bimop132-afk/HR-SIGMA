import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

// GET /api/dashboard/activity — Recent activity feed
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*, employees(nama_lengkap)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    const formattedData = (data || []).map((l: any) => ({
      id: l.id,
      employeeId: l.employee_id,
      employeeName: l.employees?.nama_lengkap,
      tipeAktivitas: l.tipe_aktivitas,
      deskripsi: l.deskripsi,
      detail: l.detail,
      createdAt: l.created_at,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET /api/dashboard/activity error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
