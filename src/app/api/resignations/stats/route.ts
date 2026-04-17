import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);

    const [
      { count: totalResign },
      { count: phkCount },
      { count: pendingClearance },
      { count: selesaiClearance }
    ] = await Promise.all([
      supabase.from("resignations").select("*", { count: "exact", head: true }),
      supabase.from("resignations").select("*", { count: "exact", head: true }).eq("tipe", "PHK"),
      supabase.from("resignations").select("*", { count: "exact", head: true }).eq("status_clearance", "PENDING"),
      supabase.from("resignations").select("*", { count: "exact", head: true }).eq("status_clearance", "SELESAI")
    ]);

    // calculate monthly percent change if needed, mock for now
    const percentChange = 12;

    return NextResponse.json({
      success: true,
      data: {
        totalResign: totalResign || 0,
        phkCount: phkCount || 0,
        pendingClearance: pendingClearance || 0,
        selesaiClearance: selesaiClearance || 0,
        percentChange
      }
    });
  } catch (error) {
    console.error("GET /api/resignations/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
