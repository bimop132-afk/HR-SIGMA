import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { createSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const employeeId = formData.get("employeeId") as string;
    
    if (!file || !type || !employeeId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    
    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("hr_documents")
      .upload(`employees/${employeeId}/${fileName}`, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Supabase chunk error:", uploadError);
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage
      .from("hr_documents")
      .getPublicUrl(`employees/${employeeId}/${fileName}`);
      
    const url = publicData.publicUrl;

    // Save to DB
    const [inserted] = await db.insert(documents).values({
      employeeId: parseInt(employeeId),
      fileName: file.name,
      tipe: type,
      filePath: url,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
    }).returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
