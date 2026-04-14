import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  const { data: employees, error } = await supabase.from('employees').select('*');
  if (error) {
    console.error("Error fetching employees:", error);
    return;
  }

  for (const emp of employees) {
    const documentsToInsert = [];
    const getFileName = (url, fallbackPrefix) => {
      try {
        const decoded = decodeURIComponent(url);
        const namePart = decoded.split('/').pop()?.split('?')[0]; 
        return namePart || `${fallbackPrefix}_${emp.nama_lengkap.replace(/\\s+/g, '_')}`;
      } catch {
        return `${fallbackPrefix}_${emp.nama_lengkap.replace(/\\s+/g, '_')}`;
      }
    };

    if (emp.foto_ktp_url) {
      const { data: existing } = await supabase.from('documents').select('id').eq('employee_id', emp.id).eq('tipe', 'KTP');
      if (!existing || existing.length === 0) {
        documentsToInsert.push({
          employee_id: emp.id,
          file_name: getFileName(emp.foto_ktp_url, "KTP"),
          tipe: "KTP",
          file_path: emp.foto_ktp_url,
          file_size: 0,
          upload_date: new Date().toISOString().split("T")[0],
        });
      }
    }
    
    if (emp.foto_kk_url) {
      const { data: existing } = await supabase.from('documents').select('id').eq('employee_id', emp.id).like('file_name', '%KK%');
      if (!existing || existing.length === 0) {
        documentsToInsert.push({
          employee_id: emp.id,
          file_name: getFileName(emp.foto_kk_url, "KK"),
          tipe: "Lainnya",
          file_path: emp.foto_kk_url,
          file_size: 0,
          upload_date: new Date().toISOString().split("T")[0],
        });
      }
    }
    
    if (emp.foto_ijazah_url) {
      const { data: existing } = await supabase.from('documents').select('id').eq('employee_id', emp.id).eq('tipe', 'Ijazah');
      if (!existing || existing.length === 0) {
        documentsToInsert.push({
          employee_id: emp.id,
          file_name: getFileName(emp.foto_ijazah_url, "IJAZAH"),
          tipe: "Ijazah",
          file_path: emp.foto_ijazah_url,
          file_size: 0,
          upload_date: new Date().toISOString().split("T")[0],
        });
      }
    }

    if (documentsToInsert.length > 0) {
      console.log(`Inserting ${documentsToInsert.length} documents for ${emp.nama_lengkap}`);
      const { error: insErr } = await supabase.from('documents').insert(documentsToInsert);
      if (insErr) console.error("Insert error:", insErr);
    }
  }
  console.log("Migration done");
}

migrate();
