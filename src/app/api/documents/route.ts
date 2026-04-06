import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents, employees, activityLogs } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET /api/documents — List documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipe = searchParams.get("tipe");
    const employeeId = searchParams.get("employeeId");

    const conditions = [];
    if (tipe) conditions.push(eq(documents.tipe, tipe));
    if (employeeId) conditions.push(eq(documents.employeeId, parseInt(employeeId)));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: documents.id,
        employeeId: documents.employeeId,
        ownerName: employees.namaLengkap,
        ownerAvatar: employees.fotoUrl,
        fileName: documents.fileName,
        tipe: documents.tipe,
        filePath: documents.filePath,
        fileSize: documents.fileSize,
        uploadDate: documents.uploadDate,
      })
      .from(documents)
      .innerJoin(employees, eq(documents.employeeId, employees.id))
      .where(whereClause)
      .orderBy(desc(documents.createdAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/documents — Upload document
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const employeeId = formData.get("employeeId") as string;
    const tipe = formData.get("tipe") as string;

    if (!file || !employeeId || !tipe) {
      return NextResponse.json(
        { success: false, error: "file, employeeId, dan tipe wajib diisi" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(file.name);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Save metadata to DB
    const [newDoc] = await db
      .insert(documents)
      .values({
        employeeId: parseInt(employeeId),
        fileName: file.name,
        tipe,
        filePath: `/uploads/${uniqueName}`,
        fileSize: file.size,
        uploadDate: new Date().toISOString().split("T")[0],
      })
      .returning();

    // Log activity
    await db.insert(activityLogs).values({
      employeeId: parseInt(employeeId),
      tipeAktivitas: "DOCUMENT_UPLOAD",
      deskripsi: `Dokumen Diunggah: ${file.name}`,
      detail: `Tipe: ${tipe}`,
    });

    return NextResponse.json(
      { success: true, data: newDoc },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
