import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    // Fetch all employees and their related data
    let query = supabase
      .from("employees")
      .select(`
        *, 
        resignations(*, clearance_items(*)), 
        penalties(*), 
        deposit_installments(*)
      `)
      .order("created_at", { ascending: false });

    const { data: rawData, error } = await query;
    if (error) throw error;

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    let exportRows: any[] = [];
    
    (rawData || []).forEach((emp: any) => {
      // Filter relations logically by date if provided
      let validResignations = emp.resignations || [];
      let validPenalties = emp.penalties || [];

      if (start && end) {
        validResignations = validResignations.filter(
          (r: any) => r.tanggal_resign >= start && r.tanggal_resign <= end
        );
        validPenalties = validPenalties.filter(
          (p: any) => p.tanggal_denda >= start && p.tanggal_denda <= end
        );
      }

      // ONLY include if they have a relevant resignation OR penalty in this period
      if (validResignations.length === 0 && validPenalties.length === 0) return;

      const totalPenalti = validPenalties.reduce((sum: number, p: any) => sum + (p.jumlah || 0), 0);
      const uangJaminan = (emp.deposit_installments || []).reduce((sum: number, d: any) => sum + (d.jumlah || 0), 0);
      
      const latestResign = validResignations.length > 0 ? validResignations[0] : null;

      // Extract details
      const keteranganList = (latestResign?.clearance_items || [])
        .filter((c: any) => c.status === "HILANG" || c.status === "KOTOR")
        .map((c: any) => `${c.status} ${c.nama_item.toUpperCase()}`);
      
      let keterangan = keteranganList.length > 0 ? keteranganList.join(", ") : "";

      // If active employee but has penalties, state reasons briefly
      if (!latestResign && validPenalties.length > 0) {
        keterangan = validPenalties.map((p: any) => p.alasan).join(", ");
      }

      exportRows.push({
        "NO": 0, // dynamically set later
        "NIK": emp.nik || "-",
        "NAMA KARYAWAN": emp.nama_lengkap || "Unknown",
        "SEKTOR": emp.sektor || "-",
        "REGU": emp.regu || "-",
        "TANGGAL MASUK": emp.tanggal_masuk || "-",
        "TANGGAL RESIGN": latestResign?.tanggal_resign || "-",
        "SIZE SEPATU": emp.sepatu_size || "-",
        "UANG JAMINAN": uangJaminan > 0 ? formatter.format(uangJaminan) : "Rp -",
        "DENDA PENALTI": totalPenalti > 0 ? formatter.format(totalPenalti) : "Rp -",
        "EMAIL": emp.email_aktif || "-",
        "STATUS": latestResign ? `RESIGN ${latestResign.tipe === 'NORMAL' ? '' : latestResign.tipe}`.trim() : `AKTIF (DENDA)`,
        "KETERANGAN": keterangan || "-",
      });
    });

    // Re-index
    exportRows = exportRows.map((row, idx) => ({ ...row, "NO": idx + 1 }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resign_Denda");

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

    const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1:A1");
    for (let c = range.s.c; c <= range.e.c; ++c) {
      const cell = worksheet[XLSX.utils.encode_cell({r: 0, c: c})];
      if (cell) cell.s = { font: { bold: true } };
    }

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-resign-denda-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/resign error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
