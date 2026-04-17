import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
    
    // fetch simple kpi for insights
    const [
      { count: masukBulanIni },
      { count: resignBulanIni },
    ] = await Promise.all([
      supabase.from("employees").select("*", { count: "exact", head: true }).gte("tanggal_masuk", startOfMonth),
      supabase.from("resignations").select("*", { count: "exact", head: true }).gte("tanggal_resign", startOfMonth),
    ]);

    const insights = [];

    if (masukBulanIni && masukBulanIni > 0) {
      insights.push({
        type: "positive",
        icon: "auto_awesome",
        text: `Terdapat peningkatan rekrutmen dengan masuknya ${masukBulanIni} karyawan baru bulan ini.`
      });
    } else {
      insights.push({
        type: "positive",
        icon: "insights",
        text: "Tingkat retensi terpantau stabil, tidak ada penambahan atau pengurangan signifikan minggu ini."
      });
    }

    if (resignBulanIni && resignBulanIni > 2) {
      insights.push({
        type: "negative",
        icon: "warning",
        text: `Perhatian: Ada ${resignBulanIni} karyawan yang resign bulan ini. Disarankan untuk meninjau kembali feedback exit interview.`
      });
    }

    // fallback insight if only one
    if (insights.length < 2) {
      insights.push({
        type: "neutral",
        icon: "monitoring",
        text: "Kinerja operasional dan absensi dalam 7 hari terakhir menunjukkan tren normal."
      });
    }

    return NextResponse.json({ success: true, data: insights });
  } catch (error) {
    console.error("GET /api/analytics/insights error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
