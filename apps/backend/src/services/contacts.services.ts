import { supabase } from "../lib/supabase/server";
import { ContactInput } from "../schemas/contact.schema";
import { Contact } from "../types/user-data";

// Get all basic contacts for a user
export const getBasicContacts = async (userId: string) => {
  if (!userId) {
    return {
      data: null,
      error: new Error("No user ID provided"),
    };
  }

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  // add data checking here to make sure it was valid, otherwise throw error

  return { data, error };
};

// Create the contact and return it
export const createContact = async (validatedData: ContactInput) => {
  const { data, error } = await supabase
    .from("contacts")
    .insert(validatedData)
    .select()
    .single();

  return { data, error };
};
