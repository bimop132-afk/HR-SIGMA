import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, employees } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/dashboard/activity — Recent activity feed
export async function GET() {
  try {
    const data = await db
      .select({
        id: activityLogs.id,
        employeeId: activityLogs.employeeId,
        employeeName: employees.namaLengkap,
        tipeAktivitas: activityLogs.tipeAktivitas,
        deskripsi: activityLogs.deskripsi,
        detail: activityLogs.detail,
        createdAt: activityLogs.createdAt,
      })
      .from(activityLogs)
      .leftJoin(employees, eq(activityLogs.employeeId, employees.id))
      .orderBy(desc(activityLogs.createdAt))
      .limit(10);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/dashboard/activity error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
