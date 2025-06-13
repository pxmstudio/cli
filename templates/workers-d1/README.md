# Webflow + Cloudflare Workers + D1 Starter

This project provides a setup for building Webflow projects with Vite frontend, Cloudflare Workers backend, and Cloudflare D1 database.

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

3. **Apply database migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
├── src/
│   ├── main.ts              # Frontend entry point
│   └── types/               # TypeScript type definitions
├── worker/
│   └── index.ts             # Cloudflare Workers entry point with D1 integration
├── migrations/
│   └── 0001_initial.sql     # Database schema
├── vite.config.ts           # Vite configuration
└── wrangler.jsonc           # Cloudflare Workers + D1 configuration
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

### 3. Apply Migrations
```bash
# For local development
npm run db:migrate

# For production
npm run db:migrate:prod
```

## API Routes

The Workers backend includes:
- `GET /api/users` - Get all users from D1 database
- `POST /api/users` - Create a new user in D1 database

### Example Usage

```javascript
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

## Database Commands

```bash
# Create database
npm run db:create

# Apply migrations locally
npm run db:migrate

# Apply migrations to production
npm run db:migrate:prod

# Execute SQL command
npm run db:console "SELECT * FROM users"
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

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy via GitHub Integration:**
   - Push your code to a GitHub repository
   - In the Cloudflare Dashboard, go to Compute (Workers) > your Worker > Create
   - Under "Workers", click "Import a repository"
   - Select your repository and branch
   - Cloudflare will automatically deploy your Worker when you push changes

3. **Update the Webflow script** with your deployed Workers domain.

4. **Preview Deployments**
   Cloudflare automatically creates preview deployments for each code push to your repository. These previews are useful for:
   - Testing changes before they go to production
   - Sharing work-in-progress with clients
   - Reviewing changes in a staging environment
   
   Preview URLs follow this pattern:
   - Production: `https://your-worker.workers.dev`
   - Preview: `https://[deployment-id]-your-worker.workers.dev`
   
   To use a preview deployment:
   1. Push your changes to GitHub
   2. Find the preview URL in your GitHub pull request or Cloudflare dashboard
   3. Update the `staging` URL in your Webflow script to test the preview

## Development Tips

- Use `wrangler d1 execute` to run SQL commands during development
- Check the D1 dashboard in Cloudflare for database management
- Use proper indexes for better query performance
- Always test your database operations locally first