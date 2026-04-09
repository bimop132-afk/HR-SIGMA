import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { unlink } from "fs/promises";
import path from "path";

type Params = { params: Promise<{ id: string }> };

// DELETE /api/documents/:id
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (fetchError || !doc) {
      return NextResponse.json(
        { success: false, error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), "public", doc.file_path);
      await unlink(filePath);
    } catch {
      // File may already be deleted, continue
    }

    // Delete from DB
    await supabase.from("documents").delete().eq("id", parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/documents/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
