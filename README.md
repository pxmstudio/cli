# @pixelmakers/cli

🚀 A CLI tool to quickly scaffold Vite + Webflow / Shopify projects.

## Usage

```bash
npm install -g @pixelmakers/cli
pixelmakers my-app

# or use npx directly
npx @pixelmakers/cli my-app

# or use yarn
yarn global add @pixelmakers/cli
pixelmakers my-app
```

Then follow the prompts to select your preferred template!

## Platform Support

### 🌐 Webflow
- **Website Projects**: Vite frontend with Cloudflare Workers backend
  - Basic WF + Vite setup
  - WF + Vite + D1 Database  
  - WF + Vite + Supabase Database
- **App Projects**: Full Webflow app development with OAuth and API integration

### 🛍️ Shopify  
- **App Development**: Shopify app scaffold with Cloudflare Workers backend

## Optional Add-ons (Webflow Websites)
- **GSAP**: Professional animations and interactions
- **Swiper JS**: Modern touch slider library
- **@pixelmakers/elements**: Pixelmakers UI component library

## Features

✅ **Multiple Database Options**: Choose between Cloudflare D1 or Supabase  
✅ **Drizzle ORM Integration**: Optional type-safe database queries  
✅ **TypeScript Ready**: Full TypeScript support out of the box  
✅ **Hot Reload**: Development server with hot reload for both frontend and backend  
✅ **Production Ready**: Optimized build pipeline for deployment  
✅ **Webflow Integration**: Easy integration with Webflow via custom code injection  

## Getting Started

1. Create a new project:
   ```bash
   npx @pixelmakers/cli my-webflow-app
   cd my-webflow-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development:
   ```bash
   npm run dev
   ```

## Template Documentation

| Template | Description | Documentation |
|----------|-------------|---------------|
| `basic-workers` | Basic WF + Vite setup | [Readme](templates/basic-workers/README.md) |
| `workers-d1` | WF + Vite + D1 Database | [Readme](templates/workers-d1/README.md) |
| `workers-d1-drizzle` | WF + Vite + D1 Database with Drizzle ORM | [Readme](templates/workers-d1-drizzle/README.md) |
| `workers-supabase` | WF + Vite + Supabase Database | [Readme](templates/workers-supabase/README.md) |
| `workers-supabase-drizzle` | WF + Vite + Supabase Database with Drizzle ORM | [Readme](templates/workers-supabase-drizzle/README.md) |
| `webflow-app-starter` | Full Webflow app development with OAuth | [Readme](templates/webflow-app-starter/README.md) |
| `shopify-theme-starter` | Shopify app scaffold with Cloudflare Workers | [Readme](templates/shopify-theme-starter/README.md) |

## License

MIT License - see [LICENSE](LICENSE) for details.
