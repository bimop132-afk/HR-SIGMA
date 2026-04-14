import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { format } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let query = supabase
      .from("activity_logs")
      .select("*, employees(nip, nik, nama_lengkap, posisi)")
      .order("created_at", { ascending: false });

    if (start) query = query.gte("created_at", `${start}T00:00:00`);
    if (end) query = query.lte("created_at", `${end}T23:59:59`);

    const { data: rawData, error } = await query;
    if (error) throw error;

    const worksheetData = (rawData || []).map((a: any, idx) => ({
      "NO": idx + 1,
      "WAKTU LOG": format(new Date(a.created_at), "dd-MM-yyyy HH:mm"),
      "TIPE AKTIVITAS": a.tipe_aktivitas,
      "NIK KARYAWAN": a.employees?.nik || "-",
      "NAMA KARYAWAN": a.employees?.nama_lengkap || "-",
      "POSISI": a.employees?.posisi || "-",
      "DESKRIPSI": a.deskripsi || "-",
      "DETAIL LENGKAP": a.detail || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analitik SDM");

    worksheet["!cols"] = [
      { wch: 5 },  // NO
      { wch: 20 }, // WAKTU LOG
      { wch: 20 }, // TIPE AKTIVITAS
      { wch: 18 }, // NIK KARYAWAN
      { wch: 25 }, // NAMA KARYAWAN
      { wch: 15 }, // POSISI
      { wch: 40 }, // DESKRIPSI
      { wch: 40 }, // DETAIL LENGKAP
    ];

    const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1:A1");
    for (let c = range.s.c; c <= range.e.c; ++c) {
      const cell = worksheet[XLSX.utils.encode_cell({r: 0, c: c})];
      if (cell) cell.s = { font: { bold: true } };
    }

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="analitik-sdm-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/analitik error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
