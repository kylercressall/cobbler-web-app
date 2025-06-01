import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only key

console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY =",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZWl5YWd2b292amtpb3B5ZGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTc5NywiZXhwIjoyMDYzODcxNzk3fQ.ll-4YcM7ixP6fsNkpm8MQDn_rOD9ajCNz8jq3vt547k";

const SUPABASE_URL = "https://rdeiyagvoovjkiopydaa.supabase.co";

// export const supabase = createClient(supabaseUrl, supabaseServiceKey);
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
