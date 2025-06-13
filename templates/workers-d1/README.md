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

4. **Start development servers:**
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
- `GET /api/hello` - Simple hello world endpoint
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

Add the integration script to your Webflow project (same as basic template) - see the main README for details.

## Deployment

1. **Create production database:**
   ```bash
   wrangler d1 create webflow-db-prod
   ```

2. **Update wrangler.jsonc** with production database ID

3. **Apply migrations to production:**
   ```bash
   npm run db:migrate:prod
   ```

4. **Deploy Workers:**
   ```bash
   npm run worker:deploy
   ```

## Development Tips

- Use `wrangler d1 execute` to run SQL commands during development
- Check the D1 dashboard in Cloudflare for database management
- Use proper indexes for better query performance
- Always test your database operations locally first 