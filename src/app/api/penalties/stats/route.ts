import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

// GET /api/penalties/stats — Get penalty statistics for current month
export async function GET() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("penalties")
      .select("*")
      .gte("tanggal_denda", startDate)
      .lte("tanggal_denda", endDate);

    if (error) throw error;

    const stats = (data || []).reduce((acc, curr) => {
      acc.totalPeriode += curr.jumlah;
      if (curr.status === 'BELUM_BAYAR') acc.totalBelumBayar += curr.jumlah;
      if (curr.status === 'LUNAS') acc.totalLunas += curr.jumlah;
      acc.jumlahRecord += 1;
      return acc;
    }, {
      totalPeriode: 0,
      totalBelumBayar: 0,
      totalLunas: 0,
      jumlahRecord: 0
    });

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET /api/penalties/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
