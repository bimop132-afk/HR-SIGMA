import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);
    
    // Kontrak < 30 hari
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);
    const in30DaysStr = in30Days.toISOString().slice(0, 10);

    const [
      { count: totalAktif },
      { count: masukBulanIni },
      { count: resignBulanIni },
      { count: kontrakHampirHabis }
    ] = await Promise.all([
      supabase.from("employees").select("*", { count: "exact", head: true }).eq("status", "AKTIF"),
      supabase.from("employees").select("*", { count: "exact", head: true }).gte("tanggal_masuk", startOfMonth),
      supabase.from("resignations").select("*", { count: "exact", head: true }).gte("tanggal_resign", startOfMonth),
      supabase.from("contracts").select("*", { count: "exact", head: true })
        .eq("status", "AKTIF")
        .lte("tanggal_selesai", in30DaysStr)
        .gte("tanggal_selesai", todayStr)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAktif: totalAktif || 0,
        masukBulanIni: masukBulanIni || 0,
        resignBulanIni: resignBulanIni || 0,
        kontrakHampirHabis: kontrakHampirHabis || 0,
        percentChange: 2.4 
      }
    });
  } catch (error) {
    console.error("GET /api/dashboard/kpi error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
