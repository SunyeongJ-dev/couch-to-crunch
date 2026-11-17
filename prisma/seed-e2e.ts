// prisma/seed-e2e.ts
// Fills an empty database with a small, fixed set of fake videos for Playwright (E2E) tests.
// Used in CI, where we start a fresh Postgres and have no YouTube API key.
// Run: npm run test:db:seed  (needs POSTGRES_URL)
//
// The data is chosen so every E2E test has something to check:
// - "Newest" first video (yoga) is different from "Most Viewed" first video (legs).
// - Only one video has the "yoga" tag, so the Yoga filter shows fewer cards.
// - One title contains "legs" for the search test.
// - Two channels have more than one video, for the channel page tests.
import { prisma, pool } from "../app/lib/prisma";

const longDescription = (topic: string) =>
  `${topic} workout made for E2E tests.\n\n` +
  "This is fake data used only in CI. ".repeat(10) +
  "\n\nEquipment: none.\nLevel: see tags.";

const videos = [
  {
    id: "e2eVideo001",
    title: "Morning Yoga Flow for Beginners",
    channel: "Calm Flow Studio",
    viewCount: 1200,
    publishedAt: new Date("2026-10-01T10:00:00Z"),
    durationSec: 25 * 60,
    tags: ["yoga", "beginner"],
  },
  {
    id: "e2eVideo002",
    title: "20 Minute Legs and Glutes Workout",
    channel: "Strong Daily",
    viewCount: 85000,
    publishedAt: new Date("2026-09-15T10:00:00Z"),
    durationSec: 20 * 60,
    tags: ["strength", "intermediate"],
  },
  {
    id: "e2eVideo003",
    title: "Full Body HIIT Cardio",
    channel: "Strong Daily",
    viewCount: 15000,
    publishedAt: new Date("2026-08-20T10:00:00Z"),
    durationSec: 30 * 60,
    tags: ["hiit", "cardio", "advanced"],
  },
  {
    id: "e2eVideo004",
    title: "Gentle Full Body Stretch",
    channel: "Calm Flow Studio",
    viewCount: 4000,
    publishedAt: new Date("2026-07-10T10:00:00Z"),
    durationSec: 15 * 60,
    tags: ["stretching", "beginner"],
  },
  {
    id: "e2eVideo005",
    title: "Indoor Walking Workout",
    channel: "Step Together",
    viewCount: 30000,
    publishedAt: new Date("2026-06-01T10:00:00Z"),
    durationSec: 45 * 60,
    tags: ["walking", "cardio", "beginner"],
  },
];

async function main() {
  // Start from a clean table so every run has exactly the same data.
  await prisma.video.deleteMany();
  await prisma.video.createMany({
    data: videos.map((v) => ({
      ...v,
      description: longDescription(v.title),
      thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    })),
  });
  console.log(`Seeded ${videos.length} E2E videos.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
