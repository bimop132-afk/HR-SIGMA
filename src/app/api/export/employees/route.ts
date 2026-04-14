import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const worksheetData = (data || []).map((emp: any, idx) => ({
      "NO": idx + 1,
      "NIK": emp.nik || "-",
      "NIP": emp.nip || "-",
      "NAMA KARYAWAN": emp.nama_lengkap || "-",
      "POSISI": emp.posisi || "-",
      "SEKTOR": emp.sektor || "-",
      "REGU": emp.regu || "-",
      "JALUR MASUK": emp.jalur_masuk || "-",
      "STATUS KERJA": emp.status || "-",
      "TANGGAL MASUK": emp.tanggal_masuk || "-",
      "TANGGAL KELUAR": emp.tanggal_keluar || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Karyawan");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 },  // NO
      { wch: 18 }, // NIK
      { wch: 12 }, // NIP
      { wch: 25 }, // NAMA KARYAWAN
      { wch: 15 }, // POSISI
      { wch: 8 },  // SEKTOR
      { wch: 8 },  // REGU
      { wch: 15 }, // JALUR MASUK
      { wch: 15 }, // STATUS KERJA
      { wch: 15 }, // TANGGAL MASUK
      { wch: 15 }, // TANGGAL KELUAR
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
        "Content-Disposition": `attachment; filename="data-karyawan-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/employees error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
