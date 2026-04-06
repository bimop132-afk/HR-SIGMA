import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";
import path from "path";

type Params = { params: Promise<{ id: string }> };

// DELETE /api/documents/:id
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, parseInt(id)));

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), "public", doc.filePath);
      await unlink(filePath);
    } catch {
      // File may already be deleted, continue
    }

    // Delete from DB
    await db.delete(documents).where(eq(documents.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/documents/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
