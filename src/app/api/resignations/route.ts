import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { createResignationSchema } from "@/lib/validators";

// GET /api/resignations — List resignations
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("resignations")
      .select("*, employees(nama_lengkap, nip, foto_url)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedData = data.map((r: any) => ({
      id: r.id,
      employeeId: r.employee_id,
      name: r.employees?.nama_lengkap,
      nip: r.employees?.nip,
      fotoUrl: r.employees?.foto_url,
      tipe: r.tipe,
      tanggalResign: r.tanggal_resign,
      alasan: r.alasan,
      statusClearance: r.status_clearance,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET /api/resignations error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/resignations — Process a resignation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createResignationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Update employee status to NON_AKTIF
    const { data: emp, error: emError } = await supabase
      .from("employees")
      .update({
        status: "NON_AKTIF",
        tanggal_keluar: parsed.data.tanggalResign,
      })
      .eq("id", parsed.data.employeeId)
      .select()
      .single();

    if (emError || !emp) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Create resignation record
    const { data: newResignation, error: reError } = await supabase
      .from("resignations")
      .insert({
        employee_id: parsed.data.employeeId,
        tipe: parsed.data.tipe,
        tanggal_resign: parsed.data.tanggalResign,
        alasan: parsed.data.alasan,
        status_clearance: "PENDING",
      })
      .select("id")
      .single();

    if (reError) throw reError;

    // Create default clearance items
    const defaultClearanceItems = [
      {
        resignation_id: newResignation.id,
        nama_item: "Pengembalian ID Card",
        deskripsi: "Diserahkan ke Kantor",
      },
      {
        resignation_id: newResignation.id,
        nama_item: "Alat Pelindung Diri (APD)",
        deskripsi: "Seragam, Sepatu, Haircup, Apron",
      },
      {
        resignation_id: newResignation.id,
        nama_item: "Serah Terima Tugas",
        deskripsi: "Koordinasi dengan Tim",
      },
    ];

    await supabase.from("clearance_items").insert(defaultClearanceItems);

    // Log activity
    await supabase.from("activity_logs").insert({
      employee_id: parsed.data.employeeId,
      tipe_aktivitas: "OFFBOARDING",
      deskripsi: `${emp.nama_lengkap} Resign (${parsed.data.tipe})`,
      detail: `Tanggal: ${parsed.data.tanggalResign}`,
    });

    return NextResponse.json(
      { success: true, data: newResignation },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/resignations error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
