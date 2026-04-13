import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

type Params = { params: Promise<{ id: string; itemId: string }> };

// PUT /api/resignations/:id/clearance/:itemId — Update clearance item
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id, itemId } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      status: body.status,
    };

    if (body.status === "VERIFIED") {
      updateData.verified_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from("clearance_items")
      .update(updateData)
      .eq("id", parseInt(itemId))
      .eq("resignation_id", parseInt(id))
      .select("*, resignations(employee_id)")
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { success: false, error: "Item clearance tidak ditemukan" },
        { status: 404 }
      );
    }

    // Process Penalties
    if (body.status === "HILANG" || body.status === "KOTOR") {
      let penaltyAmount = 0;
      let penaltyReason = "";
      const itemName = updated.nama_item;

      if (itemName === "ID Card" && body.status === "HILANG") {
        penaltyAmount = 20000;
        penaltyReason = "HILANG ID CARD";
      } else if (itemName === "Seragam" && body.status === "HILANG") {
        penaltyAmount = 166667;
        penaltyReason = "HILANG SERAGAM";
      } else if (itemName === "Seragam" && body.status === "KOTOR") {
        penaltyAmount = 500000;
        penaltyReason = "SERAGAM KOTOR";
      } else if (itemName === "Sepatu" && body.status === "HILANG") {
        penaltyAmount = 230000; 
        penaltyReason = "HILANG SEPATU";
      } else if (itemName === "Haircup" && body.status === "HILANG") {
        penaltyAmount = 10000;
        penaltyReason = "HILANG HAIRCUP";
      } else if (itemName === "Apron" && body.status === "HILANG") {
        penaltyAmount = 20000;
        penaltyReason = "HILANG APRON";
      }

      if (penaltyAmount > 0) {
        const employeeId = updated.resignations?.employee_id;
        if (employeeId) {
          // Insert penalty
          await supabase.from("penalties").insert({
            employee_id: employeeId,
            alasan: penaltyReason,
            jumlah: penaltyAmount,
            status: "BELUM_BAYAR",
            tanggal_denda: new Date().toISOString().split("T")[0],
          });
          
          // Log activity
          await supabase.from("activity_logs").insert({
            employee_id: employeeId,
            tipe_aktivitas: "PENALTY",
            deskripsi: `Denda Clearance Otomatis`,
            detail: `${penaltyReason} • Rp ${penaltyAmount.toLocaleString("id-ID")}`,
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT clearance item error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
