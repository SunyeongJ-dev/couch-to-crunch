// app/api/update-videos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const YT_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

function assertApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("Missing YOUTUBE_API_KEY in .env.local");
  return key;
}

type VideosResponse = {
  items?: {
    id?: string | null;
    statistics?: { viewCount?: string | number };
  }[];
};

type VideoViewCount = {
  id: string;
  viewCount: number;
};

async function fetchVideoViewCounts(videoIds: string[], apiKey: string) {
  // YouTube videos.list max 50 ids per call
  const chunks: string[][] = [];
  const results: VideoViewCount[] = [];

  for (let i = 0; i < videoIds.length; i += 50)
    chunks.push(videoIds.slice(i, i + 50));

  for (const chunk of chunks) {
    const url = new URL(YT_VIDEOS_URL);
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`videos.list failed (${res.status}): ${text}`);
    }

    const viewCounts = (await res.json()) as VideosResponse;
    for (const it of viewCounts.items ?? []) {
      if (!it.id) continue;
      const id = it.id;

      const viewCount = Number(it.statistics?.viewCount ?? 0);

      results.push({
        id,
        viewCount,
      });
    }
  }

  return results;
}

export async function GET() {
  const apiKey = assertApiKey();

  const videos = await prisma.video.findMany({
    select: {
      id: true,
    },
  });

  const videoIds = videos.map((video) => video.id);

  const viewCounts = await fetchVideoViewCounts(videoIds, apiKey);

  for (const video of viewCounts) {
    await prisma.video.update({
      where: { id: video.id },
      data: { viewCount: video.viewCount },
    });
  }

  return NextResponse.json({
    ok: true,
    updated: viewCounts.length,
  });
}
