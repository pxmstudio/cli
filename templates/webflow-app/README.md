# Webflow App + Cloudflare Workers Starter

This project provides a setup for building Webflow applications with Vite frontend and Cloudflare Workers backend.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development servers:**
   ```bash
   # Frontend
   npm run dev
   
   # Workers (in another terminal)
   npm run worker:dev
   ```

## Project Structure

```
├── src/
│   ├── main.ts              # Frontend entry point
│   └── types/               # TypeScript type definitions
├── worker/
│   └── index.ts             # Cloudflare Workers entry point
├── public/                  # Static assets
├── vite.config.ts           # Vite configuration
└── wrangler.jsonc           # Cloudflare Workers configuration
```

## Webflow App Development

### Setting up your Webflow App

1. **Access the Webflow Developer Portal** at [developers.webflow.com](https://developers.webflow.com)
2. **Create a new app** in your developer account
3. **Configure your app settings:**
   - App name and description
   - OAuth redirect URLs
   - Webhooks endpoints
   - Required scopes

### App Configuration

Update `wrangler.jsonc` with your app-specific settings:

```jsonc
{
  "name": "webflow-app",
  "main": "worker/index.ts",
  "compatibility_date": "2024-09-25",
  "compatibility_flags": ["nodejs_compat"],
  
  "vars": {
    "WEBFLOW_CLIENT_ID": "your-webflow-client-id",
    "WEBFLOW_CLIENT_SECRET": "your-webflow-client-secret",
    "VITE_API_URL": "http://localhost:8787"
  }
}
```

### API Routes

The Workers backend includes:
- `GET /api/hello` - Simple hello world endpoint

Add Webflow-specific routes in `worker/index.ts`:

```typescript
// OAuth flow
app.get('/auth/webflow', async (c) => {
  const authUrl = `https://webflow.com/oauth/authorize?response_type=code&client_id=${c.env.WEBFLOW_CLIENT_ID}&redirect_uri=${redirectUri}`
  return c.redirect(authUrl)
})

// Webhook handler
app.post('/webhooks/site_publish', async (c) => {
  const payload = await c.req.json()
  
  // Handle site publish event
  console.log('Site published:', payload.siteId)
  
  return c.json({ received: true })
})

// API proxy
app.get('/api/sites', async (c) => {
  const accessToken = c.req.header('Authorization')
  
  const response = await fetch('https://api.webflow.com/sites', {
    headers: {
      'Authorization': accessToken,
      'Accept-Version': '1.0.0'
    }
  })
  
  return c.json(await response.json())
})
```

### Frontend Integration

In your `src/main.ts`, you can interact with the Webflow API through your Workers backend:

```typescript
// Get user's sites
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sites`, {
  headers: {
    'Authorization': `Bearer ${userAccessToken}`
  }
})
const sites = await response.json()
```

## Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy the Workers:**
   ```bash
   npm run worker:deploy
   ```

3. **Update your Webflow app settings** with the deployed Workers URLs:
   - OAuth redirect URI
   - Webhook endpoints

## Development Tips

- Use the Webflow API documentation for integration details
- Test your app with a development site first
- Handle OAuth flows securely through your Workers backend
- Use environment variables for sensitive configuration
- Monitor your app's usage in the Webflow Developer Portal

## Webflow API Resources

- [Webflow API Documentation](https://developers.webflow.com/docs)
- [OAuth Authentication Guide](https://developers.webflow.com/docs/oauth)
- [Webhooks Documentation](https://developers.webflow.com/docs/webhooks)
- [API Rate Limits](https://developers.webflow.com/docs/rate-limits) 