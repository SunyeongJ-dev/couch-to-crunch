# Couch to Crunch

A full-stack workout video discovery app built with Next.js. Pulls curated YouTube workouts into a PostgreSQL database, and lets users filter, watch, and save favorites — with Google OAuth and localStorage fallback for guests.

---

## Project Overview

Couch to Crunch solves a specific problem: finding free, high-quality home workouts on YouTube is tedious. The app pre-fetches and classifies videos across 44 curated search queries, then exposes them through a filtered browse experience — no ads, no algorithm, just workouts.

Users can filter by level, type, and duration, save favorites (as a guest or signed in), and browse by channel. Saved videos sync from localStorage to the database automatically on login.

---

## Tech Stack

| Layer       | Technology                |
| ----------- | ------------------------- |
| Framework   | Next.js 16 (App Router)   |
| Language    | TypeScript                |
| Styling     | Tailwind CSS v4           |
| Database    | PostgreSQL via Prisma ORM |
| Auth        | NextAuth (Google OAuth)   |
| Data Source | YouTube Data API v3       |
| Deployment  | Vercel + Vercel Postgres  |

---

## Architecture

### App Structure

```
app/
├── (home)/          # Browse page with filters and video grid
├── watch/[id]/      # Video player with metadata and save button
├── saved/           # User's saved video collection
├── search/          # Server-rendered full-text search results
├── channel/[name]/  # Per-channel video listing
├── api/
│   ├── videos/      # Video fetching with filters
│   ├── saved-videos/# Save/unsave (auth + guest sync)
│   ├── auth/        # NextAuth Google OAuth handler
│   └── seed/        # YouTube → PostgreSQL pipeline
├── ui/              # Reusable components (Header, Sidebar, VideoCard, ...)
├── lib/             # Hooks (useSavedVideo, useSearch) and utilities
└── providers/       # Session and Sidebar context providers
```

### Data Flow

**Seed pipeline:** A script calls the YouTube Data API across 44 curated search queries, filters out Shorts and videos under 5 minutes, auto-classifies each video by type/level/duration using keyword matching, then upserts into PostgreSQL. Safe to re-run.

**User interactions:** Filtering and search are handled server-side via Prisma queries. Saves use optimistic UI updates on the client, writing to either localStorage (guest) or the database (authenticated). On login, any guest saves are synced to the database automatically.

### Schema

```
Video         — stores YouTube metadata and auto-classified tags
User          — stores authenticated user info
UserSavedVideo — join table linking users to saved videos
```

Since this app is scoped to YouTube and Google OAuth only, the YouTube video ID and Google user ID (`sub`) are used directly as primary keys. This keeps the schema simple given the fixed scope. In a more extensible app, using internal UUIDs as primary keys with external IDs stored as separate fields would be the more robust approach.

---

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

---

## Challenges & Solutions

### 1. Radio button losing checked state after re-render

Radio buttons appeared checked on initial render but became visually unchecked after any interaction. Initially suspected Tailwind v4's preflight CSS resetting `appearance` on form elements — but the actual root cause was two `<Filter>` components (mobile + desktop) both rendered in the DOM with the same `name="sort"` attribute. Browsers group all same-name radios document-wide, creating a 4-way conflict that overrode React's controlled state. Removing the `name` attribute let React take full control via the `checked` prop.

### 2. Deselectable radio button pattern

`onChange` on a radio input doesn't fire when clicking an already-selected option, making it impossible to deselect. Used `onClick` for the toggle logic (which fires on every click regardless of current state) alongside a no-op `onChange={() => {}}` to satisfy React's controlled input requirement.

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

---

## Live Demo

[couch-to-crunch.vercel.app](https://couch-to-crunch.vercel.app)
