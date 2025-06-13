# Webflow + Cloudflare Workers Starter

This project provides a basic setup for building Webflow projects with Vite frontend and Cloudflare Workers backend.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   This starts the Vite development server on `http://localhost:5173`

3. **Start Workers development server:**
   ```bash
   npm run worker:dev
   ```
   This starts the Cloudflare Workers dev server on `http://localhost:8787`

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

## Adding to Webflow

Add this script to your Webflow project in **Settings > Custom Code > Footer Code**:

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

## Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy the Workers:**
   ```bash
   npm run worker:deploy
   ```

3. **Update the Webflow script** with your deployed Workers domain.

## API Routes

The Workers backend includes:
- `GET /api/hello` - Simple hello world endpoint

Add more routes in `worker/index.ts` as needed.

## Development Workflow

1. Start both development servers (`npm run dev` and `npm run worker:dev`)
2. Make changes to your frontend code in `src/`
3. Make changes to your backend code in `worker/`
4. Test your integration in Webflow with the development script
5. Deploy when ready! 