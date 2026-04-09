import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

// GET /api/export/resignations — Export resignations to .xlsx
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("resignations")
      .select("*, employees(nama_lengkap, nip)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const worksheetData = (data || []).map((item: any, idx) => ({
      No: idx + 1,
      NIP: item.employees?.nip,
      "Nama Karyawan": item.employees?.nama_lengkap,
      "Tipe Resign": item.tipe,
      "Tanggal Resign": item.tanggal_resign,
      Alasan: item.alasan || "-",
      "Status Clearance": item.status_clearance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resign");

    worksheet["!cols"] = [
      { wch: 5 },  // No
      { wch: 12 }, // NIP
      { wch: 25 }, // Nama
      { wch: 15 }, // Tipe
      { wch: 14 }, // Tanggal
      { wch: 25 }, // Alasan
      { wch: 15 }, // Status
    ];

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-resign-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/resignations error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
