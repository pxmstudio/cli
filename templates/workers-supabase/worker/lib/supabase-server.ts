import { createClient } from "@supabase/supabase-js";
import type { Context } from "hono";

export const supabase = (c: Context) => {
    return createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
};
