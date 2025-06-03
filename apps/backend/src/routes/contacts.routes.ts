import { Router, Response } from "express";
import type { AuthedRequest } from "../types/express"; // or wherever you defined it
import { verifyUser } from "../middleware/auth";
import { supabase } from "../lib/supabase/server";
import { verify } from "crypto";

const router = Router();

router.get("/", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "No user found" });
    return;
  }

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

router.post("/", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "No user found" });
    return;
  }

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

export default router;

router.patch("/:id", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  const contactId = req.params.id;

  if (!userId) {
    res.status(401).json({ error: "No user found" });
    return;
  }

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

router.delete("/:id", verifyUser, async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  const contactId = req.params.id;

  if (!userId) {
    res.status(401).json({ error: "No user found" });
    return;
  }

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
