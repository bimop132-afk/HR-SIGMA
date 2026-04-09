import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { updateEmployeeSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// GET /api/employees/:id
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { data: employee, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error || !employee) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    console.error("GET /api/employees/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/employees/:id
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Map camelCase to snake_case
    const updateData: any = {};
    if (parsed.data.namaLengkap) updateData.nama_lengkap = parsed.data.namaLengkap;
    if (parsed.data.nik) updateData.nik = parsed.data.nik;
    if (parsed.data.nip) updateData.nip = parsed.data.nip;
    if (parsed.data.jalurMasuk) updateData.jalur_masuk = parsed.data.jalurMasuk;
    if (parsed.data.posisi) updateData.posisi = parsed.data.posisi;
    if (parsed.data.sektor) updateData.sektor = parsed.data.sektor;
    if (parsed.data.regu) updateData.regu = parsed.data.regu;
    if (parsed.data.status) updateData.status = parsed.data.status;
    if (parsed.data.tanggalMasuk) updateData.tanggal_masuk = parsed.data.tanggalMasuk;
    if (parsed.data.tanggalKeluar) updateData.tanggal_keluar = parsed.data.tanggalKeluar;
    if (parsed.data.nomorBpjs) updateData.nomor_bpjs = parsed.data.nomorBpjs;
    if (parsed.data.fotoUrl) updateData.foto_url = parsed.data.fotoUrl;

    const { data: updated, error } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/employees/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/:id (soft delete)
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { data: updated, error } = await supabase
      .from("employees")
      .update({ status: "NON_AKTIF" })
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("DELETE /api/employees/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
