// app/api/videos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  const rows = await prisma.video.findMany({
    select: {
      youtubeId: true,
      title: true,
      channel: true,
      viewCount: true,
      publishedAt: true,
      durationSec: true,
      description: true,
      thumbnail: true,
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const data = rows.map((v) => ({
    youtubeId: v.youtubeId,
    title: v.title,
    channel: v.channel,
    viewCount: v.viewCount,
    publishedAt: v.publishedAt.toISOString(),
    durationSec: v.durationSec,
    description: v.description,
    thumbnail: v.thumbnail,
    tags: v.tags,
  }));

  return NextResponse.json(data);
}
