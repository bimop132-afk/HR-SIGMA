import { NextResponse } from "next/server";
import { db } from "@/db";
import { resignations } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        tipe: resignations.tipe,
        count: sql<number>`count(*)`,
      })
      .from(resignations)
      .groupBy(resignations.tipe);
      
    // Transform into percentages & colors
    const total = data.reduce((acc, curr) => acc + Number(curr.count), 0);
    
    const formatted = data.map(item => ({
      tipe: item.tipe,
      count: Number(item.count),
      percentage: total > 0 ? Math.round((Number(item.count) / total) * 100) : 0
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/analytics/resign-reasons error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
