// app/watch/[id]/page.tsx

// notFound is a helper function from Next.js that triggers a 404 page when called.
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import WatchClient from "./watch-client";

// Define the type for the page props because we need to use it repeatedly.
type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  // Prisma functions make us don't have to write raw SQL queries.
  // findUnique is a Prisma method that retrieves a single record from the database based on a unique id.
  const video = await prisma.video.findUnique({
    where: { youtubeId: id },
    select: { title: true, channel: true },
    // This equals to the SQL query: SELECT title, channel FROM video WHERE youtubeId = params.id LIMIT 1;
  });

  if (!video) return { title: "Video not found" };

  return {
    title: `${video.title} | Couch to Crunch`,
    description: `Watch ${video.title} by ${video.channel}`,
  };
}

export default async function WatchPage({ params }: PageProps) {
  const { id } = await params;
  const video = await prisma.video.findUnique({
    where: { youtubeId: id },
  });

  if (!video) notFound();

  // We pass the video data to the WatchClient component after finding and fetching it.
  return <WatchClient video={video} />;
}

// async function always returns a promise. We use async/await because we fetch data from the database.
// TS can infer the return type of the function, so the functions above don't need explicit return types.
// They will return Promise<Metadata> and Promise<JSX.Element>.
