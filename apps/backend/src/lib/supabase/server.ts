import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.SUPABASE_URL!;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only key

// export const supabase = createClient(supabaseUrl, supabaseServiceKey);
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
