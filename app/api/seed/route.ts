// app/api/seed/route.ts
import { NextResponse } from "next/server";
import { seedQueries } from "../../lib/seed-queries";
import { parseIso8601DurationToSeconds } from "../../lib/video-utils";
import { classifyTags } from "../../lib/classify";
import { prisma } from "../../lib/prisma";
import type { VideoData } from "../../lib/types";

// We use two endpoints: search to get video IDs, then videos to fetch full details for those IDs.
const YT_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YT_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

// Define types for the responses (res.json()) we get from the YouTube API.
type SearchResponse = {
  items?: { id?: { videoId?: string | null } | null }[];
};

type VideosResponse = {
  items?: {
    id?: string | null;
    snippet?: {
      title?: string;
      channelTitle?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: {
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
    contentDetails?: { duration?: string };
    statistics?: { viewCount?: string | number };
  }[];
};

// Ensure we have a valid YouTube API key in .env.
function assertApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("Missing YOUTUBE_API_KEY in .env.local");
  return key;
}

// Determine if a video is older than a certain number of years.
function isOlderThanYears(publishedAtIso: string, years: number): boolean {
  const d = new Date(publishedAtIso);
  if (Number.isNaN(d.getTime())) return false;

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);

  return d < cutoff;
}

// Filter out videos that are likely to be "noisy" content.
function isNoisy(video: VideoData): boolean {
  const text = `${video.title} ${video.description}`.toLowerCase();

  // Avoid this keywords
  const badWords = [
    "#shorts",
    "shorts",
    "reaction",
    "compilation",
    "asmr",
    "music",
    "review",
    "transformation",
    "prank",
    "fail",
    "funny",
    "meme",
    "how to",
    "why",
    "explained",
    "science",
    "research",
    "podcast",
    "interview",
    "talk",
    "lecture",
    "discussion",
    "lab",
    "clips",
  ];

  // Prevent conflicting with bad words, we allow "no music" videos even if they contain the word "music".
  const hasNoMusic = text.includes("no music");
  if (!hasNoMusic && badWords.some((w) => text.includes(w))) return true;

  // Longer than 5 minutes
  if (video.durationSec > 0 && video.durationSec < 300) return true;
  // No older than 5 years
  if (isOlderThanYears(video.publishedAt, 5)) return true;

  return false;
}

// Search video IDs for one query and one duration (medium or long).
// Defaults to 5 results unless maxResults is provided.
async function searchVideoIds(
  query: string,
  apiKey: string,
  duration: "medium" | "long",
  maxResults = 5,
) {
  const url = new URL(YT_SEARCH_URL);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("videoDuration", duration);
  url.searchParams.set("safeSearch", "strict");
  url.searchParams.set("relevanceLanguage", "en");
  url.searchParams.set("regionCode", "CA");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`search.list failed (${res.status}): ${text}`);
  }

  // Parse JSON into the expected shape.
  const data = (await res.json()) as SearchResponse;
  // Start from items (or empty array if missing).
  const ids: string[] = (data.items ?? [])
    // Pull videoId from each item.
    .map((it) => it.id?.videoId)
    // Remove empty/undefined and keep strings.
    .filter((id): id is string => Boolean(id));

  return ids;
}

// Fetch video details.
async function fetchVideoDetails(videoIds: string[], apiKey: string) {
  // YouTube videos.list max 50 ids per call
  const chunks: string[][] = [];
  const results: VideoData[] = [];

  for (let i = 0; i < videoIds.length; i += 50)
    chunks.push(videoIds.slice(i, i + 50));

  for (const chunk of chunks) {
    const url = new URL(YT_VIDEOS_URL);
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`videos.list failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as VideosResponse;
    for (const it of data.items ?? []) {
      if (!it.id) continue;
      const id = it.id;

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
        id,
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

export async function GET(req: Request) {
  try {
    const apiKey = assertApiKey();

    // Use a Set to avoid duplicate video IDs across queries and durations.
    const idSet = new Set<string>();

    // Start searching for video Ids.
    for (const q of seedQueries) {
      const mediumIds = await searchVideoIds(q, apiKey, "medium", 5);
      const longIds = await searchVideoIds(q, apiKey, "long", 5);

      [...mediumIds, ...longIds].forEach((id) => idSet.add(id));
    }

    // Convert the Set to an array.
    const ids = Array.from(idSet);

    // Fetch video details for the collected IDs.
    const raw = await fetchVideoDetails(ids, apiKey);

    // Apply noise filtering.
    const cleaned = raw.filter((v) => !isNoisy(v));

    let upserted = 0; // For logging how many videos we upsert into the database.
    for (const video of cleaned) {
      // Parse the publishedAt ISO string to date and skip if it's invalid.
      const publishedDate = new Date(video.publishedAt);
      if (Number.isNaN(publishedDate.getTime())) continue;

      // Start update and insert (upsert) video data into the database.
      await prisma.video.upsert({
        where: { id: video.id },
        create: {
          id: video.id,
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

    return NextResponse.json({
      ok: true,
      queries: seedQueries.length,
      idsCollected: ids.length,
      saved: cleaned.length,
      upserted,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: (err as Error)?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
