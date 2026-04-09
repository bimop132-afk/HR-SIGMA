import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { format, subMonths } from "date-fns";

// GET /api/analytics/attrition — Monthly attrition data
export async function GET() {
  try {
    const twelveMonthsAgo = subMonths(new Date(), 12).toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("resignations")
      .select("tanggal_resign")
      .gte("tanggal_resign", twelveMonthsAgo);

    if (error) throw error;

    const distributionMap: Record<string, number> = {};
    (data || []).forEach((r: any) => {
      if (!r.tanggal_resign) return;
      const month = r.tanggal_resign.substring(0, 7); // YYYY-MM
      distributionMap[month] = (distributionMap[month] || 0) + 1;
    });

    const formattedData = Object.entries(distributionMap)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET /api/analytics/attrition error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
