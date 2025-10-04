# 📂 Project Structure - Blessed Union Raffle

## Visual Directory Tree

```
blessedunion/
│
├── 📄 README.md                          ⭐ Start here - Main documentation
├── 📄 QUICKSTART.md                      🚀 5-minute setup guide
├── 📄 PROJECT_COMPLETE.md                ✅ Completion summary
├── 📄 IMPLEMENTATION_SUMMARY.md          📋 Feature overview
├── 📄 DATABASE_SCHEMA.md                 🗄️ Database documentation
├── 📄 SETUP_CRON.md                      ⏰ Cron job setup
├── 📄 TESTING_GUIDE.md                   🧪 Testing scenarios
├── 📄 DEPLOYMENT_CHECKLIST.md            🚀 Deployment guide
├── 📄 PROJECT_STRUCTURE.md               📂 This file
│
├── 📄 package.json                       📦 Dependencies & scripts
├── 📄 next.config.ts                     ⚙️ Next.js config (Preact)
├── 📄 tsconfig.json                      📘 TypeScript config
├── 📄 vercel.json                        ☁️ Vercel cron config
├── 📄 env.template                       🔑 Environment variables template
│
├── 📁 src/
│   └── 📁 app/
│       │
│       ├── 📄 layout.tsx                 🎨 Root layout
│       ├── 📄 page.tsx                   🏠 Landing page
│       ├── 📄 globals.css                🎨 Global styles
│       │
│       ├── 📁 [token]/                   🔗 Dynamic route for links
│       │   └── 📄 page.tsx               👤 Buyer flow page
│       │
│       ├── 📁 admin/                     👨‍💼 Admin section
│       │   └── 📄 page.tsx               📊 Statistics dashboard
│       │
│       ├── 📁 api/                       🔌 Backend APIs
│       │   │
│       │   ├── 📁 create-link/
│       │   │   └── 📄 route.ts           ➕ Create unique link
│       │   │
│       │   ├── 📁 link/
│       │   │   └── 📁 [token]/
│       │   │       └── 📄 route.ts       🔍 Get link info
│       │   │
│       │   ├── 📁 save-buyer/
│       │   │   └── 📄 route.ts           💾 Save buyer data
│       │   │
│       │   ├── 📁 claim-numbers/
│       │   │   └── 📄 route.ts           ✅ Register numbers
│       │   │
│       │   ├── 📁 sold/
│       │   │   └── 📄 route.ts           📋 Get sold numbers
│       │   │
│       │   ├── 📁 stats/
│       │   │   └── 📄 route.ts           📊 Get statistics
│       │   │
│       │   └── 📁 expire-links/
│       │       └── 📄 route.ts           ⏰ Expire old links
│       │
│       ├── 📁 components/                🧩 React components
│       │   ├── 📄 BuyerForm.tsx          📝 Buyer information form
│       │   └── 📄 RaffleBoard.tsx        🎯 Number selection board
│       │
│       ├── 📁 lib/                       🛠️ Utilities
│       │   └── 📄 utils.ts               🔧 Helper functions
│       │
│       └── 📁 store/                     📦 State management
│           └── 📄 useRaffleStore.ts      🏪 Zustand store
│
├── 📁 supabase/                          🗄️ Database
│   └── 📁 migrations/
│       └── 📄 expire_links_function.sql  ⏰ SQL expiration function
│
└── 📁 node_modules/                      📦 Dependencies (gitignored)
```

---

## File Descriptions

### 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| `README.md` | Complete project documentation | First time setup |
| `QUICKSTART.md` | Get running in 5 minutes | Quick start |
| `PROJECT_COMPLETE.md` | What was built | Overview |
| `DATABASE_SCHEMA.md` | Database structure | DB setup |
| `SETUP_CRON.md` | Cron job configuration | Deployment |
| `TESTING_GUIDE.md` | How to test | Before launch |
| `DEPLOYMENT_CHECKLIST.md` | Deploy step-by-step | Going live |

### 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, metadata |
| `next.config.ts` | Next.js settings, Preact optimization |
| `tsconfig.json` | TypeScript compiler options |
| `vercel.json` | Vercel deployment, cron jobs |
| `env.template` | Environment variables example |

### 🎨 Frontend Files

| File | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root layout, fonts, metadata |
| `app/page.tsx` | Landing page with animations |
| `app/[token]/page.tsx` | Dynamic buyer flow |
| `app/admin/page.tsx` | Statistics dashboard |

### 🧩 Components

| Component | Purpose | Used In |
|-----------|---------|---------|
| `BuyerForm.tsx` | Collect buyer information | Token page |
| `RaffleBoard.tsx` | Number selection interface | Token page |

### 🔌 API Routes

| Endpoint | File | Method | Purpose |
|----------|------|--------|---------|
| `/api/create-link` | `create-link/route.ts` | POST | Generate new link |
| `/api/link/[token]` | `link/[token]/route.ts` | GET | Get link details |
| `/api/save-buyer` | `save-buyer/route.ts` | POST | Save buyer info |
| `/api/claim-numbers` | `claim-numbers/route.ts` | POST | Register selection |
| `/api/sold` | `sold/route.ts` | GET | List sold numbers |
| `/api/stats` | `stats/route.ts` | GET | Raffle statistics |
| `/api/expire-links` | `expire-links/route.ts` | POST | Expire old links |

### 🛠️ Utilities

| File | Contains |
|------|----------|
| `lib/utils.ts` | Format numbers, validate data, error messages |
| `store/useRaffleStore.ts` | Zustand state management (optional) |

---

## Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. GET /{token}
       ▼
┌─────────────────────┐
│  [token]/page.tsx   │
│  (Dynamic Route)    │
└──────┬──────────────┘
       │
       │ 2. Fetch link info
       ▼
┌─────────────────────┐
│  /api/link/[token]  │
└──────┬──────────────┘
       │
       │ 3. Query Supabase
       ▼
┌─────────────────────┐
│   Supabase DB       │
│   (links table)     │
└──────┬──────────────┘
       │
       │ 4. Return data
       ▼
┌─────────────────────┐
│   BuyerForm.tsx     │ ─┐
└─────────────────────┘  │
                         │ 5. User fills form
┌─────────────────────┐  │
│  /api/save-buyer    │ ◄┘
└──────┬──────────────┘
       │
       │ 6. Save to DB
       ▼
┌─────────────────────┐
│  RaffleBoard.tsx    │ ─┐
└─────────────────────┘  │
       ▲                 │ 7. User selects
       │                 │
       │ 8. Fetch sold   │
┌─────────────────────┐  │
│   /api/sold         │  │
└─────────────────────┘  │
                         │
┌─────────────────────┐  │
│ /api/claim-numbers  │ ◄┘
└──────┬──────────────┘
       │
       │ 9. Save purchases
       ▼
┌─────────────────────┐
│   Supabase DB       │
│ (purchases table)   │
└─────────────────────┘
```

---

## Component Hierarchy

```
RootLayout (layout.tsx)
│
├── HomePage (page.tsx)
│   └── Landing page with links
│
├── TokenPage ([token]/page.tsx)
│   ├── BuyerForm
│   │   └── Form inputs
│   │       └── Submit button
│   │
│   └── RaffleBoard
│       ├── Number grid (1000 buttons)
│       └── Confirm button
│
└── AdminPage (admin/page.tsx)
    └── Stats cards
        ├── Numbers sold
        ├── Numbers available
        ├── Active links
        ├── Expired links
        ├── Opportunities total
        └── Opportunities remaining
```

---

## Database Schema Relationships

```
┌──────────────────┐
│      links       │
├──────────────────┤
│ id (PK)          │
│ token (UNIQUE)   │
│ opportunities    │
│ remaining        │
│ active           │
│ expires_at       │
│ buyer_name       │
│ buyer_email      │
│ buyer_phone      │
│ created_at       │
└────────┬─────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────┐
│    purchases     │
├──────────────────┤
│ id (PK)          │
│ link_id (FK) ────┘
│ number (UNIQUE)  │
│ created_at       │
└──────────────────┘
```

---

## API Request Flow

### Creating a Link

```
POST /api/create-link
Request:  { opportunities: 4 }
          ↓
Database: INSERT INTO links
          ↓
Response: { ok: true, link: "https://..." }
```

### Buyer Flow

```
GET /api/link/{token}
          ↓
POST /api/save-buyer
Request:  { token, name, email, phone }
          ↓
GET /api/sold
Response: { sold: ["001", "042", ...] }
          ↓
POST /api/claim-numbers
Request:  { token, numbers: ["001", "002"] }
          ↓
Database: INSERT INTO purchases (multiple)
          ↓
Database: UPDATE links SET remaining = remaining - 2
          ↓
Response: { ok: true, remaining: 2 }
```

---

## State Management

### Client State (React)
- Form inputs (useState)
- Number selection (useState)
- Loading states (useState)
- Animation states (Framer Motion)

### Server State (Supabase)
- Links data
- Purchases data
- Computed stats

### Optional Global State (Zustand)
- `useRaffleStore` available but not required
- Can be used for cross-component state

---

## Styling Architecture

### TailwindCSS Utilities
- Layout: `flex`, `grid`, `min-h-screen`
- Spacing: `p-4`, `m-8`, `gap-6`
- Colors: `bg-blue-500`, `text-gray-800`
- Responsive: `md:text-2xl`, `sm:flex-row`

### Framer Motion
- Page transitions
- Button interactions
- Loading spinners
- Success animations

### Design Tokens
- Colors: Defined in Tailwind config
- Fonts: Geist Sans (Next.js default)
- Spacing: 4px grid system
- Borders: Consistent radius values

---

## Environment Variables

### Required
```
NEXT_PUBLIC_SUPABASE_URL          # Public, client-side
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Public, client-side
SUPABASE_SERVICE_ROLE_KEY         # Secret, server-only
NEXT_PUBLIC_BASE_URL              # Public, client-side
CRON_SECRET                       # Secret, server-only
```

### Usage
- `NEXT_PUBLIC_*` = Available in browser
- Others = Server-side only

---

## Build & Deploy Flow

```
Local Development
  pnpm dev
     ↓
Git Commit
  git push
     ↓
Vercel CI/CD
  - Install dependencies
  - Build Next.js
  - Run type checks
  - Deploy to edge
     ↓
Production
  - HTTPS enabled
  - Edge functions
  - Cron jobs active
```

---

## Testing Strategy

### Manual Testing
1. Unit: Individual API endpoints
2. Integration: Complete user flows
3. UI: Visual regression
4. Performance: Lighthouse scores

### Automated (Future)
- Playwright for E2E
- Jest for unit tests
- React Testing Library

---

## Security Layers

```
Browser
  ↓ HTTPS
CDN (Vercel Edge)
  ↓ Token validation
API Routes
  ↓ Service role key
Supabase
  ↓ RLS policies
Database
```

---

## Performance Optimizations

1. **Bundle Size**
   - Preact in production
   - Code splitting
   - Tree shaking

2. **Database**
   - Indexes on frequent queries
   - Efficient JOIN operations
   - Connection pooling

3. **Frontend**
   - Image optimization
   - Lazy loading
   - Memoization

4. **Caching**
   - Static page generation
   - API route caching
   - CDN edge caching

---

## Monitoring Points

### Metrics to Track
- API response times
- Database query performance
- Error rates
- User conversion funnel
- Link usage patterns

### Tools
- Vercel Analytics
- Supabase Dashboard
- Browser DevTools
- Lighthouse CI

---

## Quick Reference

### Start Development
```bash
cd blessedunion
pnpm install
pnpm dev
```

### Access Points
- Landing: http://localhost:3000
- Admin: http://localhost:3000/admin
- Link: http://localhost:3000/{token}

### Common Tasks
```bash
# Type check
pnpm type-check

# Build
pnpm build

# Start production
pnpm start
```

---

**Navigate with confidence! 🗺️**
