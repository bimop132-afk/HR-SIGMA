import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, jumlah, keterangan, tanggal } = body;

    if (!employeeId || !jumlah || !tanggal) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("deposit_installments")
      .insert({
        employee_id: employeeId,
        jumlah,
        keterangan: keterangan || null,
        tanggal
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("POST /api/deposit_installments error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
