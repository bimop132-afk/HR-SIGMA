import { NextResponse } from "next/server";
import { db } from "@/db";
import { resignations } from "@/db/schema";
import { sql } from "drizzle-orm";

// GET /api/analytics/resign-reasons — Resignation reasons breakdown
export async function GET() {
  try {
    const data = await db
      .select({
        tipe: resignations.tipe,
        count: sql<number>`count(*)::int`,
      })
      .from(resignations)
      .groupBy(resignations.tipe)
      .orderBy(sql`count(*) DESC`);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/analytics/resign-reasons error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
