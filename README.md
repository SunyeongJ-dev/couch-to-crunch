# Couch to Crunch

A focused workout video hub that pulls curated YouTube workouts, stores them in a Postgres database, and lets users filter, watch, and save favorites.

## MVP Features

- Browse a grid of workout videos with filters (sort, level, type, duration)
- Watch page with embedded player, metadata, and tags
- Save/unsave videos (localStorage)
- Seed pipeline that fetches from YouTube and upserts into Postgres

## Tech Stack

- TypeScript
- Next.js App Router + React
- Tailwind CSS
- Prisma + PostgreSQL

## Environment Variables

Create a `.env` file:

```env
POSTGRES_URL=YOUR_POSTGRES_URL
DATABASE_URL=YOUR_PRISMA_DATABASE_URL
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```

## Setup

```
npm install
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000

## Seeding (YouTube -> DB)

```curl
http://localhost:3000/api/seed
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint

## Notes

- Saved videos are stored in localStorage.
- The saved list is resolved via `GET /api/videos?ids=...`.
