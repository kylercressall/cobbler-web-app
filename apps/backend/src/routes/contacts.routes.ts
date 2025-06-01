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

router.post(
  "/createContact",
  verifyUser,
  async (req: AuthedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "No user found" });
      return;
    }

    req.body["user_id"] = userId;

    console.log(req.body);

    const { error } = await supabase.from("contacts").insert(req.body);
    if (error) console.error(error);
  }
);

export default router;
