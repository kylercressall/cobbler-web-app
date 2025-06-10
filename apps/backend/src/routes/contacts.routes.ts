import { Router, Response } from "express";
import type { AuthedRequest } from "../types/express"; // or wherever you defined it
import { verifyUser } from "../middleware/auth";
import { supabase } from "../lib/supabase/server";

const router = Router();

// Get all contacts for the authed user, lightrweight
router.get("/", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId);

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

  const updateFields = req.body;

  // update that row with the new data via req.body
  const { data: updatedContact, error: updateError } = await supabase
    .from("contacts")
    .update(updateFields)
    .eq("id", contactId)
    .select()
    .single();

  if (updateError) {
    res.json(500).json({ error: updateError });
    return;
  }

  console.log("Update success:", updatedContact);

  res.status(200).json(updatedContact);
});

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
    }

    console.log("backend: ", contact);

    // Get all the attributes
    const [emailsRes, phonesRes, socialsRes, photosRes, attributesRes] =
      await Promise.all([
        supabase
          .from("contact_emails")
          .select("email, label, is_primary")
          .eq("contact_id", contactId),
        supabase
          .from("contact_phone_numbers")
          .select("phone_number, label, is_primary")
          .eq("contact_id", contactId),
        supabase
          .from("contact_social_accounts")
          .select("platform, username, url")
          .eq("contact_id", contactId),
        supabase
          .from("contact_photos")
          .select("photo_url, description")
          .eq("contact_id", contactId),
        supabase
          .from("contact_attributes")
          .select("key, value, label")
          .eq("contact_id", contactId),
      ]);

    const emails =
      emailsRes.data?.map((e) => ({
        value: e.email,
        label: e.label,
        is_primary: e.is_primary,
      })) ?? [];

    const phones =
      phonesRes.data?.map((p) => ({
        value: p.phone_number,
        label: p.label,
        is_primary: p.is_primary,
      })) ?? [];

    const social_accounts =
      socialsRes.data?.map((s) => ({
        platform: s.platform,
        username: s.username,
        url: s.url,
      })) ?? [];

    const photos =
      photosRes.data?.map((p) => ({
        url: p.photo_url,
        description: p.description,
      })) ?? [];

    const attributes =
      attributesRes.data?.map((a) => ({
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
