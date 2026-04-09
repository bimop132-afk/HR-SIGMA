import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees, contracts, activityLogs } from "@/db/schema";
import { eq, and, like, ilike, sql, desc } from "drizzle-orm";
import { createEmployeeSchema } from "@/lib/validators";
import { generateNIP } from "@/lib/nip-generator";

// GET /api/employees — List employees with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sektor = searchParams.get("sektor");
    const posisi = searchParams.get("posisi");
    const regu = searchParams.get("regu");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (sektor) conditions.push(eq(employees.sektor, parseInt(sektor)));
    if (posisi) conditions.push(eq(employees.posisi, posisi));
    if (regu) conditions.push(eq(employees.regu, parseInt(regu)));
    if (status) conditions.push(eq(employees.status, status));
    if (search) {
      conditions.push(
        sql`(${ilike(employees.namaLengkap, `%${search}%`)} OR ${ilike(employees.nip, `%${search}%`)})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(employees)
        .where(whereClause)
        .orderBy(desc(employees.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(employees)
        .where(whereClause),
    ]);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total: countResult[0].count,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/employees — Create new employee (onboarding)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { tanggalMasuk, jalurMasuk, nip: manualNip, ...rest } = parsed.data;
    const tanggalMasukDate = new Date(tanggalMasuk);

    // Auto-generate NIP only if manualNip is not provided
    const finalNip = manualNip ? manualNip : await generateNIP(tanggalMasukDate, jalurMasuk);

    // Insert employee
    const [newEmployee] = await db
      .insert(employees)
      .values({
        nip: finalNip,
        jalurMasuk,
        tanggalMasuk,
        nomorBpjs: rest.nomorBpjs,
        ...rest,
      })
      .returning();

    // Create first contract (PKWT_1, 1 year duration)
    // For old employees, we assume they start with PKWT_1 as default unless they provide overrides,
    // but the schema enforces creating one for onboarding.
    const kontrakSelesai = new Date(tanggalMasukDate);
    kontrakSelesai.setFullYear(kontrakSelesai.getFullYear() + 1);

    await db.insert(contracts).values({
      employeeId: newEmployee.id,
      tipeKontrak: "PKWT_1",
      tanggalMulai: tanggalMasuk,
      tanggalSelesai: kontrakSelesai.toISOString().split("T")[0],
    });

    // Log activity
    await db.insert(activityLogs).values({
      employeeId: newEmployee.id,
      tipeAktivitas: "ONBOARDING",
      deskripsi: `${newEmployee.namaLengkap} Onboarded`,
      detail: `Sektor ${newEmployee.sektor} • ${jalurMasuk}`,
    });

    return NextResponse.json(
      { success: true, data: newEmployee },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
