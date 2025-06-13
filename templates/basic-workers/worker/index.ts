import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Bindings {
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

// API routes
app.get('/api/hello', (c) => c.json({ message: 'Hello from Cloudflare Workers -- DEV!' }))

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