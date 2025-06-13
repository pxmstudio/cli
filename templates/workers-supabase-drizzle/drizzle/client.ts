import type { Context } from "hono";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "./schema/users";

export const db = (c: Context) => drizzle(c.env.DB_URL, { schema: { users } });
