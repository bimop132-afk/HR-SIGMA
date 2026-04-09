import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let query = supabase
      .from("resignations")
      .select("*, employees(nip, nama_lengkap, posisi, sektor)")
      .order("tanggal_resign", { ascending: false });

    if (start) query = query.gte("tanggal_resign", start);
    if (end) query = query.lte("tanggal_resign", end);

    const { data: rawData, error } = await query;
    if (error) throw error;

    const worksheetData = (rawData || []).map((r: any, idx) => ({
      No: idx + 1,
      NIP: r.employees?.nip,
      "Nama Lengkap": r.employees?.nama_lengkap,
      Posisi: r.employees?.posisi,
      Sektor: r.employees?.sektor,
      Tipe: r.tipe,
      "Tanggal Resign": r.tanggal_resign,
      Alasan: r.alasan || "-",
      Clearance: r.status_clearance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resign");

    worksheet["!cols"] = [
      { wch: 5 }, { wch: 12 }, { wch: 25 }, { wch: 12 },
      { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 30 }, { wch: 12 }
    ];

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-resign-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/resign error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
