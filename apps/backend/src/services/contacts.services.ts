import { supabase } from "../lib/supabase/server";
import { ContactInput } from "../schemas/contact.schema";

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

// Returns the basic contact details of one contact
export const getBasicContactDetails = async (
  userId: string,
  contactId: string
) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .eq("id", contactId)
    .single();

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

// Given a user and contactId, see if that connection exists
export const verifyUserOwnsContact = async (
  userId: string,
  contactId: string
) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .eq("user_id", userId)
    .single();

  return { data, error };
};

export const editContactBasics = async (fields: any, contactId: string) => {
  const { data, error } = await supabase
    .from("contacts")
    .update(fields)
    .eq("id", contactId)
    .select()
    .single();

  return { data, error };
};

// For editing contact subtables, find what to add/edit/delete
export const syncSubtable = async (
  table: string,
  contactId: string,
  newRows: any[]
) => {
  // Get the existing rows
  const { data: existingRows, error: fetchError } = await supabase
    .from(table)
    .select("*")
    .eq("contact_id", contactId);

  if (fetchError) throw fetchError;

  const toInsert: any[] = [];
  const toUpdate: any[] = [];
  const existingIds = new Set<string>();

  for (const newRow of newRows) {
    if (newRow.id) {
      existingIds.add(newRow.id);
      const match = existingRows.find((r) => r.id === newRow.id);

      // If the id's match but content isn't the same, prepare to update it
      if (
        match &&
        JSON.stringify(match) !== JSON.stringify({ ...match, ...newRow })
      ) {
        toUpdate.push(newRow);
      }
    } else {
      // If it isn't in the list of existing rows, prepare to insert it
      toInsert.push({ ...newRow, contact_id: contactId });
    }
  }

  const toDelete = existingRows
    .filter((r) => !existingIds.has(r.id))
    .map((r) => r.id);

  // Apply everything
  if (toInsert.length) await supabase.from(table).insert(toInsert);
  if (toUpdate.length)
    await Promise.all(
      toUpdate.map((row) => supabase.from(table).update(row).eq("id", row.id))
    );
  if (toDelete.length) await supabase.from(table).delete().in("id", toDelete);
};

export const deleteContact = async (userId: string, contactId: string) => {
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId)
    .eq("user_id", userId);

  return { error };
};

// Return all subtable data for a given contact
export const getContactSubtables = async (contactId: string) => {
  const [emailsRes, phonesRes, socialsRes, photosRes, attributesRes] =
    await Promise.all([
      supabase
        .from("contact_emails")
        .select("id, email, label, is_primary")
        .eq("contact_id", contactId)
        .order("is_primary", { ascending: false })
        .order("label"),
      supabase
        .from("contact_phone_numbers")
        .select("id, phone_number, label, is_primary")
        .eq("contact_id", contactId)
        .order("is_primary", { ascending: false })
        .order("label"),
      supabase
        .from("contact_social_accounts")
        .select("id, platform, username, url")
        .eq("contact_id", contactId)
        .order("platform")
        .order("username"),
      supabase
        .from("contact_photos")
        .select("id, photo_url, description")
        .eq("contact_id", contactId),
      supabase
        .from("contact_attributes")
        .select("id, key, value, label")
        .eq("contact_id", contactId),
    ]);

  const emails =
    emailsRes.data?.map((e) => ({
      id: e.id,
      value: e.email,
      label: e.label,
      is_primary: e.is_primary,
    })) ?? [];

  const phones =
    phonesRes.data?.map((p) => ({
      id: p.id,
      value: p.phone_number,
      label: p.label,
      is_primary: p.is_primary,
    })) ?? [];

  const social_accounts =
    socialsRes.data?.map((s) => ({
      id: s.id,
      platform: s.platform,
      username: s.username,
      url: s.url,
    })) ?? [];

  const photos =
    photosRes.data?.map((p) => ({
      id: p.id,
      url: p.photo_url,
      description: p.description,
    })) ?? [];

  const attributes =
    attributesRes.data?.map((a) => ({
      id: a.id,
      key: a.key,
      value: a.value,
      label: a.label,
    })) ?? [];

  return [emails, phones, social_accounts, photos, attributes];
};
