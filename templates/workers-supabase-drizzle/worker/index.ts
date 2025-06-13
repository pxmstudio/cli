import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "../drizzle/client";
import { users } from "../drizzle/schema/users";

type Bindings = {
  DB: D1Database;
  DB_URL: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_ANON_KEY: string;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS configuration for all routes
app.use(
  "*",
  cors({
    origin: ["https://your-domain.io", "https://your-domain.com"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Type"],
    maxAge: 86400,
  }),
);

// Example CRUD operations using Drizzle ORM
app.get("/api/users", async (c) => {
  try {
    const dbClient = db(c);
    const allUsers = await dbClient.select().from(users);
    return c.json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching users: ", error);

    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

app.post("/api/users", async (c) => {
  try {
    const { name, email } = await c.req.json();
    const dbClient = db(c);

    const result = await dbClient.insert(users).values({
      name,
      email,
    }).returning();

    return c.json({ message: "User created successfully", user: result[0] });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      return c.json({ error: "Email already exists" }, 400);
    }
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Serve static assets - this should be last
app.get("/*", async (c) => {
  try {
    const url = new URL(c.req.url);
    const headers = new Headers();
    c.req.raw.headers.forEach((value, key) => {
      headers.set(key, value);
    });
    const request = new Request(url.toString(), {
      method: c.req.method,
      headers,
    });
    return await c.env.ASSETS.fetch(request);
  } catch (e) {
    return c.notFound();
  }
});

export default app;
