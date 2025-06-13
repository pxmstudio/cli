import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database,
  ASSETS: {
    fetch: (request: Request) => Promise<Response>
  }
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS configuration for all routes
app.use('*', cors({
  origin: ['https://your-domain.webflow.io', 'https://your-domain.com'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Type'],
  maxAge: 86400,
}))

// Example CRUD operations for a simple table
app.get('/api/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM users').all()
    return c.json({ users: results })
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

app.post('/api/users', async (c) => {
  try {
    const { name, email } = await c.req.json()
    const { success } = await c.env.DB.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
      .bind(name, email)
      .run()

    if (success) {
      return c.json({ message: 'User created successfully' })
    } else {
      return c.json({ error: 'Failed to create user' }, 500)
    }
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// Serve static assets - this should be last
app.get('/*', async (c) => {
  try {
    const url = new URL(c.req.url)
    const headers = new Headers()
    c.req.raw.headers.forEach((value, key) => {
      headers.set(key, value)
    })
    const request = new Request(url.toString(), {
      method: c.req.method,
      headers,
    })
    return await c.env.ASSETS.fetch(request)
  } catch (e) {
    return c.notFound()
  }
})

export default app