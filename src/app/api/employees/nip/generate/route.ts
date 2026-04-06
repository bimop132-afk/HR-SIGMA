import { NextRequest, NextResponse } from "next/server";
import { generateNIP } from "@/lib/nip-generator";

// GET /api/employees/nip/generate?tanggalMasuk=2026-03-15&jalurMasuk=LPK
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggalMasuk = searchParams.get("tanggalMasuk");
    const jalurMasuk = searchParams.get("jalurMasuk") as "LPK" | "UMUM" | null;

    if (!tanggalMasuk || !jalurMasuk) {
      return NextResponse.json(
        { success: false, error: "tanggalMasuk dan jalurMasuk wajib diisi" },
        { status: 400 }
      );
    }

    if (jalurMasuk !== "LPK" && jalurMasuk !== "UMUM") {
      return NextResponse.json(
        { success: false, error: "jalurMasuk harus LPK atau UMUM" },
        { status: 400 }
      );
    }

    const nip = await generateNIP(new Date(tanggalMasuk), jalurMasuk);

    return NextResponse.json({ success: true, data: { nip } });
  } catch (error) {
    console.error("GET /api/employees/nip/generate error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
