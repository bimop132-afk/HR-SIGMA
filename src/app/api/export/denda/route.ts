import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let query = supabase
      .from("penalties")
      .select("*, employees(nip, nama_lengkap, posisi, sektor)")
      .order("tanggal_denda", { ascending: false });

    if (start) query = query.gte("tanggal_denda", start);
    if (end) query = query.lte("tanggal_denda", end);

    const { data: rawData, error } = await query;
    if (error) throw error;

    const worksheetData = (rawData || []).map((p: any, idx) => ({
      No: idx + 1,
      NIP: p.employees?.nip,
      "Nama Lengkap": p.employees?.nama_lengkap,
      Posisi: p.employees?.posisi,
      Sektor: p.employees?.sektor,
      "Tanggal Denda": p.tanggal_denda,
      Jumlah: p.jumlah,
      Alasan: p.alasan,
      Status: p.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Denda");

    worksheet["!cols"] = [
      { wch: 5 }, { wch: 12 }, { wch: 25 }, { wch: 12 },
      { wch: 8 }, { wch: 14 }, { wch: 15 }, { wch: 30 }, { wch: 12 }
    ];

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-denda-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/denda error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
