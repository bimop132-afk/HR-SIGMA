import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*, employees(nama_lengkap, foto_url, nip, posisi, sektor, status)")
      .order("upload_date", { ascending: false });

    if (error) throw error;

    const formattedData = data.map((d: any) => ({
      id: d.id,
      fileName: d.file_name,
      type: d.tipe,
      size: d.file_size,
      uploadDate: d.upload_date,
      filePath: d.file_path,
      ownerName: d.employees?.nama_lengkap,
      ownerAvatar: d.employees?.foto_url,
      nip: d.employees?.nip || "-",
      posisi: d.employees?.posisi || "-",
      sektor: d.employees?.sektor || "-",
      status: d.employees?.status || "Aktif",
      employeeId: d.employee_id
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
