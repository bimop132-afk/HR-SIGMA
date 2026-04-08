import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees, resignations } from "@/db/schema";
import { sql, and, gte, lte } from "drizzle-orm";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { id } from "date-fns/locale";

export async function GET() {
  try {
    const months = [];
    const today = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      months.push({
        label: format(monthDate, "MMM", { locale: id }),
        start: startOfMonth(monthDate).toISOString(),
        end: endOfMonth(monthDate).toISOString(),
      });
    }

    const results = [];
    for (const m of months) {
      // Masuk
      const [masuk] = await db
        .select({ count: sql<number>`count(*)` })
        .from(employees)
        .where(and(gte(employees.tanggalMasuk, m.start), lte(employees.tanggalMasuk, m.end)));
        
      // Keluar
      const [keluar] = await db
        .select({ count: sql<number>`count(*)` })
        .from(resignations)
        .where(and(gte(resignations.tanggalResign, m.start), lte(resignations.tanggalResign, m.end)));
        
      results.push({
        month: m.label,
        masuk: Number(masuk?.count || 0),
        keluar: Number(keluar?.count || 0),
      });
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("GET /api/analytics/turnover error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
