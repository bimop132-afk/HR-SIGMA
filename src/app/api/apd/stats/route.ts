import { NextResponse } from "next/server";
import { db } from "@/db";
import { apdItems } from "@/db/schema";
import { sql } from "drizzle-orm";

// GET /api/apd/stats — APD statistics
export async function GET() {
  try {
    const [stats] = await db
      .select({
        totalDipinjam: sql<number>`COALESCE(SUM(CASE WHEN ${apdItems.status} = 'DIPINJAM' THEN 1 ELSE 0 END), 0)::int`,
        totalDikembalikan: sql<number>`COALESCE(SUM(CASE WHEN ${apdItems.status} = 'DIKEMBALIKAN' THEN 1 ELSE 0 END), 0)::int`,
        totalHilang: sql<number>`COALESCE(SUM(CASE WHEN ${apdItems.status} = 'HILANG' THEN 1 ELSE 0 END), 0)::int`,
        totalDeposit: sql<number>`COALESCE(SUM(${apdItems.depositAmount}), 0)::int`,
        totalItems: sql<number>`count(*)::int`,
      })
      .from(apdItems);

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET /api/apd/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
