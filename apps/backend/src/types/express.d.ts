import "express";
import type { User } from "@supabase/supabase-js";

import { Request } from "express";
import { User } from "@supabase/supabase-js";

declare module "express" {
  interface Request {
    user?: User;
  }
}

export interface AuthedRequest extends Request {
  user?: User;
}
