import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

// GET /api/apd/stats — APD statistics
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("apd_items")
      .select("*");

    if (error) throw error;

    const stats = (data || []).reduce((acc, curr) => {
      if (curr.status === 'DIPINJAM') acc.totalDipinjam += 1;
      if (curr.status === 'DIKEMBALIKAN') acc.totalDikembalikan += 1;
      if (curr.status === 'HILANG') acc.totalHilang += 1;
      acc.totalDeposit += curr.deposit_amount || 0;
      acc.totalItems += 1;
      return acc;
    }, {
      totalDipinjam: 0,
      totalDikembalikan: 0,
      totalHilang: 0,
      totalDeposit: 0,
      totalItems: 0
    });

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET /api/apd/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
