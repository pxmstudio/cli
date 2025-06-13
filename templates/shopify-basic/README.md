# Shopify + Cloudflare Workers Starter

This project provides a setup for building Shopify applications with Vite frontend and Cloudflare Workers backend.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Shopify CLI globally:**
   ```bash
   npm install -g @shopify/cli
   ```

3. **Start development servers:**
   ```bash
   # Frontend
   npm run dev
   
   # Workers (in another terminal)
   npm run worker:dev
   ```

4. **Connect to your Shopify store:**
   ```bash
   shopify app dev
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

## Shopify Development

### Setting up your Shopify App

1. **Create a Shopify Partner account** at [partners.shopify.com](https://partners.shopify.com)
2. **Create a new app** in your Partner Dashboard
3. **Configure your app settings** in the Shopify CLI
4. **Update your app URLs** to point to your Cloudflare Workers deployment

### API Routes

The Workers backend includes:
- `GET /api/hello` - Simple hello world endpoint

Add Shopify-specific routes in `worker/index.ts`:
- Webhook handlers
- GraphQL API integrations
- OAuth flows

### Example Shopify Integration

```typescript
// In worker/index.ts
app.post('/api/webhooks/orders/paid', async (c) => {
  const hmac = c.req.header('X-Shopify-Hmac-Sha256')
  const body = await c.req.text()
  
  // Verify webhook
  // Process order
  
  return c.json({ received: true })
})
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

3. **Update your Shopify app settings** with the deployed Workers URL

## Development Tips

- Use ngrok or similar for local webhook testing
- Check the Shopify Developer Dashboard for logs and metrics
- Use Shopify CLI for app management and deployment
- Test your app thoroughly in a development store before going live 