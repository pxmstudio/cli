import { Hono } from "hono";
import { cors } from "hono/cors";
import { supabase } from "./lib/supabase";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS configuration for all routes
app.use(
  "*",
  cors({
    origin: ["https://px-sandbox.webflow.io", "https://localhost:5173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Type"],
    maxAge: 86400,
  }),
);

app.get(
  "/api/hello",
  (c) => c.json({ message: "Hello from Cloudflare Workers with Supabase!" }),
);

// Example CRUD operations using Supabase
app.get("/api/users", async (c) => {
  console.log("c.env: ", c.env);

  try {
    const { data: users, error } = await supabase(c)
      .from("users")
      .select("*");

    console.log("users: ", users);

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ users });
  } catch (error) {
    console.log("error: ", error);

    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

app.post("/api/users", async (c) => {
  try {
    const { name, email } = await c.req.json();

    console.log("name: ", name);
    console.log("email: ", email);

    const { data, error } = await supabase(c)
      .from("users")
      .insert([{ name, email }])
      .select();

    console.log("data: ", data);
    console.log("error: ", error);

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ message: "User created successfully", user: data[0] });
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
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
