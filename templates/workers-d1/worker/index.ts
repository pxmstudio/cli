import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/api/hello', (c) => c.json({ message: 'Hello from Cloudflare Workers with D1!' }))

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

export default app