import { NextResponse } from "next/server";
import { db } from "@/db";
import { penalties, employees } from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let conditions = [];
    if (start) conditions.push(gte(penalties.tanggalDenda, start));
    if (end) conditions.push(lte(penalties.tanggalDenda, end));

    const rawData = await db
      .select({
        id: penalties.id,
        jumlah: penalties.jumlah,
        tanggalDenda: penalties.tanggalDenda,
        alasan: penalties.alasan,
        status: penalties.status,
        employee: {
          nip: employees.nip,
          namaLengkap: employees.namaLengkap,
          posisi: employees.posisi,
          sektor: employees.sektor,
        }
      })
      .from(penalties)
      .innerJoin(employees, eq(penalties.employeeId, employees.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(penalties.tanggalDenda));

    const worksheetData = rawData.map((p, idx) => ({
      No: idx + 1,
      NIP: p.employee.nip,
      "Nama Lengkap": p.employee.namaLengkap,
      Posisi: p.employee.posisi,
      Sektor: p.employee.sektor,
      "Tanggal Denda": p.tanggalDenda,
      Jumlah: p.jumlah,
      Alasan: p.alasan,
      Status: p.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Denda");

    worksheet["!cols"] = [
      { wch: 5 }, { wch: 12 }, { wch: 25 }, { wch: 12 },
      { wch: 8 }, { wch: 14 }, { wch: 15 }, { wch: 30 }, { wch: 12 }
    ];

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-denda-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/denda error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
