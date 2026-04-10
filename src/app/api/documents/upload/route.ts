import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const employeeId = formData.get("employeeId") as string;
    
    if (!file || !type || !employeeId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

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
      console.error("Supabase storage error:", uploadError);
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage
      .from("hr_documents")
      .getPublicUrl(`employees/${employeeId}/${fileName}`);
      
    const url = publicData.publicUrl;

    // Save to DB using Supabase native insert
    const { data: inserted, error: dbError } = await supabase
      .from("documents")
      .insert({
        employee_id: parseInt(employeeId),
        file_name: file.name,
        tipe: type,
        file_path: url,
        file_size: file.size,
        upload_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase DB error:", dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: inserted });

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
