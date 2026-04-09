import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

// GET /api/export/penalties — Export penalties to .xlsx
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("penalties")
      .select("*, employees(nama_lengkap, nip)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const worksheetData = (data || []).map((item: any, idx) => ({
      No: idx + 1,
      NIP: item.employees?.nip,
      "Nama Karyawan": item.employees?.nama_lengkap,
      Alasan: item.alasan,
      "Jumlah (Rp)": item.jumlah,
      Status: item.status,
      "Tanggal Denda": item.tanggal_denda,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Denda");

    worksheet["!cols"] = [
      { wch: 5 },  // No
      { wch: 12 }, // NIP
      { wch: 25 }, // Nama
      { wch: 20 }, // Alasan
      { wch: 15 }, // Jumlah
      { wch: 12 }, // Status
      { wch: 14 }, // Tanggal
    ];

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-denda-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/penalties error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
