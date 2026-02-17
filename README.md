# 📚 Markd — Smart Bookmark Manager

A beautiful, real-time bookmark manager built with **Next.js 14 (App Router)**, **Supabase** (Auth + Database + Realtime), and **Tailwind CSS**.

> **Live Demo:** `https://smart-bookmark-gules-two.vercel.app/`

---

## ✨ Features

- ✅ **Google OAuth only** — No passwords, instant sign-in
- 🔒 **Private bookmarks** — Row Level Security ensures your data stays yours
- ⚡ **Real-time sync** — Open two tabs, add a bookmark in one, see it appear in the other instantly
- 🚀 **Optimistic UI** — Bookmarks appear immediately without waiting for the server
- 🎨 **Beautiful design** — Warm, paper-like aesthetic with smooth animations
- 🖼️ **Auto favicons** — Each bookmark shows the site's icon automatically
- 🗑️ **One-click delete** — Hover over any bookmark to reveal the delete button

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + CSS Custom Properties |
| **Authentication** | Supabase Auth (Google OAuth via PKCE) |
| **Database** | Supabase (PostgreSQL with RLS) |
| **Realtime** | Supabase Realtime (Postgres CDC) |
| **Deployment** | Vercel |
| **Fonts** | Instrument Serif + DM Mono (Google Fonts) |

---

## 📁 Project Structure

```
smart-bookmark-app/
├── src/
│   ├── app/                                      # Next.js App Router
│   │   ├── layout.tsx                            # Root layout (fonts, metadata)
│   │   ├── globals.css                           # Tailwind + design tokens
│   │   ├── page.tsx                              # Dashboard (Server Component)
│   │   ├── login/
│   │   │   └── page.tsx                          # Login page
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts                      # OAuth callback handler
│   │   └── api/
│   │       └── bookmarks/
│   │           └── route.ts                      # POST (add) + DELETE endpoints
│   │
│   ├── components/
│   │   ├── LoginCard.tsx                         # Google sign-in card
│   │   ├── BookmarkDashboard.tsx                 # Main dashboard + Realtime
│   │   ├── AddBookmarkForm.tsx                   # Add bookmark form
│   │   ├── BookmarkList.tsx                      # List or empty state
│   │   └── BookmarkCard.tsx                      # Single bookmark row
│   │
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts                         # Browser Supabase client
│   │       └── server.ts                         # Server Supabase client
│   │
│   ├── middleware.ts                             # Auth guard (Edge Middleware)
│   └── types/
│       └── index.ts                              # TypeScript interfaces
│
├── .env.local.example                            # Environment variables template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn**
- A **Supabase account** (free tier works)
- A **Google Cloud account** (for OAuth)
- A **Vercel account** (for deployment)

---

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/Sangram10c/Smart-Bookmark
cd smart-bookmark-app

# Install dependencies
npm install

# Or if you're starting fresh:
npx create-next-app@14.2.5 smart-bookmark-app --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd smart-bookmark-app
npm install @supabase/supabase-js @supabase/ssr
```

---

### 2️⃣ Set Up Supabase

#### A) Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **New project**
3. Fill in project details and wait for setup to complete
4. Go to **Settings → API**
5. Copy:
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **anon public key** (starts with `eyJhbG...`)

#### B) Run Database Migration

1. Go to **Supabase Dashboard → SQL Editor**
2. Click **New query**
3. Paste the entire contents of `supabase/migrations/20240101000000_create_bookmarks.sql`
4. Click **Run**

**What this does:**
- Creates the `bookmarks` table
- Enables Row Level Security (RLS)
- Adds policies so users can only see their own bookmarks
- Enables Realtime for instant updates
- Creates an index for fast queries

#### C) Enable Realtime

1. Go to **Database → Replication**
2. Find `supabase_realtime` publication
3. Click **Edit**
4. Check ✅ the **bookmarks** table
5. Click **Save**

---

### 3️⃣ Set Up Google OAuth

#### A) Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**:
   - **APIs & Services → Library**
   - Search for "Google+ API"
   - Click **Enable**
4. Create OAuth credentials:
   - **APIs & Services → Credentials**
   - Click **+ Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Markd Bookmark App`
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://your-supabase-project.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/auth/callback
     https://your-supabase-project.supabase.co/auth/v1/callback
     ```
   - Click **Create**
5. Copy **Client ID** and **Client Secret**

#### B) Configure Supabase Authentication

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Find **Google** and click to expand
3. Enable **Google enabled**
4. Paste:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
5. Click **Save**

#### C) Configure Redirect URLs

1. Still in **Authentication**, go to **URL Configuration**
2. Set **Site URL:**
   ```
   http://localhost:3000
   ```
3. Add **Redirect URLs:**
   ```
   http://localhost:3000/auth/callback
   https://*.vercel.app/auth/callback
   ```
4. Click **Save**

---

### 4️⃣ Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and add your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 5️⃣ Run Locally

```bash
# Start development server
npm run dev
```

Visit **http://localhost:3000**

You should see:
- Login page with Google sign-in button
- Click it → redirects to Google
- After auth → redirects back to dashboard
- Add a bookmark → it appears instantly
- Open a second tab → the bookmark syncs in real-time

---

## 🌐 Deploy to Vercel

### 1️⃣ Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/your-username/smart-bookmark-app.git
git push -u origin main
```

### 2️⃣ Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repo
4. Add **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Click **Deploy**
6. Wait for deployment to complete
7. Copy your Vercel URL (e.g., `https://markd.vercel.app`)

### 3️⃣ Update OAuth Redirect URLs

#### A) Supabase

1. Go to **Authentication → URL Configuration**
2. Update **Site URL:**
   ```
   https://your-app.vercel.app
   ```
3. Add to **Redirect URLs:**
   ```
   https://your-app.vercel.app/auth/callback
   ```
4. Click **Save**

#### B) Google Cloud Console

1. Go to **APIs & Services → Credentials**
2. Click your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs:**
   ```
   https://your-app.vercel.app/auth/callback
   ```
4. Click **Save**

⏳ **Wait 5 minutes** for Google OAuth changes to propagate.

---

## 🧪 Testing the Deployed App

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Clear cookies or use **Incognito mode**
3. Click **Continue with Google**
4. Sign in with your Google account
5. You should be redirected to the dashboard
6. Add a bookmark by pasting a URL and giving it a title
7. Open the app in a **second tab or device**
8. Add/delete a bookmark in one tab → it should appear/disappear in the other **instantly**

---

## 🐛 Troubleshooting

### Problem: "Invalid OAuth Redirect URI"

**Solution:** Make sure you added your Vercel URL to:
- Supabase → Authentication → URL Configuration → Redirect URLs
- Google Cloud Console → OAuth → Authorized redirect URIs

Format: `https://your-app.vercel.app/auth/callback` (no trailing slash)

---

### Problem: Bookmarks don't sync in real-time

**Solution:**
1. Check Supabase → Database → Replication
2. Make sure `bookmarks` is in the `supabase_realtime` publication
3. Or run this SQL:
   ```sql
   alter publication supabase_realtime add table public.bookmarks;
   ```

---

### Problem: "Permission denied for table bookmarks"

**Solution:** RLS policies are missing. Re-run the migration SQL:
```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'bookmarks';

-- If empty, re-run the entire migration
```

---

### Problem: Environment variables not working on Vercel

**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Make sure variables are set for **all environments** (Production, Preview, Development)
3. After adding/changing, go to **Deployments → Redeploy**

---

### Problem: "500 Internal Server Error" or middleware crash

**Solution:** Make sure your `src/middleware.ts` is using the simplified Edge-compatible version (see the code in the repo).

---

### Problem: Can't sign in with Google

**Check these:**
1. Google Cloud Console → OAuth consent screen is configured
2. Your email is added as a test user (if app is in testing mode)
3. Client ID and Secret are correct in Supabase
4. Redirect URIs match exactly (no typos, no trailing slashes)
5. Wait 5 minutes after making OAuth changes

---

## 📊 Database Schema

```sql
-- bookmarks table
CREATE TABLE public.bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  title      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX bookmarks_user_id_created_at_idx 
  ON public.bookmarks (user_id, created_at DESC);
```

**Row Level Security (RLS) Policies:**
- ✅ Users can SELECT their own bookmarks
- ✅ Users can INSERT bookmarks (user_id is auto-set)
- ✅ Users can DELETE their own bookmarks

---

## 🔒 Security Model

### Row Level Security (RLS)
Every database query runs through PostgreSQL-level policies. Even if someone bypasses the application layer, they **cannot** read another user's bookmarks.

### Server-Side Validation
All Route Handlers (`/api/bookmarks`) verify `auth.getUser()` before mutations. The JWT is validated server-side, not just client-side.

### Realtime Security
The Realtime filter `user_id=eq.<uid>` is applied client-side AND enforced server-side via RLS on the replication stream.

### HTTP-Only Cookies
Session tokens are stored in `httpOnly` cookies set by Supabase SSR helpers. They're inaccessible to JavaScript, preventing XSS attacks.

---

## 🎨 Design Philosophy

**Aesthetic:** Warm, paper-like texture with a "developer's notebook" feel

**Key Design Choices:**
- **Instrument Serif** (italic) for headings — elegant and distinctive
- **DM Mono** for body text — clean and technical
- **Terracotta accent color** (#c0522a) — warm, inviting, memorable
- **Subtle paper grain** texture overlay for depth
- **Smooth animations** using cubic-bezier easing for premium feel
- **No bullet points** in empty states — conversational prose instead

---

## 🧩 Key Components

### `BookmarkDashboard.tsx`
- Main client component that owns the bookmarks state
- Subscribes to Supabase Realtime on mount
- Handles optimistic updates for instant UI feedback

### `AddBookmarkForm.tsx`
- Controlled form with URL validation
- Auto-suggests hostname as title when URL field loses focus
- Shows success state (green checkmark) for 2 seconds after saving

### `BookmarkCard.tsx`
- Fetches favicon from Google's public API
- Displays relative timestamps ("2 minutes ago")
- Hover reveals delete button (owner only)
- Optimistic delete — removes from UI before server confirms

### `src/middleware.ts`
- Edge Runtime middleware that runs on every request
- Refreshes Supabase session cookies (prevents expiry)
- Redirects unauthenticated users to `/login`

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.0.1"
  }
}
```

---

## 🛠️ Development Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📝 Problems Encountered & Solutions

### Problem 1: `cookies()` is async in Next.js 14.2+

**Symptom:** `TypeError: cookies() should be awaited`

**Solution:** Added `async` to `createClient()` in `src/lib/supabase/server.ts`:
```ts
export async function createClient() {
  const cookieStore = await cookies()
  // ...
}
```

---

### Problem 2: Realtime events arriving twice

**Symptom:** Bookmarks appeared duplicated when added

**Solution:** Added deduplication check in the Realtime handler:
```ts
setBookmarks((prev) => {
  if (prev.some(b => b.id === incoming.id)) return prev  // dedup
  return [incoming, ...prev]
})
```

---

### Problem 3: Session not persisting after OAuth

**Symptom:** After Google OAuth, user landed on dashboard but `getUser()` returned `null`

**Solution:** Created `/auth/callback` route handler that calls `supabase.auth.exchangeCodeForSession(code)` to write tokens into cookies.

---

### Problem 4: Middleware redirecting the callback route

**Symptom:** Infinite redirect loop at `/auth/callback`

**Solution:** Updated middleware to exclude `/auth/**` paths from the auth guard.

---

### Problem 5: Realtime not working in production

**Symptom:** Changes in one tab didn't appear in another after deploying

**Solution:** Added the bookmarks table to the `supabase_realtime` publication:
```sql
alter publication supabase_realtime add table public.bookmarks;
```

---

### Problem 6: Next.js Image component blocking Google avatars

**Symptom:** `Error: Invalid src prop (https://lh3.googleusercontent.com/...)`

**Solution:** Added domain to `next.config.js`:
```js
images: {
  domains: ['lh3.googleusercontent.com'],
}
```

---

### Problem 7: Middleware failing on Vercel Edge Runtime

**Symptom:** `500: MIDDLEWARE_INVOCATION_FAILED` after deployment

**Solution:** Simplified middleware to use Edge-compatible APIs only (no Node.js-specific code).

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Vercel** for seamless Next.js deployment
- **Google Fonts** for Instrument Serif and DM Mono
- **Next.js team** for the incredible App Router

---

## 📧 Support

If you have questions or run into issues:
1. Check the **Troubleshooting** section above
2. Open an issue on GitHub
3. Check [Supabase Discord](https://discord.supabase.com)
4. Check [Next.js Discord](https://nextjs.org/discord)

---

**Built with Sangram using Next.js, Supabase, and Tailwind CSS**