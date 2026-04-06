import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  resignations,
  employees,
  clearanceItems,
  activityLogs,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createResignationSchema } from "@/lib/validators";

// GET /api/resignations — List resignations
export async function GET() {
  try {
    const data = await db
      .select({
        id: resignations.id,
        employeeId: resignations.employeeId,
        name: employees.namaLengkap,
        nip: employees.nip,
        fotoUrl: employees.fotoUrl,
        tipe: resignations.tipe,
        tanggalResign: resignations.tanggalResign,
        alasan: resignations.alasan,
        statusClearance: resignations.statusClearance,
        createdAt: resignations.createdAt,
      })
      .from(resignations)
      .innerJoin(employees, eq(resignations.employeeId, employees.id))
      .orderBy(desc(resignations.createdAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/resignations error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/resignations — Process a resignation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createResignationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Update employee status to NON_AKTIF
    const [emp] = await db
      .update(employees)
      .set({
        status: "NON_AKTIF",
        tanggalKeluar: parsed.data.tanggalResign,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, parsed.data.employeeId))
      .returning();

    if (!emp) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Create resignation record
    const [newResignation] = await db
      .insert(resignations)
      .values({
        ...parsed.data,
        statusClearance: "PENDING",
      })
      .returning({ id: resignations.id });

    // Create default clearance items
    const defaultClearanceItems = [
      {
        resignationId: newResignation.id,
        namaItem: "Pengembalian ID Card",
        deskripsi: "Diserahkan ke Kantor",
      },
      {
        resignationId: newResignation.id,
        namaItem: "Alat Pelindung Diri (APD)",
        deskripsi: "Seragam, Sepatu, Haircup, Apron",
      },
      {
        resignationId: newResignation.id,
        namaItem: "Serah Terima Tugas",
        deskripsi: "Koordinasi dengan Tim",
      },
    ];

    await db.insert(clearanceItems).values(defaultClearanceItems);

    // Log activity
    await db.insert(activityLogs).values({
      employeeId: parsed.data.employeeId,
      tipeAktivitas: "OFFBOARDING",
      deskripsi: `${emp.namaLengkap} Resign (${parsed.data.tipe})`,
      detail: `Tanggal: ${parsed.data.tanggalResign}`,
    });

    return NextResponse.json(
      { success: true, data: newResignation },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/resignations error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
