import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { penalties, employees, activityLogs } from "@/db/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { createPenaltySchema } from "@/lib/validators";

// GET /api/penalties — List penalties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bulan = searchParams.get("bulan"); // format: YYYY-MM
    const status = searchParams.get("status");

    const conditions = [];
    if (status) conditions.push(eq(penalties.status, status));
    if (bulan) {
      const [year, month] = bulan.split("-").map(Number);
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = `${year}-${String(month).padStart(2, "0")}-31`;
      conditions.push(gte(penalties.tanggalDenda, startDate));
      conditions.push(lte(penalties.tanggalDenda, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: penalties.id,
        employeeId: penalties.employeeId,
        name: employees.namaLengkap,
        nip: employees.nip,
        alasan: penalties.alasan,
        jumlah: penalties.jumlah,
        status: penalties.status,
        tanggalDenda: penalties.tanggalDenda,
        createdAt: penalties.createdAt,
      })
      .from(penalties)
      .innerJoin(employees, eq(penalties.employeeId, employees.id))
      .where(whereClause)
      .orderBy(desc(penalties.createdAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/penalties error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/penalties — Create new penalty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createPenaltySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const [newPenalty] = await db
      .insert(penalties)
      .values(parsed.data)
      .returning();

    // Get employee name for activity log
    const [emp] = await db
      .select({ namaLengkap: employees.namaLengkap })
      .from(employees)
      .where(eq(employees.id, parsed.data.employeeId));

    // Log activity
    await db.insert(activityLogs).values({
      employeeId: parsed.data.employeeId,
      tipeAktivitas: "PENALTY",
      deskripsi: `Pinalti Diterbitkan — ${emp?.namaLengkap || "Unknown"}`,
      detail: `${parsed.data.alasan} • Rp ${parsed.data.jumlah.toLocaleString("id-ID")}`,
    });

    return NextResponse.json(
      { success: true, data: newPenalty },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/penalties error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
