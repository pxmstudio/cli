import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Bindings {

}

const app = new Hono<{ Bindings: Bindings }>()

// CORS configuration for all routes
app.use('*', cors({
    origin: ['https://pxmdev.myshopify.com', 'https://pxmdev.com'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Type'],
    maxAge: 86400,
}))

// API routes
app.get('/api/hello', (c) => c.json({ message: 'Hello from Cloudflare Workers!' }))

export default app