# Couch to Crunch

## Project Overview

Couch to Crunch is a full-stack workout discovery app that organizes curated YouTube workout videos into a searchable and filterable catalog. Built with Next.js, TypeScript, Prisma, and PostgreSQL, it includes Google authentication, guest-to-user save synchronization, automated daily view-count updates, and automated testing.

[Live Demo](https://couch-to-crunch.vercel.app)

![Couch to Crunch screenshot](./public/screenshot.png)

## Tech Stack

| Layer       | Technology                |
| ----------- | ------------------------- |
| Framework   | Next.js 16 (App Router)   |
| Language    | TypeScript                |
| Styling     | Tailwind CSS v4           |
| Database    | PostgreSQL via Prisma ORM |
| Auth        | NextAuth (Google OAuth)   |
| Data Source | YouTube Data API v3       |
| Testing     | Jest, Playwright          |
| Automation  | Vercel Cron Jobs          |
| Deployment  | Vercel + Vercel Postgres  |

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database (local or hosted)
- Google OAuth credentials
- YouTube Data API key

### Installation

```bash
git clone https://github.com/SunyeongJ-dev/couch-to-crunch.git
cd couch-to-crunch
npm install
```

### Environment Variables

Create a `.env.local` file:

```bash
DATABASE_URL=
YOUTUBE_API_KEY=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CRON_SECRET=
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Database Setup

Run the Prisma migrations:

```bash
npx prisma migrate dev
```

Start the development server, then open:

```bash
http://localhost:3000/api/seed
```

to populate the database with curated YouTube workout videos.

### Testing

```bash
# Unit tests
npm run test:unit

# End-to-end tests
npm run test:e2e
```

## Architecture

### App Structure

```

app/
├── (home)/         # Browse page with filters and video grid
├── api/
│ ├── auth/         # NextAuth Google OAuth handler
| ├── clear-videos/ # Clear all videos from database (dev only)
│ ├── saved-videos/ # Save/unsave (auth + guest sync)
│ ├── seed/         # YouTube → PostgreSQL pipeline (dev only)
| ├── update-videos/# Update YouTube view counts
│ └── videos/       # Video fetching with filters
├── channel/[name]/ # Per-channel video listing
├── lib/            # Hooks (useSavedVideo, useSearch) and utilities
├── privacy-policy/ # Privacy Policy page
├── providers/      # Session and Sidebar context providers
├── saved/          # User's saved video collection
├── search/         # Server-rendered keyword search results
├── ui/             # Reusable components (Header, Sidebar, VideoCard, ...)
└── watch/[id]/     # Video player with metadata and save button

```

### Data Flow

**Seed pipeline:** The `/api/seed` route calls the YouTube Data API across 44 curated search queries, filters out Shorts, videos under 5 minutes, and other non-workout content, auto-classifies each video by type/level/duration using keyword matching, then upserts into PostgreSQL. Safe to re-run.

**User interactions:** Filtering and search are handled server-side via Prisma queries. Saves use optimistic UI updates on the client, writing to either localStorage (guest) or the database (authenticated). On login, any guest saves are synced to the database automatically.

**Scheduled updates:** Vercel Cron Jobs trigger a daily API route that fetches current YouTube view counts through the YouTube Data API and updates the corresponding PostgreSQL records.

### Schema

```

Video — stores YouTube metadata and auto-classified tags
User — stores authenticated user info
UserSavedVideo — join table linking users to saved videos

```

Since the application is scoped to YouTube and Google OAuth, YouTube video IDs and Google user IDs are used directly as primary keys.

## Key Features

**Video Discovery & Filtering**

- Filters for level, type (multi-select), duration, and sort order
- Collapsible sidebar on desktop (React Context) and accordion on mobile
- Channel pages with dynamic routing and per-channel sort controls

**Search**

- Server-side search with case-insensitive substring matching per word (OR logic across words) via Prisma `contains`

**Save System**

- Dual storage: localStorage for guests, PostgreSQL for authenticated users
- Auto-sync: guest saves are uploaded to the database on login
- Save/unsave updates local state immediately without waiting for the server response

**Authentication**

- Google OAuth via NextAuth
- Session JWT carries `userId` for secure server-side data access

**Automated Video Statistics**

- Daily view-count updates using Vercel Cron Jobs
- Fetches current statistics from the YouTube Data API
- Updates existing PostgreSQL records automatically

## Challenges & Solutions

### 1. Radio button losing checked state after re-render

Radio buttons appeared checked on initial render but became visually unchecked after any interaction. Initially suspected Tailwind v4's preflight CSS resetting `appearance` on form elements — but the actual root cause was two `<Filter>` components (mobile + desktop) both rendered in the DOM with the same `name="sort"` attribute. Browsers group all same-name radios document-wide, creating a 4-way conflict that overrode React's controlled state. Removing the `name` attribute let React take full control via the `checked` prop.

### 2. Deselectable checkbox button pattern

`onChange` on a checkbox input doesn't fire when clicking an already-selected option, making it impossible to deselect. Used `onClick` for the toggle logic (which fires on every click regardless of current state) alongside a no-op `onChange={() => {}}` to satisfy React's controlled input requirement.

### 3. Partial string matching in keyword classification

When classifying video tags using `String.includes()`, short keywords like `"pro"` unintentionally matched substrings in unrelated words (e.g. `"improve"`), causing incorrect tag assignments. Replaced with a word boundary regex (`\b`) to ensure keywords are matched as whole words only.

### 4. API over-fetching in `useSavedVideo`

Each `VideoCard` instance called `useSavedVideo` independently, resulting in N×fetch requests for N cards on the page. Implemented module-level shared state with a pub/sub pattern so all hook instances share a single fetch.

### 5. Sidebar state persistence and hydration mismatch

The `isCollapsed` state reset to its default on every page navigation. Moving it to `localStorage` introduced a hydration mismatch because the server had no access to client storage. Migrated state to a React Context provider with an `isMounted` guard to defer localStorage reads until after hydration.

### 6. Guest session race condition

`loadForGuest()` was called twice during page load because the session transitioned from `undefined` → `null`, and the effect treated each as a distinct change. This caused UI flickering on the Saved page. Fixed by adding an early return when `session === undefined` and deriving a `sessionStatus` value to use as the effect dependency, so the transition is detected as a single event.

### 7. Vercel build failure due to missing Prisma client

TypeScript type errors only appeared in the Vercel build, not locally — because `prisma generate` hadn't run in the CI environment. Fixed by adding `"postinstall": "prisma generate"` to `package.json`, ensuring the client is always generated after `npm install`.
