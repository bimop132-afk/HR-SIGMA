import { NextResponse } from "next/server";
import { db } from "@/db";
import { penalties } from "@/db/schema";
import { sql, eq, and, gte, lte } from "drizzle-orm";

// GET /api/penalties/stats — Get penalty statistics for current month
export async function GET() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    const [stats] = await db
      .select({
        totalPeriode: sql<number>`COALESCE(SUM(${penalties.jumlah}), 0)::int`,
        totalBelumBayar: sql<number>`COALESCE(SUM(CASE WHEN ${penalties.status} = 'BELUM_BAYAR' THEN ${penalties.jumlah} ELSE 0 END), 0)::int`,
        totalLunas: sql<number>`COALESCE(SUM(CASE WHEN ${penalties.status} = 'LUNAS' THEN ${penalties.jumlah} ELSE 0 END), 0)::int`,
        jumlahRecord: sql<number>`count(*)::int`,
      })
      .from(penalties)
      .where(
        and(
          gte(penalties.tanggalDenda, startDate),
          lte(penalties.tanggalDenda, endDate)
        )
      );

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET /api/penalties/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
