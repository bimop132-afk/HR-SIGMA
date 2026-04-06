import { NextResponse } from "next/server";
import { db } from "@/db";
import { penalties, employees } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import * as XLSX from "xlsx";

// GET /api/export/penalties — Export penalties to .xlsx
export async function GET() {
  try {
    const data = await db
      .select({
        id: penalties.id,
        name: employees.namaLengkap,
        nip: employees.nip,
        alasan: penalties.alasan,
        jumlah: penalties.jumlah,
        status: penalties.status,
        tanggalDenda: penalties.tanggalDenda,
      })
      .from(penalties)
      .innerJoin(employees, eq(penalties.employeeId, employees.id))
      .orderBy(desc(penalties.createdAt));

    const worksheetData = data.map((item, idx) => ({
      No: idx + 1,
      NIP: item.nip,
      "Nama Karyawan": item.name,
      Alasan: item.alasan,
      "Jumlah (Rp)": item.jumlah,
      Status: item.status,
      "Tanggal Denda": item.tanggalDenda,
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
