import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { createApdSchema } from "@/lib/validators";

// GET /api/apd — List APD items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const jenis = searchParams.get("jenis");

    let query = supabase
      .from("apd_items")
      .select("*, employees(nama_lengkap, nip)")
      .order("created_at", { ascending: false });

    if (employeeId) query = query.eq("employee_id", parseInt(employeeId));
    if (status) query = query.eq("status", status);
    if (jenis) query = query.eq("jenis_apd", jenis);

    const { data, error } = await query;

    if (error) throw error;

    const formattedData = (data || []).map((a: any) => ({
      id: a.id,
      employeeId: a.employee_id,
      name: a.employees?.nama_lengkap,
      nip: a.employees?.nip,
      jenisApd: a.jenis_apd,
      status: a.status,
      depositAmount: a.deposit_amount,
      tanggalPinjam: a.tanggal_pinjam,
      tanggalKembali: a.tanggal_kembali,
      catatan: a.catatan,
      createdAt: a.created_at,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET /api/apd error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/apd — Create new APD loan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createApdSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { data: newApd, error } = await supabase
      .from("apd_items")
      .insert({
        employee_id: parsed.data.employeeId,
        jenis_apd: parsed.data.jenisApd,
        deposit_amount: parsed.data.depositAmount,
        tanggal_pinjam: parsed.data.tanggalPinjam,
        catatan: parsed.data.catatan,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: newApd },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/apd error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
