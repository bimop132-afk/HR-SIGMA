import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { createEmployeeSchema } from "@/lib/validators";
import { generateNIP } from "@/lib/nip-generator";

// GET /api/employees — List employees with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sektor = searchParams.get("sektor");
    const posisi = searchParams.get("posisi");
    const regu = searchParams.get("regu");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("employees")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (sektor) query = query.eq("sektor", parseInt(sektor));
    if (posisi) query = query.eq("posisi", posisi);
    if (regu) query = query.eq("regu", parseInt(regu));
    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(`nama_lengkap.ilike.%${search}%,nip.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total: count,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/employees — Create new employee (onboarding)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { tanggalMasuk, jalurMasuk, nip: manualNip, ...rest } = parsed.data;
    const tanggalMasukDate = new Date(tanggalMasuk);

    // Auto-generate NIP only if manualNip is not provided
    const finalNip = manualNip ? manualNip : await generateNIP(tanggalMasukDate, jalurMasuk);

    // Insert employee
    const { data: newEmployee, error: emError } = await supabase
      .from("employees")
      .insert({
        nip: finalNip,
        jalur_masuk: jalurMasuk,
        tanggal_masuk: tanggalMasuk,
        nomor_bpjs: rest.nomorBpjs,
        nik: rest.nik,
        nama_lengkap: rest.namaLengkap,
        posisi: rest.posisi,
        sektor: rest.sektor,
        regu: rest.regu,
        foto_url: rest.fotoUrl,
        
        // New Fields
        jenis_kelamin: rest.jenisKelamin,
        tempat_lahir: rest.tempatLahir,
        tanggal_lahir: rest.tanggalLahir,
        alamat_lengkap: rest.alamatLengkap,
        no_hp: rest.noHp,
        email_aktif: rest.emailAktif,
        no_kk: rest.noKk,
        nama_ibu_kandung: rest.namaIbuKandung,
        rt: rest.rt,
        rw: rest.rw,
        kelurahan: rest.kelurahan,
        kecamatan: rest.kecamatan,
        kabupaten: rest.kabupaten,
        masa_laku_identitas: rest.masaLakuIdentitas,
        golongan_darah: rest.golonganDarah,
        seragam_size: rest.seragamSize,
        sepatu_size: rest.sepatuSize,
        foto_ktp_url: rest.fotoKtpUrl,
        foto_kk_url: rest.fotoKkUrl,
        foto_ijazah_url: rest.fotoIjazahUrl,
      })
      .select()
      .single();

    if (emError) throw emError;

    // Create first contract (PKWT_1, 1 year duration)
    const kontrakSelesai = new Date(tanggalMasukDate);
    kontrakSelesai.setFullYear(kontrakSelesai.getFullYear() + 1);

    const { error: coError } = await supabase
      .from("contracts")
      .insert({
        employee_id: newEmployee.id,
        tipe_kontrak: "PKWT_1",
        tanggal_mulai: tanggalMasuk,
        tanggal_selesai: kontrakSelesai.toISOString().split("T")[0],
      });

    if (coError) throw coError;

    // Log activity
    await supabase.from("activity_logs").insert({
      employee_id: newEmployee.id,
      tipe_aktivitas: "ONBOARDING",
      deskripsi: `${newEmployee.nama_lengkap} Onboarded`,
      detail: `Sektor ${newEmployee.sektor} • ${jalurMasuk}`,
    });

    return NextResponse.json(
      { success: true, data: newEmployee },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
