import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
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

    // Map camelCase to snake_case
    const updateData: any = {
      status: parsed.data.status,
      catatan: parsed.data.catatan,
    };
    if (parsed.data.tanggalKembali) updateData.tanggal_kembali = parsed.data.tanggalKembali;

    const { data: updated, error } = await supabase
      .from("apd_items")
      .update(updateData)
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error || !updated) {
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
