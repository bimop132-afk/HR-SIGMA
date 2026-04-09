import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("resignations")
      .select("tipe");

    if (error) throw error;

    const distributionMap: Record<string, number> = {};
    (data || []).forEach((r: any) => {
      distributionMap[r.tipe] = (distributionMap[r.tipe] || 0) + 1;
    });
      
    const total = (data || []).length;
    
    const formatted = Object.entries(distributionMap).map(([tipe, count]) => ({
      tipe,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET /api/analytics/resign-reasons error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
