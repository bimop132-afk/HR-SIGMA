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
      .select("*, employees(nip, nik, nama_lengkap, posisi, sektor, regu)")
      .order("tanggal_denda", { ascending: false });

    if (start) query = query.gte("tanggal_denda", start);
    if (end) query = query.lte("tanggal_denda", end);

    const { data: rawData, error } = await query;
    if (error) throw error;

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const worksheetData = (rawData || []).map((p: any, idx) => ({
      "NO": idx + 1,
      "NIK": p.employees?.nik || "-",
      "NAMA KARYAWAN": p.employees?.nama_lengkap || "-",
      "SEKTOR": p.employees?.sektor || "-",
      "REGU": p.employees?.regu || "-",
      "TANGGAL DENDA": p.tanggal_denda || "-",
      "ALASAN DENDA": p.alasan || "-",
      "NOMINAL (Rp)": p.jumlah ? formatter.format(p.jumlah) : "Rp -",
      "STATUS PEMBAYARAN": p.status || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Denda");

    worksheet["!cols"] = [
      { wch: 5 },  // NO
      { wch: 18 }, // NIK
      { wch: 25 }, // NAMA KARYAWAN
      { wch: 8 },  // SEKTOR
      { wch: 8 },  // REGU
      { wch: 15 }, // TANGGAL DENDA
      { wch: 30 }, // ALASAN DENDA
      { wch: 18 }, // NOMINAL (Rp)
      { wch: 20 }, // STATUS PEMBAYARAN
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
        "Content-Disposition": `attachment; filename="data-denda-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/denda error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
