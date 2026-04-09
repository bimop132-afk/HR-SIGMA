import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

// GET /api/analytics/sector-distribution
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("sektor")
      .eq("status", "AKTIF");

    if (error) throw error;

    const distributionMap: Record<number, number> = {};
    (data || []).forEach((e: any) => {
      distributionMap[e.sektor] = (distributionMap[e.sektor] || 0) + 1;
    });

    const formattedData = Object.entries(distributionMap)
      .map(([sektor, count]) => ({
        sektor: parseInt(sektor),
        count,
      }))
      .sort((a, b) => a.sektor - b.sektor);

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET /api/analytics/sector-distribution error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
