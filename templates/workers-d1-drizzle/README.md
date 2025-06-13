# Webflow + Cloudflare Workers + D1 + Drizzle Starter

This project provides a setup for building Webflow projects with Vite frontend, Cloudflare Workers backend, Cloudflare D1 database, and Drizzle ORM for type-safe database operations.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create D1 database:**
   ```bash
   npm run db:create
   ```
   This will create a new D1 database. Copy the database ID from the output and update `wrangler.jsonc`.

3. **Update Configuration:**
   - Add the database to `wrangler.jsonc`
   - Replace "webflow-db" with your actual DB name in `package.json`

4. **Generate Drizzle Files:**
   ```bash
   npx wrangler d1 execute DB_NAME --local --command='SELECT 1'
   ```
   This will generate necessary files in the `.wrangler` directory.

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
├── src/
│   ├── main.ts              # Frontend entry point
│   └── types/               # TypeScript type definitions
├── worker/
│   └── index.ts             # Cloudflare Workers entry point with D1 + Drizzle integration
├── db/
│   ├── schema.ts           # Drizzle schema definitions
│   └── migrations/         # Database migrations
├── vite.config.ts          # Vite configuration
└── wrangler.jsonc          # Cloudflare Workers + D1 configuration
```

## Database Setup

### 1. Create Database
```bash
npm run db:create
```

### 2. Update Configuration
Update `wrangler.jsonc` with your database ID:
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webflow-db",
      "database_id": "your-actual-database-id-here"
    }
  ]
}
```

### 3. Database Management
```bash
# View database in Drizzle Studio
npm run db:studio

# Apply migrations locally
npm run db:migrate

# Apply migrations to production
npm run db:migrate:prod
```

## API Routes

The Workers backend includes:
- `GET /api/users` - Get all users from D1 database
- `POST /api/users` - Create a new user in D1 database

### Example Usage

```typescript
// Create a user
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
})

// Get all users  
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data.users))
```

## Adding to Webflow

Add this script to your Webflow project in **Settings > Custom Code > Footer Code**:

```html
<script>
  (function () {
    const CONFIG = {
      localhost: 'http://localhost:5173',
      staging: 'https://[deployment-id]-your-worker.workers.dev', 
      production: 'https://your-worker.workers.dev'
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

1. **Build and Deploy:**
   ```bash
   npm run build
   ```

2. **Configure Cloudflare Build Command:**
   Add the following command to your Cloudflare Dashboard:
   ```bash
   npm run build && npm run db:migrate:prod
   ```

3. **Deploy via GitHub Integration:**
   - Push your code to a GitHub repository
   - In the Cloudflare Dashboard, go to Compute (Workers) > your Worker > Create
   - Under "Workers", click "Import a repository"
   - Select your repository and branch
   - Cloudflare will automatically deploy your Worker when you push changes

4. **Update the Webflow script** with your deployed Workers domain.

## Development Tips

- Use Drizzle Studio (`npm run db:studio`) to view and manage your database
- Leverage Drizzle's type-safe query builder for database operations
- Always test your database operations locally first
- Use proper indexes for better query performance
- Check the D1 dashboard in Cloudflare for database management