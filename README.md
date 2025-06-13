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

4. Add the Webflow integration script to your Webflow project in **Settings > Custom Code > Footer Code**:
   ```html
   <script>
     (function () {
       const CONFIG = {
         localhost: 'http://localhost:5173',
         staging: 'https://your-staging-domain.workers.dev', 
         production: 'https://your-production-domain.workers.dev'
       };

       const PATHS = {
         localhost: ['@vite/client', 'src/main.ts'],
         build: ['/dist/main.js']
       };

       function loadScripts(urls) {
         urls.forEach(url => {
           const script = document.createElement('script');
           script.src = url;
           script.type = "module";
           script.onerror = () => console.error('Failed to load:', url);
           document.body.appendChild(script);
         });
       }

       function init() {
         // Try localhost first
         fetch(`${CONFIG.localhost}/${PATHS.localhost[0]}`, { method: 'HEAD', mode: 'no-cors' })
           .then(() => {
             // Localhost available
             console.log('🚀 Development mode');
             const urls = PATHS.localhost.map(path => `${CONFIG.localhost}/${path}`);
             loadScripts(urls);
           })
           .catch(() => {
             // Use staging or production
             const isStaging = window.location.href.includes('.webflow.io');
             const domain = isStaging ? CONFIG.staging : CONFIG.production;
             const env = isStaging ? 'staging' : 'production';
             
             console.log(`🌐 ${env.charAt(0).toUpperCase() + env.slice(1)} mode`);
             const urls = PATHS.build.map(path => domain + path);
             loadScripts(urls);
           });
       }

       // Start when ready
       document.readyState === 'loading' 
         ? document.addEventListener('DOMContentLoaded', init)
         : init();
     })();
   </script>
   ```

## Database Setup

### For D1 Templates
```bash
# Create D1 database
npm run db:create

# Apply migrations
npm run db:migrate

# For Drizzle templates, generate migrations
npm run db:generate
```

### For Supabase Templates
1. **Local Development (Automatic Setup):**
   ```bash
   npm run supabase:start
   ```
   The CLI automatically initializes a local Supabase instance with all services.

2. **Production Setup:**
   - Create a Supabase project at [https://supabase.com](https://supabase.com)
   - Set production environment variables:
     ```bash
     wrangler secret put SUPABASE_URL
     wrangler secret put SUPABASE_ANON_KEY
     ```

3. **For Drizzle templates:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

## Deployment

1. **Frontend**: The Vite build automatically creates optimized assets
2. **Workers**: Deploy using Wrangler
   ```bash
   npm run worker:deploy
   ```

## Development

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run worker:dev` - Start Workers development server
- `npm run worker:deploy` - Deploy Workers to Cloudflare

## Project Structure

```
my-webflow-app/
├── src/                    # Frontend source code
├── worker/                 # Cloudflare Workers code
├── public/                 # Static assets
├── migrations/             # Database migrations (D1 templates)
├── vite.config.ts         # Vite configuration
├── wrangler.jsonc         # Cloudflare Workers configuration
└── package.json
```

## License

MIT License - see [LICENSE](LICENSE) for details.
