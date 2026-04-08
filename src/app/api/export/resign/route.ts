import { NextResponse } from "next/server";
import { db } from "@/db";
import { resignations, employees } from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let conditions = [];
    if (start) conditions.push(gte(resignations.tanggalResign, start));
    if (end) conditions.push(lte(resignations.tanggalResign, end));

    const rawData = await db
      .select({
        id: resignations.id,
        tipe: resignations.tipe,
        tanggalResign: resignations.tanggalResign,
        alasan: resignations.alasan,
        statusClearance: resignations.statusClearance,
        employee: {
          nip: employees.nip,
          namaLengkap: employees.namaLengkap,
          posisi: employees.posisi,
          sektor: employees.sektor,
        }
      })
      .from(resignations)
      .innerJoin(employees, eq(resignations.employeeId, employees.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(resignations.tanggalResign));

    const worksheetData = rawData.map((r, idx) => ({
      No: idx + 1,
      NIP: r.employee.nip,
      "Nama Lengkap": r.employee.namaLengkap,
      Posisi: r.employee.posisi,
      Sektor: r.employee.sektor,
      Tipe: r.tipe,
      "Tanggal Resign": r.tanggalResign,
      Alasan: r.alasan || "-",
      Clearance: r.statusClearance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resign");

    worksheet["!cols"] = [
      { wch: 5 }, { wch: 12 }, { wch: 25 }, { wch: 12 },
      { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 30 }, { wch: 12 }
    ];

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
