import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// GET /api/analytics/sector-distribution
export async function GET() {
  try {
    const data = await db
      .select({
        sektor: employees.sektor,
        count: sql<number>`count(*)::int`,
      })
      .from(employees)
      .where(eq(employees.status, "AKTIF"))
      .groupBy(employees.sektor)
      .orderBy(employees.sektor);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/analytics/sector-distribution error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
