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
      .select("*, employees(*, penalties(*), apd_items(*)), clearance_items(*)")
      .order("tanggal_resign", { ascending: false });

    if (start) query = query.gte("tanggal_resign", start);
    if (end) query = query.lte("tanggal_resign", end);

    const { data: rawData, error } = await query;
    if (error) throw error;

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const worksheetData = (rawData || []).map((r: any, idx) => {
      // Calculate Denda
      const totalPenalti = (r.employees?.penalties || []).reduce(
        (sum: number, p: any) => sum + (p.jumlah || 0), 0
      );
      
      // Calculate APD Deposit
      const uangJaminan = (r.employees?.apd_items || []).reduce(
        (sum: number, a: any) => sum + (a.depositAmount || a.deposit_amount || 0), 0
      );

      // Collect Keterangan (HILANG/KOTOR clearance info)
      const keteranganList = (r.clearance_items || [])
        .filter((c: any) => c.status === "HILANG" || c.status === "KOTOR")
        .map((c: any) => `${c.status} ${c.nama_item.toUpperCase()}`);
      
      const keterangan = keteranganList.length > 0 ? keteranganList.join(", ") : "-";

      return {
        "NO": idx + 1,
        "NIK": r.employees?.nik || "-",
        "NAMA KARYAWAN": r.employees?.nama_lengkap || "Unknown",
        "SEKTOR": r.employees?.sektor || "-",
        "REGU": r.employees?.regu || "-",
        "TANGGAL MASUK": r.employees?.tanggal_masuk || "-",
        "TANGGAL RESIGN": r.tanggal_resign || "-",
        "SIZE SEPATU": r.employees?.sepatu_size || "-",
        "UANG JAMINAN": uangJaminan > 0 ? formatter.format(uangJaminan) : "Rp -",
        "DENDA PENALTI": totalPenalti > 0 ? formatter.format(totalPenalti) : "Rp -",
        "EMAIL": r.employees?.email_aktif || "-",
        "STATUS": r.tipe ? `RESIGN ${r.tipe === 'NORMAL' ? '' : r.tipe}`.trim() : "RESIGN",
        "KETERANGAN": keterangan,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resign");

    worksheet["!cols"] = [
      { wch: 5 },  // NO
      { wch: 18 }, // NIK
      { wch: 25 }, // NAMA KARYAWAN
      { wch: 8 },  // SEKTOR
      { wch: 8 },  // REGU
      { wch: 15 }, // TANGGAL MASUK
      { wch: 15 }, // TANGGAL RESIGN
      { wch: 12 }, // SIZE SEPATU
      { wch: 16 }, // UANG JAMINAN
      { wch: 16 }, // DENDA PENALTI
      { wch: 25 }, // EMAIL
      { wch: 15 }, // STATUS
      { wch: 30 }, // KETERANGAN
    ];

    // Bold header row styling for Excel (using standard sheet manipulation)
    const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1:A1");
    for (let c = range.s.c; c <= range.e.c; ++c) {
      const cell = worksheet[XLSX.utils.encode_cell({r: 0, c: c})];
      if (cell) {
        cell.s = { font: { bold: true } };
      }
    }

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
