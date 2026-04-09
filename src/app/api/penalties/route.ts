import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { createPenaltySchema } from "@/lib/validators";

// GET /api/penalties — List penalties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bulan = searchParams.get("bulan"); // format: YYYY-MM
    const status = searchParams.get("status");

    let query = supabase
      .from("penalties")
      .select("*, employees(nama_lengkap, nip)")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (bulan) {
      const [year, month] = bulan.split("-").map(Number);
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = `${year}-${String(month).padStart(2, "0")}-31`;
      query = query.gte("tanggal_denda", startDate).lte("tanggal_denda", endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    const formattedData = data.map((p: any) => ({
      id: p.id,
      employeeId: p.employee_id,
      name: p.employees?.nama_lengkap,
      nip: p.employees?.nip,
      alasan: p.alasan,
      jumlah: p.jumlah,
      status: p.status,
      tanggalDenda: p.tanggal_denda,
      createdAt: p.created_at,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET /api/penalties error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/penalties — Create new penalty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createPenaltySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { data: newPenalty, error: peError } = await supabase
      .from("penalties")
      .insert({
        employee_id: parsed.data.employeeId,
        alasan: parsed.data.alasan,
        jumlah: parsed.data.jumlah,
        tanggal_denda: parsed.data.tanggalDenda,
      })
      .select()
      .single();

    if (peError) throw peError;

    // Get employee name for activity log
    const { data: emp, error: emError } = await supabase
      .from("employees")
      .select("nama_lengkap")
      .eq("id", parsed.data.employeeId)
      .single();

    // Log activity
    await supabase.from("activity_logs").insert({
      employee_id: parsed.data.employeeId,
      tipe_aktivitas: "PENALTY",
      deskripsi: `Pinalti Diterbitkan — ${emp?.nama_lengkap || "Unknown"}`,
      detail: `${parsed.data.alasan} • Rp ${parsed.data.jumlah.toLocaleString("id-ID")}`,
    });

    return NextResponse.json(
      { success: true, data: newPenalty },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/penalties error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
