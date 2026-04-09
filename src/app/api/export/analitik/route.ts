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
      .select("*, employees(nip, nama_lengkap)")
      .order("created_at", { ascending: false });

    if (start) query = query.gte("created_at", `${start}T00:00:00`);
    if (end) query = query.lte("created_at", `${end}T23:59:59`);

    const { data: rawData, error } = await query;
    if (error) throw error;

    const worksheetData = (rawData || []).map((a: any, idx) => ({
      No: idx + 1,
      Waktu: format(new Date(a.created_at), "dd-MM-yyyy HH:mm"),
      "Tipe Aktivitas": a.tipe_aktivitas,
      "NIP Karyawan": a.employees ? a.employees.nip : "-",
      "Nama Karyawan": a.employees ? a.employees.nama_lengkap : "-",
      Deskripsi: a.deskripsi,
      Detail: a.detail || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aktivitas SDM");

    worksheet["!cols"] = [
      { wch: 5 }, { wch: 20 }, { wch: 18 }, { wch: 15 },
      { wch: 25 }, { wch: 40 }, { wch: 30 }
    ];

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
