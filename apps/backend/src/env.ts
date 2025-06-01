import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"), // use absolute path just to be really explicit about it
});

// logic to check that env is loaded in correctly
if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL not set");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
