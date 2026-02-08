// app/api/videos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
  // If the request includes an "ids" query parameter, we parse it to get a list of YouTube video IDs.
  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids");
  const ids = idsParam
    ? idsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  const rows = await prisma.video.findMany({
    // If ids are provided, filter by those IDs; otherwise, return all videos.
    where:
      ids.length > 0
        ? {
            youtubeId: { in: ids },
          }
        : undefined,
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

  // We then map the database rows to a format suitable for the client, converting the publishedAt date to an ISO string.
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
