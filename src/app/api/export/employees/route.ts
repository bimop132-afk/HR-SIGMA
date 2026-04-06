import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { desc } from "drizzle-orm";
import * as XLSX from "xlsx";

// GET /api/export/employees — Export employees to .xlsx
export async function GET() {
  try {
    const data = await db
      .select()
      .from(employees)
      .orderBy(desc(employees.createdAt));

    const worksheetData = data.map((emp, idx) => ({
      No: idx + 1,
      NIP: emp.nip,
      "Nama Lengkap": emp.namaLengkap,
      NIK: emp.nik,
      "Jalur Masuk": emp.jalurMasuk,
      Posisi: emp.posisi,
      Sektor: emp.sektor,
      Regu: emp.regu,
      Status: emp.status,
      "Tanggal Masuk": emp.tanggalMasuk,
      "Tanggal Keluar": emp.tanggalKeluar || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Karyawan");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 },  // No
      { wch: 12 }, // NIP
      { wch: 25 }, // Nama
      { wch: 18 }, // NIK
      { wch: 10 }, // Jalur
      { wch: 12 }, // Posisi
      { wch: 8 },  // Sektor
      { wch: 6 },  // Regu
      { wch: 10 }, // Status
      { wch: 14 }, // Tgl Masuk
      { wch: 14 }, // Tgl Keluar
    ];

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
