import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents, employees } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: documents.id,
        fileName: documents.fileName,
        type: documents.tipe,
        size: documents.fileSize,
        uploadDate: documents.uploadDate,
        filePath: documents.filePath,
        ownerName: employees.namaLengkap,
        ownerAvatar: employees.fotoUrl,
      })
      .from(documents)
      .leftJoin(employees, eq(documents.employeeId, employees.id))
      .orderBy(desc(documents.uploadDate));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
