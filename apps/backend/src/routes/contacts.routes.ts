import { Router, Response } from "express";
import type { AuthedRequest } from "../types/express"; // or wherever you defined it
import { verifyUser } from "../middleware/auth";
import { supabase } from "../lib/supabase/server";

const router = Router();

type PhoneInput = {
  id?: string;
  value: string;
  label?: string;
  is_primary: boolean;
};

type EmailInput = {
  id?: string;
  value: string;
  label?: string;
  is_primary: boolean;
};

// Get all contacts for the authed user, lightrweight
router.get("/", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data ?? []); // don't give null if no data
});

// Create new contact and return it
router.post("/", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;

  req.body["user_id"] = userId;

  // insert data and grab that line
  const { data, error } = await supabase
    .from("contacts")
    .insert(req.body)
    .select()
    .single();

  if (error) {
    console.error("Insert contact error:", error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
});

// Edit contact with new data
router.patch("/:id", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  const contactId = req.params.id;

  // check to make sure the user owns the contact
  const { data: contact, error: fetchError } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !contact) {
    res.status(500).json({ error: fetchError });
    return;
  }

  // break down the full contact data to its individual tables
  const { phones, emails, social_accounts, photos, attributes, ...fields } =
    req.body;

  // update that row with the new data via req.body
  const { data: updatedContact, error: updateError } = await supabase
    .from("contacts")
    .update(fields)
    .eq("id", contactId)
    .select()
    .single();

  if (updateError) {
    console.log("update error");
    res.status(500).json({ error: updateError });
    return;
  }

  // make sure all passed in data is compatable with correct column names
  const normalizedPhones =
    phones?.map(({ value, ...rest }: PhoneInput) => ({
      ...rest,
      phone_number: value,
    })) ?? [];

  const normalizedEmails =
    emails?.map(({ value, ...rest }: EmailInput) => ({
      ...rest,
      email: value,
    })) ?? [];

  // update all subtables
  try {
    if (phones)
      await syncSubtable("contact_phone_numbers", contactId, normalizedPhones);
    if (emails)
      await syncSubtable("contact_emails", contactId, normalizedEmails);
    if (social_accounts)
      await syncSubtable("contact_social_accounts", contactId, social_accounts);
    if (photos) await syncSubtable("contact_photos", contactId, photos);
    if (attributes)
      await syncSubtable("contact_attributes", contactId, attributes);
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }

  res.status(200).json(updatedContact);
});

async function syncSubtable(table: string, contactId: string, newRows: any[]) {
  console.log("synctable", table);

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
      console.log(
        "match existing",
        JSON.stringify(match),
        "match newrow",
        JSON.stringify({ ...match, ...newRow })
      );

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

  console.log("update", toUpdate);
  console.log("insert", toInsert);
  console.log("delete", toDelete);
}

// Delete contact
router.delete("/:id", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  const contactId = req.params.id;

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId)
    .eq("user_id", userId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ success: true });
  return;
});

// Get all contact details linked to the given contact
router.get(
  "/:id/full",
  verifyUser,
  async (req: AuthedRequest, res: Response) => {
    const userId = req.user?.id;
    const contactId = req.params.id;

    if (!contactId) {
      res.status(401).json({ error: "Invalid contact ID" });
    }
    if (!userId) {
      res.status(401).json({ error: "Invalid user" });
    }

    // get base contact data
    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", userId)
      .eq("id", contactId)
      .single();

    if (contactError || !contact) {
      res.status(404).send({ error: "Not found or unauthorized" });
      return;
    }

    // Get all the attributes
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

    // Create final response
    const response = {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      avatar_url: contact.avatar_url,
      created_at: contact.created_at,
      organization: contact.organization,
      position: contact.position,

      emails,
      phones,
      social_accounts,
      photos,
      attributes,
    };

    res.status(200).json(response);
  }
);

export default router;
