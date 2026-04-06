import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clearanceItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string; itemId: string }> };

// PUT /api/resignations/:id/clearance/:itemId — Update clearance item
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id, itemId } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      status: body.status,
    };

    if (body.status === "VERIFIED") {
      updateData.verifiedAt = new Date();
    }

    const [updated] = await db
      .update(clearanceItems)
      .set(updateData)
      .where(
        and(
          eq(clearanceItems.id, parseInt(itemId)),
          eq(clearanceItems.resignationId, parseInt(id))
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Item clearance tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT clearance item error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
