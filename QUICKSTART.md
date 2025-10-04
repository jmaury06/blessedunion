# ⚡ Quick Start Guide - Blessed Union Raffle

Get the raffle app running in **5 minutes**.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Supabase account (free tier works)

---

## Step 1: Install Dependencies

```bash
cd blessedunion
pnpm install
```

---

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in / Sign up
3. Click "New Project"
4. Fill in project details
5. Wait for database to be ready (~2 minutes)

### 2.2 Create Database Tables

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  opportunities INTEGER NOT NULL CHECK (opportunities IN (2, 4, 6, 8, 10)),
  remaining INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ NOT NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(number)
);

-- Indexes
CREATE INDEX idx_links_token ON links(token);
CREATE INDEX idx_links_active_expires ON links(active, expires_at);
CREATE INDEX idx_purchases_link_id ON purchases(link_id);
CREATE INDEX idx_purchases_number ON purchases(number);
```

3. Click "Run"
4. Verify tables were created in Table Editor

### 2.3 Get API Keys

1. Supabase Dashboard → Settings → API
2. Copy:
   - **Project URL** (starts with https://...supabase.co)
   - **anon public** key
   - **service_role** key (⚠️ Keep this secret!)

---

## Step 3: Configure Environment Variables

```bash
# Copy template
cp env.template .env.local

# Edit .env.local with your values
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=generate-random-secret
```

Generate CRON_SECRET:
```bash
openssl rand -base64 32
```

---

## Step 4: Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the Blessed Union landing page! 🎉

---

## Step 5: Test the App

### Create a test link

```bash
curl -X POST http://localhost:3000/api/create-link \
  -H "Content-Type: application/json" \
  -d '{"opportunities": 4}'
```

Response:
```json
{
  "ok": true,
  "link": "http://localhost:3000/abc123def456"
}
```

### Open the link

1. Copy the link URL from the response
2. Open it in your browser
3. Fill in the buyer form
4. Select 4 numbers
5. Confirm selection
6. Success! ✅

---

## Step 6: View Statistics

Open [http://localhost:3000/admin](http://localhost:3000/admin)

You'll see:
- Total links created
- Active/expired links
- Numbers sold/available
- Sales percentage

---

## Common Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm type-check

# Lint code
pnpm lint
```

---

## Verify Everything Works

### ✅ Checklist

- [ ] App loads at localhost:3000
- [ ] Can create a link via API
- [ ] Link opens buyer form
- [ ] Can submit buyer information
- [ ] Number board displays correctly
- [ ] Can select numbers
- [ ] Selection confirmation works
- [ ] Admin page shows stats
- [ ] Supabase tables contain data

---

## Next Steps

1. **Read the docs:** Check out `README.md` for full documentation
2. **Test thoroughly:** Follow `TESTING_GUIDE.md`
3. **Deploy:** When ready, follow `DEPLOYMENT_CHECKLIST.md`

---

## Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules .next
pnpm install
```

### Supabase connection fails

- Verify your API keys in `.env.local`
- Check Supabase project is active
- Ensure tables exist in Table Editor

### Build fails

```bash
# Type check
pnpm type-check

# Check for errors
pnpm lint
```

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

---

## Need Help?

- 📖 **Full Documentation:** `README.md`
- 🗄️ **Database Schema:** `DATABASE_SCHEMA.md`
- 🧪 **Testing Guide:** `TESTING_GUIDE.md`
- 🚀 **Deployment:** `DEPLOYMENT_CHECKLIST.md`
- ⏰ **Cron Setup:** `SETUP_CRON.md`

---

## Development Tips

### Hot Module Replacement
Changes to code auto-reload in browser. No need to restart server.

### Supabase Table Editor
Use it to manually view/edit data while developing.

### Browser DevTools
- Console: Check for errors
- Network: Monitor API calls
- Application: Check localStorage

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer

---

**You're all set! Happy coding! 🎉**
