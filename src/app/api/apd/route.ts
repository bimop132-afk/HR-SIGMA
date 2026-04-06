import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { apdItems, employees, activityLogs } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { createApdSchema, updateApdSchema } from "@/lib/validators";

// GET /api/apd — List APD items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const jenis = searchParams.get("jenis");

    const conditions = [];
    if (employeeId) conditions.push(eq(apdItems.employeeId, parseInt(employeeId)));
    if (status) conditions.push(eq(apdItems.status, status));
    if (jenis) conditions.push(eq(apdItems.jenisApd, jenis));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: apdItems.id,
        employeeId: apdItems.employeeId,
        name: employees.namaLengkap,
        nip: employees.nip,
        jenisApd: apdItems.jenisApd,
        status: apdItems.status,
        depositAmount: apdItems.depositAmount,
        tanggalPinjam: apdItems.tanggalPinjam,
        tanggalKembali: apdItems.tanggalKembali,
        catatan: apdItems.catatan,
        createdAt: apdItems.createdAt,
      })
      .from(apdItems)
      .innerJoin(employees, eq(apdItems.employeeId, employees.id))
      .where(whereClause)
      .orderBy(desc(apdItems.createdAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/apd error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/apd — Create new APD loan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createApdSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const [newApd] = await db
      .insert(apdItems)
      .values(parsed.data)
      .returning();

    return NextResponse.json(
      { success: true, data: newApd },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/apd error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
