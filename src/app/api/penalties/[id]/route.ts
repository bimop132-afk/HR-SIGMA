import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

// PUT /api/penalties/:id — Update penalty status
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data: updated, error } = await supabase
      .from("penalties")
      .update({ ...body })
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { success: false, error: "Denda tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/penalties/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
