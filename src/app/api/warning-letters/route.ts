import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { createWarningLetterSchema } from "@/lib/validators";

// GET /api/warning-letters — List SPs for an employee
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("warning_letters")
      .select("*")
      .eq("employee_id", parseInt(employeeId))
      .order("tanggal_terbit", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/warning-letters error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/warning-letters — Issue new SP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createWarningLetterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { data: newSp, error: spError } = await supabase
      .from("warning_letters")
      .insert({
        employee_id: parsed.data.employeeId,
        tipe: parsed.data.tipe,
        alasan: parsed.data.alasan,
        tanggal_terbit: parsed.data.tanggalTerbit,
        tanggal_berakhir: parsed.data.tanggalBerakhir,
        keterangan: parsed.data.keterangan,
      })
      .select()
      .single();

    if (spError) throw spError;

    // Get employee name for activity log
    const { data: emp, error: emError } = await supabase
      .from("employees")
      .select("nama_lengkap")
      .eq("id", parsed.data.employeeId)
      .single();

    // Log activity
    await supabase.from("activity_logs").insert({
      employee_id: parsed.data.employeeId,
      tipe_aktivitas: "WARNING_LETTER",
      deskripsi: `Surat Peringatan (${parsed.data.tipe.replace("_", " ")}) Diterbitkan`,
      detail: `${emp?.nama_lengkap || "Unknown"} — ${parsed.data.alasan}`,
    });

    return NextResponse.json(
      { success: true, data: newSp },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/warning-letters error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
