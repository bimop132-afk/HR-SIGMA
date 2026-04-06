import { NextResponse } from "next/server";
import { db } from "@/db";
import { apdItems, employees } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import * as XLSX from "xlsx";

// GET /api/export/apd — Export APD data to .xlsx
export async function GET() {
  try {
    const data = await db
      .select({
        id: apdItems.id,
        name: employees.namaLengkap,
        nip: employees.nip,
        jenisApd: apdItems.jenisApd,
        status: apdItems.status,
        depositAmount: apdItems.depositAmount,
        tanggalPinjam: apdItems.tanggalPinjam,
        tanggalKembali: apdItems.tanggalKembali,
        catatan: apdItems.catatan,
      })
      .from(apdItems)
      .innerJoin(employees, eq(apdItems.employeeId, employees.id))
      .orderBy(desc(apdItems.createdAt));

    const worksheetData = data.map((item, idx) => ({
      No: idx + 1,
      NIP: item.nip,
      "Nama Karyawan": item.name,
      "Jenis APD": item.jenisApd,
      Status: item.status,
      "Deposit (Rp)": item.depositAmount,
      "Tanggal Pinjam": item.tanggalPinjam,
      "Tanggal Kembali": item.tanggalKembali || "-",
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
