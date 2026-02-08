// app/watch/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "../../lib/prisma";
import WatchClient from "./watch-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { youtubeId: id },
    select: { title: true, channel: true },
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

  return <WatchClient video={video} />;
}
