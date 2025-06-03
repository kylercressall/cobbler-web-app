import { Request, Response, NextFunction } from "express";
import "../env";

import { supabase } from "../lib/supabase/server";

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.user = data.user;
  next();
}
