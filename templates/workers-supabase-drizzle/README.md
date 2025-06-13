# Webflow + Cloudflare Workers + Supabase Starter

This project provides a setup for building Webflow projects with Vite frontend, Cloudflare Workers backend, and local Supabase database.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Supabase CLI globally (if not already installed):**
   ```bash
   npm install -g supabase
   ```

3. **Start Supabase locally:**
   ```bash
   npm run supabase:start
   ```
   This will start a local Supabase instance with all services (PostgreSQL, API, Auth, etc.)

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
│   └── index.ts             # Cloudflare Workers entry point with Supabase integration
├── supabase/
│   ├── config.toml          # Supabase configuration
│   ├── migrations/          # Database migrations
│   └── seed.sql             # Initial data
├── dev.vars                 # Local environment variables (auto-created)
├── dev.vars.example         # Example environment variables
├── vite.config.ts           # Vite configuration
└── wrangler.jsonc           # Cloudflare Workers configuration
```

## Local Supabase Setup

### Automatic Setup
The CLI automatically initializes Supabase and creates a `dev.vars` file with local database credentials.

### Manual Setup (if needed)
```bash
# Initialize Supabase (if not done automatically)
supabase init

# Start local services
npm run supabase:start

# Check status
npm run supabase:status

# Reset database (clear all data)
npm run supabase:reset

# Stop services
npm run supabase:stop
```

### Environment Variables
Your local environment variables are stored in `.dev.vars`:
```bash
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Routes

The Workers backend includes:
- `GET /api/hello` - Simple hello world endpoint
- `GET /api/users` - Get all users from Supabase
- `POST /api/users` - Create a new user in Supabase

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

## Database Management

### Migrations
```bash
# Create a new migration
supabase migration new create_users_table

# Apply migrations
supabase db reset
```

### Drizzle Migrations
```bash
# Generate new migrations
npm run db:generate

# Apply migrations
npm run db:migrate
```

### Example Migration
Here's an example migration that creates a users table with Row Level Security. You can add it to supabase/migrations:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own data
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Create a policy that allows users to update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id);
```

### Studio Access
Access Supabase Studio at: http://localhost:54323

### Direct Database Access
```bash
# Connect to PostgreSQL directly
supabase db shell
```

## Adding to Webflow

Add the integration script to your Webflow project (same as basic template) - see the main README for details.

## Production Deployment

### 1. Create Production Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Update Production Environment
```bash
# Set production environment variables
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
```

### 3. Deploy
```bash
# Build frontend
npm run build

# Deploy Workers
npm run worker:deploy
```

## Development Tips

- Use Supabase Studio for database management
- Check logs in the Supabase dashboard
- Use Row Level Security (RLS) for data protection
- Test your API endpoints locally before deploying
- Keep your local and production schemas in sync with migrations

## Supabase Features Available

- **Database**: PostgreSQL with real-time subscriptions
- **Auth**: User authentication and authorization  
- **Storage**: File uploads and management
- **Edge Functions**: Server-side logic (alternative to Workers)
- **Real-time**: Live data synchronization 