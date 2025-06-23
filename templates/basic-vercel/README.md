# Webflow + Hono + Vite + Vercel Starter

This project provides a modern setup for building Webflow projects with Vite frontend and Hono backend deployed on Vercel Edge Functions.

## Features

- **Frontend**: Vite with TypeScript for fast development and optimized builds
- **Backend**: Hono framework with Vercel Edge Functions for serverless API
- **Development**: Hot module replacement and integrated dev server
- **Dependencies**: GSAP for animations, Swiper for carousels, and more
- **CORS**: Pre-configured CORS for cross-origin requests
- **TypeScript**: Full TypeScript support for both frontend and backend

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   This starts both the Vite development server on `http://localhost:5173` and the Hono API server

3. **For production-like testing:**
   ```bash
   npm run start
   ```
   This uses Vercel's development environment

## Project Structure

```
├── api/
│   └── [[...route]].ts      # Hono API routes (Vercel Edge Functions)
├── src/
│   ├── main.ts              # Frontend entry point
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── vite.config.ts           # Vite configuration with Hono dev server
├── vercel.json              # Vercel deployment configuration
└── package.json             # Dependencies and scripts
```

## Adding to Webflow

Add this script to your Webflow project in **Settings > Custom Code > Footer Code**:

```html
<script>
  (function () {
    const CONFIG = {
      localhost: 'http://localhost:5173',
      staging: 'https://your-project-staging.vercel.app', 
      production: 'https://your-project.vercel.app'
    };

    const PATHS = {
      localhost: ['@vite/client', 'src/main.ts'],
      build: ['/main.js']
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

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in your project directory
   - Follow the prompts to link your project
   - For production: `vercel --prod`

3. **GitHub Integration:**
   - Push your code to a GitHub repository
   - Connect your repository in the Vercel dashboard
   - Vercel will automatically deploy on every push

4. **Update the Webflow script** with your deployed Vercel domain.

## API Routes

The Hono backend includes:
- `GET /api/` - Root API endpoint
- `GET /api/hello` - Example hello world endpoint

Add more routes in `api/[[...route]].ts`:

```typescript
app.get('/users', (c) => {
  return c.json({ users: [] })
})

app.post('/contact', async (c) => {
  const body = await c.req.json()
  // Handle contact form submission
  return c.json({ success: true })
})
```

## Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=http://localhost:5173
```

For production, set environment variables in your Vercel dashboard.

## Development Workflow

1. Start development server (`npm run dev`)
2. Make changes to your frontend code in `src/`
3. Make changes to your backend code in `api/`
4. Test your integration in Webflow with the development script
5. Deploy when ready!

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run start` - Start Vercel development environment
- `npm run typecheck` - Run TypeScript type checking

## Dependencies

### Frontend
- **GSAP** - Professional animation library
- **Swiper** - Modern mobile touch slider
- **intl-tel-input** - International telephone input

### Backend
- **Hono** - Fast, lightweight web framework
- **@hono/vite-dev-server** - Development server integration

### Development
- **Vite** - Next generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **Vercel** - Deployment platform
