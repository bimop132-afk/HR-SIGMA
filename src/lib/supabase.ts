import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Standard client (respects RLS, for public use)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side client with Service Role (bypasses RLS)
 * Use this only in API routes and Server Components
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);

// Helper for dynamic client creation if needed (legacy support)
export const createSupabaseClient = () => supabase;
