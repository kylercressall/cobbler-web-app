import "express";
import type { User } from "@supabase/supabase-js";

declare module "express" {
  interface Request {
    user?: User;
  }
}

import { Request } from "express";
import { User } from "@supabase/supabase-js";

export interface AuthedRequest extends Request {
  user?: User;
}
