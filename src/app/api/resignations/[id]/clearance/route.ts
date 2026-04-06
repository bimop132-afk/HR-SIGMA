import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clearanceItems } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/resignations/:id/clearance — Get clearance checklist
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = await db
      .select()
      .from(clearanceItems)
      .where(eq(clearanceItems.resignationId, parseInt(id)));

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("GET /api/resignations/:id/clearance error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
