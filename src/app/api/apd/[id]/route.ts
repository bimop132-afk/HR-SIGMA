import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { apdItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateApdSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// PUT /api/apd/:id — Update APD status
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateApdSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(apdItems)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(apdItems.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "APD item tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/apd/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
