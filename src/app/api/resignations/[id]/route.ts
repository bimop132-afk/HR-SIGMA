import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

// PUT /api/resignations/:id — Update clearance status
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data: updated, error } = await supabase
      .from("resignations")
      .update({ ...body })
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { success: false, error: "Data resign tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/resignations/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
