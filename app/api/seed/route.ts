import { NextResponse } from "next/server";
import { seedQueries } from "../../lib/seed-queries";
import { parseIso8601DurationToSeconds } from "../../lib/video-utils";
import { classifyTags } from "../../lib/classify";

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

type CachedVideo = {
  youtubeId: string;
  title: string;
  channel: string;
  viewCount: number;
  publishedAt: string;
  durationSec: number;
  description: string;
  thumbnail: string;
  tags: string[];
};

// This API route is used to seed the videos cache by fetching data from the YouTube API.
// It collects video IDs based on predefined search queries, fetches their details,
// filters out noisy videos, and saves the cleaned data to a local JSON file.
// This route is intended to be called manually (e.g. via curl) whenever we want to refresh the cache.
const YT_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YT_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

// Helper function to ensure we have the YouTube API key available
function assertApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("Missing YOUTUBE_API_KEY in .env.local");
  return key;
}

// Utility function to determine if a video is older than a certain number of years
function isOlderThanYears(publishedAtIso: string, years: number): boolean {
  const d = new Date(publishedAtIso);
  if (Number.isNaN(d.getTime())) return false;

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);

  return d < cutoff;
}

// Heuristic function to filter out "noisy" videos that we don't want in our cache
function isNoisy(video: CachedVideo): boolean {
  const text = `${video.title} ${video.description}`.toLowerCase();

  // shorts/noise
  const badWords = [
    "#shorts",
    "shorts",
    "reaction",
    "compilation",
    "asmr",
    "music",
  ];
  if (badWords.some((w) => text.includes(w))) return true;

  // too short
  if (video.durationSec > 0 && video.durationSec < 300) return true;
  // too old
  if (isOlderThanYears(video.publishedAt, 5)) return true;

  return false;
}

// Function to search for video IDs based on a query using the YouTube Search API
async function searchVideoIds(query: string, apiKey: string, maxResults = 10) {
  const url = new URL(YT_SEARCH_URL);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("safeSearch", "strict");
  url.searchParams.set("relevanceLanguage", "en");
  url.searchParams.set("regionCode", "CA");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`search.list failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const ids: string[] = (data.items ?? [])
    .map((it: any) => it.id?.videoId)
    .filter(Boolean);

  return ids;
}

// Function to fetch detailed information for a list of video IDs using the YouTube Videos API
async function fetchVideoDetails(videoIds: string[], apiKey: string) {
  // YouTube videos.list max 50 ids per call
  const chunks: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50)
    chunks.push(videoIds.slice(i, i + 50));

  const results: CachedVideo[] = [];
  // For each chunk of video IDs, fetch their details and construct CachedVideo objects
  for (const chunk of chunks) {
    const url = new URL(YT_VIDEOS_URL);
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);
    // We use cache: "no-store" to ensure we get fresh data from the YouTube API every time we run the seed script
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`videos.list failed (${res.status}): ${text}`);
    }
    // The YouTube API returns a lot of data, but we only extract the fields we care about for our cache
    const data = await res.json();
    for (const it of data.items ?? []) {
      const youtubeId = it.id as string;

      const title = it.snippet?.title ?? "";
      const channel = it.snippet?.channelTitle ?? "";
      const description = it.snippet?.description ?? "";
      const publishedAt = it.snippet?.publishedAt ?? "";

      const thumb =
        it.snippet?.thumbnails?.high?.url ??
        it.snippet?.thumbnails?.medium?.url ??
        it.snippet?.thumbnails?.default?.url ??
        "";

      const viewCount = Number(it.statistics?.viewCount ?? 0);

      const isoDur = it.contentDetails?.duration ?? "PT0S";
      const durationSec = parseIso8601DurationToSeconds(isoDur);

      const tags = classifyTags(title, description);

      results.push({
        youtubeId,
        title,
        channel,
        viewCount,
        publishedAt,
        durationSec,
        description,
        thumbnail: thumb,
        tags,
      });
    }
  }

  return results;
}

export async function GET() {
  try {
    const apiKey = assertApiKey();

    // 1) collect ids
    const idSet = new Set<string>();

    for (const q of seedQueries) {
      const ids = await searchVideoIds(q, apiKey, 10);
      ids.forEach((id) => idSet.add(id));
    }

    const ids = Array.from(idSet);

    // 2) fetch details
    const raw = await fetchVideoDetails(ids, apiKey);

    // 3) filter noise
    const cleaned = raw.filter((v) => !isNoisy(v));

    // 4) upsert(update & insert) to DB
    let upserted = 0;
    for (const video of cleaned) {
      const publishedDate = new Date(video.publishedAt);
      if (Number.isNaN(publishedDate.getTime())) continue;

      await prisma.video.upsert({
        where: { youtubeId: video.youtubeId },
        create: {
          youtubeId: video.youtubeId,
          title: video.title,
          channel: video.channel,
          viewCount: video.viewCount,
          publishedAt: publishedDate,
          durationSec: video.durationSec,
          description: video.description,
          thumbnail: video.thumbnail,
          tags: video.tags,
        },
        update: {
          title: video.title,
          channel: video.channel,
          viewCount: video.viewCount,
          publishedAt: publishedDate,
          durationSec: video.durationSec,
          description: video.description,
          thumbnail: video.thumbnail,
          tags: video.tags,
        },
      });
      upserted++;
    }

    // old way using local JSON file:
    // const outPath = path.join(process.cwd(), "app", "lib", "videos-cache.json");
    // await fs.writeFile(outPath, JSON.stringify(cleaned, null, 2), "utf-8");

    return NextResponse.json({
      ok: true,
      queries: seedQueries.length,
      idsCollected: ids.length,
      saved: cleaned.length,
      upserted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
