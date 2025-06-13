import { Hono } from 'hono'
const app = new Hono()

app.get('/api/hello', (c) => c.json({ message: 'Hello from Cloudflare Workers!' }))

export default app