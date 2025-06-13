import type { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";

export const db = (c: Context) => drizzle(c.env.DB);