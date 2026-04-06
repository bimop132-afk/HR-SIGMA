import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateEmployeeSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// GET /api/employees/:id
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, parseInt(id)))
      .limit(1);

    if (employee.length === 0) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employee[0] });
  } catch (error) {
    console.error("GET /api/employees/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/employees/:id
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(employees)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(employees.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/employees/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/:id (soft delete)
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [updated] = await db
      .update(employees)
      .set({ status: "NON_AKTIF", updatedAt: new Date() })
      .where(eq(employees.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("DELETE /api/employees/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
