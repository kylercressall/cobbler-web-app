import { Router, Response } from "express";
import type { AuthedRequest } from "../types/express"; // or wherever you defined it
import { verifyUser } from "../middleware/auth";
import { supabase } from "../lib/supabase/server";

const router = Router();

router.get("/name", verifyUser, async (req: AuthedRequest, res: Response) => {
  console.log("username requested api/user/name");

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "No user found" });
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .select("name")
    .eq("id", userId)
    .single();

  res.status(200).json(data);
});

export default router;
