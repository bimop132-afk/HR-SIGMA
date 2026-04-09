import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

// GET /api/export/apd — Export APD data to .xlsx
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("apd_items")
      .select("*, employees(nama_lengkap, nip)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const worksheetData = (data || []).map((item: any, idx) => ({
      No: idx + 1,
      NIP: item.employees?.nip,
      "Nama Karyawan": item.employees?.nama_lengkap,
      "Jenis APD": item.jenis_apd,
      Status: item.status,
      "Deposit (Rp)": item.deposit_amount,
      "Tanggal Pinjam": item.tanggal_pinjam,
      "Tanggal Kembali": item.tanggal_kembali || "-",
      Catatan: item.catatan || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "APD");

    worksheet["!cols"] = [
      { wch: 5 },  // No
      { wch: 12 }, // NIP
      { wch: 25 }, // Nama
      { wch: 12 }, // Jenis
      { wch: 15 }, // Status
      { wch: 12 }, // Deposit
      { wch: 14 }, // Tgl Pinjam
      { wch: 14 }, // Tgl Kembali
      { wch: 20 }, // Catatan
    ];

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-apd-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/apd error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
