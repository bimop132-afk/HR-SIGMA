import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { id } from "date-fns/locale";

export async function GET() {
  try {
    const months = [];
    const today = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      months.push({
        label: format(monthDate, "MMM", { locale: id }),
        start: startOfMonth(monthDate).toISOString().slice(0, 10),
        end: endOfMonth(monthDate).toISOString().slice(0, 10),
      });
    }

    const results = await Promise.all(months.map(async (m) => {
      const [{ count: masuk }, { count: keluar }] = await Promise.all([
        supabase.from("employees").select("*", { count: "exact", head: true }).gte("tanggal_masuk", m.start).lte("tanggal_masuk", m.end),
        supabase.from("resignations").select("*", { count: "exact", head: true }).gte("tanggal_resign", m.start).lte("tanggal_resign", m.end)
      ]);

      return {
        month: m.label,
        masuk: masuk || 0,
        keluar: keluar || 0,
      };
    }));

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("GET /api/analytics/turnover error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
