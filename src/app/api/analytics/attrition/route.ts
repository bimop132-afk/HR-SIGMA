import { NextResponse } from "next/server";
import { db } from "@/db";
import { resignations } from "@/db/schema";
import { sql } from "drizzle-orm";

// GET /api/analytics/attrition — Monthly attrition data
export async function GET() {
  try {
    const data = await db
      .select({
        month: sql<string>`TO_CHAR(${resignations.tanggalResign}::date, 'YYYY-MM')`,
        count: sql<number>`count(*)::int`,
      })
      .from(resignations)
      .where(
        sql`${resignations.tanggalResign}::date >= NOW() - INTERVAL '12 months'`
      )
      .groupBy(sql`TO_CHAR(${resignations.tanggalResign}::date, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${resignations.tanggalResign}::date, 'YYYY-MM')`);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/analytics/attrition error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
