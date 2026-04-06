import { NextResponse } from "next/server";
import { db } from "@/db";
import { resignations, employees } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import * as XLSX from "xlsx";

// GET /api/export/resignations — Export resignations to .xlsx
export async function GET() {
  try {
    const data = await db
      .select({
        id: resignations.id,
        name: employees.namaLengkap,
        nip: employees.nip,
        tipe: resignations.tipe,
        tanggalResign: resignations.tanggalResign,
        alasan: resignations.alasan,
        statusClearance: resignations.statusClearance,
      })
      .from(resignations)
      .innerJoin(employees, eq(resignations.employeeId, employees.id))
      .orderBy(desc(resignations.createdAt));

    const worksheetData = data.map((item, idx) => ({
      No: idx + 1,
      NIP: item.nip,
      "Nama Karyawan": item.name,
      "Tipe Resign": item.tipe,
      "Tanggal Resign": item.tanggalResign,
      Alasan: item.alasan || "-",
      "Status Clearance": item.statusClearance,
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
