import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

// GET /api/resignations/:id/clearance — Get clearance checklist
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { data: items, error } = await supabase
      .from("clearance_items")
      .select("*")
      .eq("resignation_id", parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true, data: items || [] });
  } catch (error) {
    console.error("GET /api/resignations/:id/clearance error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
