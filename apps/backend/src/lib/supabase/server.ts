import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.SUPABASE_URL!;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only key

supabaseUrl = "https://rdeiyagvoovjkiopydaa.supabase.co";
supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZWl5YWd2b292amtpb3B5ZGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkyNDgxMSwiZXhwIjoyMDY0NTAwODExfQ.dcKM6PSpAAwvuHdCqhCeDq5guyZMj96RMEJBzYH1XTs";

// export const supabase = createClient(supabaseUrl, supabaseServiceKey);
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
