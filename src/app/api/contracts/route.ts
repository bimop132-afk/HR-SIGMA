import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contracts, employees } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { createContractSchema } from "@/lib/validators";

// GET /api/contracts — List contracts with computed fields
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");
    const employeeId = searchParams.get("employeeId");

    const conditions = [eq(contracts.status, "AKTIF")];
    if (employeeId) {
      conditions.push(eq(contracts.employeeId, parseInt(employeeId)));
    }

    const data = await db
      .select({
        id: contracts.id,
        employeeId: contracts.employeeId,
        employeeName: employees.namaLengkap,
        employeeNip: employees.nip,
        position: employees.posisi,
        sektor: employees.sektor,
        tipeKontrak: contracts.tipeKontrak,
        tanggalMulai: contracts.tanggalMulai,
        tanggalSelesai: contracts.tanggalSelesai,
        status: contracts.status,
        fotoUrl: employees.fotoUrl,
      })
      .from(contracts)
      .innerJoin(employees, eq(contracts.employeeId, employees.id))
      .where(and(...conditions))
      .orderBy(contracts.tanggalSelesai);

    // Compute daysLeft and severity
    const now = new Date();
    const enriched = data.map((c) => {
      const endDate = new Date(c.tanggalSelesai);
      const diffTime = endDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let contractSeverity: "critical" | "warning" | "safe";
      if (daysLeft <= 30) contractSeverity = "critical";
      else if (daysLeft <= 90) contractSeverity = "warning";
      else contractSeverity = "safe";

      return {
        ...c,
        daysLeft,
        severity: contractSeverity,
        department: `Sektor ${c.sektor}`,
        avatar: c.fotoUrl || "",
      };
    });

    // Filter by severity if specified
    const filtered = severity
      ? enriched.filter((c) => c.severity === severity)
      : enriched;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/contracts error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/contracts — Create new contract
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createContractSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const [newContract] = await db
      .insert(contracts)
      .values(parsed.data)
      .returning();

    return NextResponse.json(
      { success: true, data: newContract },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contracts error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
