# Couch to Crunch

A full-stack workout video discovery app built with Next.js. Pulls curated YouTube workouts into a PostgreSQL database, and lets users filter, watch, and save favorites, with Google OAuth and localStorage fallback for guests.

**Live:** [couch-to-crunch.vercel.app](https://couch-to-crunch.vercel.app)

---

## Key Features

**Video Discovery & Filtering**

- Browse a responsive video grid with multi-select filters: level, type, duration, and sort order
- Collapsible sidebar with context-based state management for clean mobile UX
- Channel pages with dynamic routing and per-channel sort controls

**Search**

- Server-side full-text search with case-insensitive, multi-word title matching (Prisma + PostgreSQL)

**Save System**

- Dual storage: localStorage for guests, PostgreSQL for authenticated users
- Auto-sync: saved videos in localStorage are uploaded to the database on login
- Optimistic UI updates for instant save/unsave feedback

**Authentication**

- Google OAuth via NextAuth
- Session JWT carries `userId` for secure server-side data access

**YouTube Seed Pipeline**

- Fetches from 32 curated search queries across workout categories
- Auto-classifies videos by type, level, and duration using keyword matching
- Filters out noise (Shorts, old content, videos under 5 min)
- Upserts into PostgreSQL — safe to re-run

**Performance**

- Skeleton loading screens for async pages
- Next.js Image component for automatic image optimization

---

## Tech Stack

| Layer       | Technology                |
| ----------- | ------------------------- |
| Framework   | Next.js 15 (App Router)   |
| Language    | TypeScript                |
| Styling     | Tailwind CSS v4           |
| Database    | PostgreSQL via Prisma ORM |
| Auth        | NextAuth (Google OAuth)   |
| Data Source | YouTube Data API v3       |
| Deployment  | Vercel + Vercel Postgres  |

---

## Project Structure

```
app/
├── (home)/          # Browse page with filters and video grid
├── watch/[id]/      # Video player with metadata and save button
├── saved/           # User's saved video collection
├── search/          # Server-rendered search results
├── channel/[name]/  # Per-channel video listing
├── api/
│   ├── videos/      # Video fetching with filters
│   ├── saved-videos/# Save/unsave (auth + localStorage sync)
│   ├── auth/        # NextAuth Google OAuth handler
│   └── seed/        # YouTube → PostgreSQL pipeline
├── ui/              # Reusable components (Header, Sidebar, ...)
├── lib/             # Hooks (useSavedVideo, useSearch) and utilities
└── providers/       # Session and Sidebar context providers
```

---

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment variables**

Create a `.env` file:

```env
POSTGRES_URL=YOUR_POSTGRES_URL
DATABASE_URL=YOUR_PRISMA_DATABASE_URL
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

**3. Run database migrations**

```bash
npx prisma migrate dev
```

**4. Seed the database**

```bash
curl http://localhost:3000/api/seed
```

Add `?clear=1` to wipe existing videos before seeding.

**5. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Run production server    |
| `npm run lint`  | Run ESLint               |
