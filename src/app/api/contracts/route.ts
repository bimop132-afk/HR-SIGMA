import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { createContractSchema } from "@/lib/validators";

// GET /api/contracts — List contracts with computed fields
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");
    const employeeId = searchParams.get("employeeId");

    let query = supabase
      .from("contracts")
      .select("*, employees(nama_lengkap, nip, posisi, sektor, foto_url)")
      .eq("status", "AKTIF")
      .order("tanggal_selesai", { ascending: true });

    if (employeeId) {
      query = query.eq("employee_id", parseInt(employeeId));
    }

    const { data, error } = await query;

    if (error) throw error;

    // Compute daysLeft and severity
    const now = new Date();
    const enriched = (data || []).map((c: any) => {
      const endDate = new Date(c.tanggal_selesai);
      const diffTime = endDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let contractSeverity: "critical" | "warning" | "safe";
      if (daysLeft <= 30) contractSeverity = "critical";
      else if (daysLeft <= 90) contractSeverity = "warning";
      else contractSeverity = "safe";

      return {
        id: c.id,
        employeeId: c.employee_id,
        employeeName: c.employees?.nama_lengkap,
        employeeNip: c.employees?.nip,
        position: c.employees?.posisi,
        sektor: c.employees?.sektor,
        tipeKontrak: c.tipe_kontrak,
        tanggalMulai: c.tanggal_mulai,
        tanggalSelesai: c.tanggal_selesai,
        status: c.status,
        fotoUrl: c.employees?.foto_url,
        daysLeft,
        severity: contractSeverity,
        department: c.employees?.sektor ? `Sektor ${c.employees.sektor}` : "Belum Penempatan",
        avatar: c.employees?.foto_url || "",
      };
    });

    // Filter by severity if specified
    const filtered = severity
      ? enriched.filter((c) => c.severity === severity)
      : enriched;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/contracts error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/contracts — Create new contract
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createContractSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { data: newContract, error } = await supabase
      .from("contracts")
      .insert({
        employee_id: parsed.data.employeeId,
        tipe_kontrak: parsed.data.tipeKontrak,
        tanggal_mulai: parsed.data.tanggalMulai,
        tanggal_selesai: parsed.data.tanggalSelesai,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: newContract },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contracts error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
