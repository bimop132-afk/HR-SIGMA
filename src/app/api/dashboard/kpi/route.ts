import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees, resignations, contracts } from "@/db/schema";
import { eq, sql, and, gte, lte } from "drizzle-orm";

// GET /api/dashboard/kpi — Dashboard KPI metrics
export async function GET() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
    const endOfMonth = `${year}-${String(month).padStart(2, "0")}-31`;

    // Calculate 30 days from now for contract expiry
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [
      [totalAktif],
      [masukBulanIni],
      [resignBulanIni],
      [kontrakHampirHabis],
    ] = await Promise.all([
      // Total active employees
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(employees)
        .where(eq(employees.status, "AKTIF")),

      // New employees this month
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(employees)
        .where(
          and(
            gte(employees.tanggalMasuk, startOfMonth),
            lte(employees.tanggalMasuk, endOfMonth)
          )
        ),

      // Resignations this month
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(resignations)
        .where(
          and(
            gte(resignations.tanggalResign, startOfMonth),
            lte(resignations.tanggalResign, endOfMonth)
          )
        ),

      // Contracts expiring within 30 days
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(contracts)
        .where(
          and(
            eq(contracts.status, "AKTIF"),
            lte(
              contracts.tanggalSelesai,
              thirtyDaysFromNow.toISOString().split("T")[0]
            ),
            gte(contracts.tanggalSelesai, now.toISOString().split("T")[0])
          )
        ),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAktif: totalAktif.count,
        masukBulanIni: masukBulanIni.count,
        resignBulanIni: resignBulanIni.count,
        kontrakHampirHabis: kontrakHampirHabis.count,
      },
    });
  } catch (error) {
    console.error("GET /api/dashboard/kpi error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
