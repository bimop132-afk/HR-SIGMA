import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { warningLetters, employees, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createWarningLetterSchema } from "@/lib/validators";

// GET /api/warning-letters — List SPs for an employee
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const data = await db
      .select()
      .from(warningLetters)
      .where(eq(warningLetters.employeeId, parseInt(employeeId)))
      .orderBy(desc(warningLetters.tanggalTerbit));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/warning-letters error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/warning-letters — Issue new SP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createWarningLetterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const [newSp] = await db
      .insert(warningLetters)
      .values({
        ...parsed.data,
      })
      .returning();

    // Get employee name for activity log
    const [emp] = await db
      .select({ namaLengkap: employees.namaLengkap })
      .from(employees)
      .where(eq(employees.id, parsed.data.employeeId));

    // Log activity
    await db.insert(activityLogs).values({
      employeeId: parsed.data.employeeId,
      tipeAktivitas: "WARNING_LETTER",
      deskripsi: `Surat Peringatan (${parsed.data.tipe.replace("_", " ")}) Diterbitkan`,
      detail: `${emp?.namaLengkap || "Unknown"} — ${parsed.data.alasan}`,
    });

    return NextResponse.json(
      { success: true, data: newSp },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/warning-letters error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
