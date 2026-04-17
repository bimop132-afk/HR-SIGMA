import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { startOfMonth, endOfMonth, endOfWeek, startOfWeek, subDays } from "date-fns";

export async function GET() {
  try {
    const today = new Date();
    // Get current month bounds
    const startMonth = startOfMonth(today);
    
    const weeks = [];
    let currentStart = startMonth;
    
    // Generate 4 weeks (simple approximation for current month)
    for (let i = 1; i <= 4; i++) {
        const nextEnd = new Date(currentStart);
        nextEnd.setDate(currentStart.getDate() + 6);
        
        weeks.push({
            name: `Minggu ${i}`,
            start: currentStart.toISOString().slice(0, 10),
            end: nextEnd.toISOString().slice(0, 10),
        });
        
        currentStart = new Date(nextEnd);
        currentStart.setDate(currentStart.getDate() + 1);
    }

    const { count: totalAktif } = await supabase.from("employees").select("*", { count: "exact", head: true }).eq("status", "AKTIF");
    const baseTotal = totalAktif || 1; // prevent div by zero

    const results = await Promise.all(weeks.map(async (w) => {
      const [{ count: resign }] = await Promise.all([
        supabase.from("resignations").select("*", { count: "exact", head: true }).gte("tanggal_resign", w.start).lte("tanggal_resign", w.end)
      ]);

      return {
        minggu: w.name,
        rate: ((resign || 0) / baseTotal * 100).toFixed(1),
        resign: resign || 0
      };
    }));

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("GET /api/analytics/weekly-turnover error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
