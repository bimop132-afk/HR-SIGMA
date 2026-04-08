import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees, contracts, resignations } from "@/db/schema";
import { eq, sql, and, gte } from "drizzle-orm";

export async function GET() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    
    const [totalAktifRows] = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees)
      .where(eq(employees.status, "AKTIF"));
      
    const [masukBulanIniRows] = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees)
      .where(gte(employees.tanggalMasuk, startOfMonth));
      
    const [resignBulanIniRows] = await db
      .select({ count: sql<number>`count(*)` })
      .from(resignations)
      .where(gte(resignations.tanggalResign, startOfMonth));
      
    // Kontrak < 30 hari
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);
    const in30DaysStr = in30Days.toISOString();
    const todayStr = today.toISOString();
    
    const [kontrakHampirHabisRows] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contracts)
      .where(
        and(
          eq(contracts.status, "AKTIF"),
          sql`${contracts.tanggalSelesai} <= ${in30DaysStr}`,
          sql`${contracts.tanggalSelesai} >= ${todayStr}`
        )
      );

    return NextResponse.json({
      success: true,
      data: {
        totalAktif: Number(totalAktifRows?.count || 0),
        masukBulanIni: Number(masukBulanIniRows?.count || 0),
        resignBulanIni: Number(resignBulanIniRows?.count || 0),
        kontrakHampirHabis: Number(kontrakHampirHabisRows?.count || 0),
        percentChange: 2.4 // Mock percent change, can be calculated over previous month
      }
    });
  } catch (error) {
    console.error("GET /api/dashboard/kpi error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
