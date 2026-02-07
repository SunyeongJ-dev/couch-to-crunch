import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import "dotenv/config";

const connectionString = process.env["POSTGRES_URL"];

if (!connectionString) {
  throw new Error("Missing POSTGRES_URL environment variable");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with dummy data...");

  await prisma.video.createMany({
    data: [
      {
        youtubeId: "dummy-video-1",
        title: "Dummy Cardio Workout",
        channel: "Couch to Crunch",
        viewCount: 0,
        publishedAt: new Date(),
        durationSec: 600,
        description: "This is a dummy video seeded via Prisma.",
        thumbnail: "https://placehold.co/600x400",
        tags: ["cardio", "beginner"],
      },
      {
        youtubeId: "dummy-video-2",
        title: "Dummy Stretch Routine",
        channel: "Couch to Crunch",
        viewCount: 0,
        publishedAt: new Date(),
        durationSec: 480,
        description: "Another dummy video for testing.",
        thumbnail: "https://placehold.co/600x400",
        tags: ["stretch", "mobility"],
      },
    ],
    skipDuplicates: true,
  });

  console.log("Dummy seed complete");
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
