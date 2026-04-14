import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from("resignations")
    .select("*, employees(*, penalties(*), apd_items(*)), clearance_items(*)")
    .limit(1);
    
  console.log(JSON.stringify(data, null, 2));
}
run();
