import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees, resignations } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

// GET /api/analytics/turnover — Monthly turnover data
export async function GET() {
  try {
    // Get monthly hire counts for the last 6 months
    const hires = await db
      .select({
        month: sql<string>`TO_CHAR(${employees.tanggalMasuk}::date, 'YYYY-MM')`,
        count: sql<number>`count(*)::int`,
      })
      .from(employees)
      .where(
        sql`${employees.tanggalMasuk}::date >= NOW() - INTERVAL '6 months'`
      )
      .groupBy(sql`TO_CHAR(${employees.tanggalMasuk}::date, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${employees.tanggalMasuk}::date, 'YYYY-MM')`);

    // Get monthly resign counts for the last 6 months
    const resigns = await db
      .select({
        month: sql<string>`TO_CHAR(${resignations.tanggalResign}::date, 'YYYY-MM')`,
        count: sql<number>`count(*)::int`,
      })
      .from(resignations)
      .where(
        sql`${resignations.tanggalResign}::date >= NOW() - INTERVAL '6 months'`
      )
      .groupBy(sql`TO_CHAR(${resignations.tanggalResign}::date, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${resignations.tanggalResign}::date, 'YYYY-MM')`);

    return NextResponse.json({
      success: true,
      data: { hires, resigns },
    });
  } catch (error) {
    console.error("GET /api/analytics/turnover error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
