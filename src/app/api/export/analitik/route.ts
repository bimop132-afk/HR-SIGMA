import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, employees } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import * as XLSX from "xlsx";
import { format } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    let conditions = [];
    if (start) conditions.push(sql`DATE(${activityLogs.createdAt}) >= ${start}`);
    if (end) conditions.push(sql`DATE(${activityLogs.createdAt}) <= ${end}`);

    const rawData = await db
      .select({
        id: activityLogs.id,
        tipeAktivitas: activityLogs.tipeAktivitas,
        deskripsi: activityLogs.deskripsi,
        detail: activityLogs.detail,
        createdAt: activityLogs.createdAt,
        employee: {
          nip: employees.nip,
          namaLengkap: employees.namaLengkap,
        }
      })
      .from(activityLogs)
      .leftJoin(employees, eq(activityLogs.employeeId, employees.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(activityLogs.createdAt));

    const worksheetData = rawData.map((a, idx) => ({
      No: idx + 1,
      Waktu: format(new Date(a.createdAt), "dd-MM-yyyy HH:mm"),
      "Tipe Aktivitas": a.tipeAktivitas,
      "NIP Karyawan": a.employee ? a.employee.nip : "-",
      "Nama Karyawan": a.employee ? a.employee.namaLengkap : "-",
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
