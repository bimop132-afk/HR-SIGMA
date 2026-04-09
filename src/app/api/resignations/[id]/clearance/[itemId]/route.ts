import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

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
      updateData.verified_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from("clearance_items")
      .update(updateData)
      .eq("id", parseInt(itemId))
      .eq("resignation_id", parseInt(id))
      .select()
      .single();

    if (error || !updated) {
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
