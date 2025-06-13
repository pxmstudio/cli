import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/api/hello', (c) => c.json({ message: 'Hello from Cloudflare Workers with Supabase!' }))

// Example CRUD operations using Supabase
app.get('/api/users', async (c) => {
  try {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      return c.json({ error: error.message }, 500)
    }
    
    return c.json({ users })
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

app.post('/api/users', async (c) => {
  try {
    const { name, email } = await c.req.json()
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email }])
      .select()
    
    if (error) {
      return c.json({ error: error.message }, 500)
    }
    
    return c.json({ message: 'User created successfully', user: data[0] })
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400)
  }
})

export default app