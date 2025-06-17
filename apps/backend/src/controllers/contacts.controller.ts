import { supabase } from "../lib/supabase/server";
import { AuthedRequest } from "../types/express";
import { Router, Response } from "express";

import * as contactServices from "../services/contacts.services";
import { ContactSchema } from "../schemas/contact.schema";

export const getBasicContacts = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });

  try {
    const { data, error } = await contactServices.getBasicContacts(userId);

    // add data checking here to make sure it was valid, otherwise throw error

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data ?? []); // don't give null if no data
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const createContact = async (req: AuthedRequest, res: Response) => {
  const parseResult = ContactSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid input", issues: parseResult.error });
    return;
  }

  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });
  const validatedData = { ...parseResult.data, user_id: userId };

  try {
    console.log(validatedData);
    const { data, error } = await contactServices.createContact(validatedData);

    if (error) {
      console.error("Insert contact error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
