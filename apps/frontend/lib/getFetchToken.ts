import { supabase } from "./supabaseClient";

export const getFetchToken = async () => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  if (!token) {
    console.error("Not logged in");
    return "";
  }

  return token;
};
